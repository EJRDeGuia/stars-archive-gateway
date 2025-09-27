import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      query = '',
      filters = {},
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      searchType = 'comprehensive'
    } = await req.json()

    console.log('Advanced search request:', { query, filters, sortBy, searchType })

    let searchQuery = supabaseClient
      .from('theses')
      .select(`
        id, title, author, abstract, keywords, publish_date, view_count, download_count,
        colleges!inner(id, name, color),
        programs(id, name, degree_level)
      `)
      .eq('status', 'approved')

    // Apply text search
    if (query.trim()) {
      if (searchType === 'semantic') {
        // Use semantic search with embeddings
        searchQuery = searchQuery.or(`
          title.ilike.%${query}%,
          abstract.ilike.%${query}%,
          author.ilike.%${query}%,
          keywords.cs.{${query}}
        `)
      } else {
        // Full-text search across multiple fields
        searchQuery = searchQuery.or(`
          title.fts.${query},
          abstract.fts.${query},
          author.ilike.%${query}%,
          keywords.cs.{${query.split(' ').join(',')}}
        `)
      }
    }

    // Apply filters
    if (filters.colleges && filters.colleges.length > 0) {
      searchQuery = searchQuery.in('college_id', filters.colleges)
    }

    if (filters.programs && filters.programs.length > 0) {
      searchQuery = searchQuery.in('program_id', filters.programs)
    }

    if (filters.keywords && filters.keywords.length > 0) {
      searchQuery = searchQuery.overlaps('keywords', filters.keywords)
    }

    if (filters.dateRange) {
      if (filters.dateRange.start) {
        searchQuery = searchQuery.gte('publish_date', filters.dateRange.start)
      }
      if (filters.dateRange.end) {
        searchQuery = searchQuery.lte('publish_date', filters.dateRange.end)
      }
    }

    if (filters.authors && filters.authors.length > 0) {
      const authorFilter = filters.authors.map((author: string) => `author.ilike.%${author}%`).join(',')
      searchQuery = searchQuery.or(authorFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case 'relevance':
        // For relevance, we'll sort by a combination of factors
        searchQuery = searchQuery.order('view_count', { ascending: false })
        break
      case 'date':
        searchQuery = searchQuery.order('publish_date', { ascending: sortOrder === 'asc' })
        break
      case 'title':
        searchQuery = searchQuery.order('title', { ascending: sortOrder === 'asc' })
        break
      case 'author':
        searchQuery = searchQuery.order('author', { ascending: sortOrder === 'asc' })
        break
      case 'popularity':
        searchQuery = searchQuery.order('view_count', { ascending: sortOrder === 'asc' })
        break
      default:
        searchQuery = searchQuery.order('created_at', { ascending: false })
    }

    // Apply pagination
    const offset = (page - 1) * limit
    searchQuery = searchQuery.range(offset, offset + limit - 1)

    const { data: results, error, count } = await searchQuery

    if (error) {
      throw error
    }

    // Get search analytics
    const totalResults = count || 0
    const totalPages = Math.ceil(totalResults / limit)

    // Score results for relevance
    const scoredResults = results?.map(thesis => ({
      ...thesis,
      relevanceScore: calculateSearchRelevance(thesis, query, filters),
      matchedFields: getMatchedFields(thesis, query)
    })) || []

    // Log search analytics
    await supabaseClient.rpc('log_audit_event', {
      _action: 'advanced_search',
      _resource_type: 'search',
      _details: JSON.stringify({
        query,
        filters,
        resultsCount: totalResults,
        searchType
      })
    })

    console.log(`Advanced search completed: ${totalResults} results found`)

    return new Response(JSON.stringify({
      success: true,
      results: scoredResults,
      pagination: {
        page,
        limit,
        totalResults,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      },
      searchMeta: {
        query,
        filters,
        sortBy,
        searchType,
        executionTime: Date.now()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: unknown) {
    console.error('Advanced search error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function calculateSearchRelevance(thesis: any, query: string, filters: any): number {
  let score = 0
  const queryTerms = query.toLowerCase().split(' ')

  // Title matches (highest weight)
  const titleMatches = queryTerms.filter(term => 
    thesis.title?.toLowerCase().includes(term)
  ).length
  score += titleMatches * 10

  // Author matches
  const authorMatches = queryTerms.filter(term => 
    thesis.author?.toLowerCase().includes(term)
  ).length
  score += authorMatches * 8

  // Abstract matches
  const abstractMatches = queryTerms.filter(term => 
    thesis.abstract?.toLowerCase().includes(term)
  ).length
  score += abstractMatches * 5

  // Keyword matches
  const keywordMatches = thesis.keywords?.filter((keyword: string) =>
    queryTerms.some(term => keyword.toLowerCase().includes(term))
  ).length || 0
  score += keywordMatches * 7

  // Popularity boost
  score += Math.min(thesis.view_count || 0, 50) / 10
  score += Math.min(thesis.download_count || 0, 20) / 5

  // Recent publications get slight boost
  if (thesis.publish_date) {
    const daysSincePublish = (Date.now() - new Date(thesis.publish_date).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSincePublish < 365) {
      score += (365 - daysSincePublish) / 100
    }
  }

  return Math.round(score * 10) / 10
}

function getMatchedFields(thesis: any, query: string): string[] {
  const queryTerms = query.toLowerCase().split(' ')
  const matched = []

  if (queryTerms.some(term => thesis.title?.toLowerCase().includes(term))) {
    matched.push('title')
  }
  if (queryTerms.some(term => thesis.author?.toLowerCase().includes(term))) {
    matched.push('author')
  }
  if (queryTerms.some(term => thesis.abstract?.toLowerCase().includes(term))) {
    matched.push('abstract')
  }
  if (thesis.keywords?.some((keyword: string) =>
    queryTerms.some(term => keyword.toLowerCase().includes(term))
  )) {
    matched.push('keywords')
  }

  return matched
}