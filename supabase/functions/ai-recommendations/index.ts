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

    const { userId, thesisId, type = 'similar', limit = 5 } = await req.json()
    console.log('Generating recommendations for:', { userId, thesisId, type })

    let recommendations = []

    if (type === 'similar' && thesisId) {
      // Get similar theses based on keywords and college
      const { data: currentThesis } = await supabaseClient
        .from('theses')
        .select('keywords, college_id, author')
        .eq('id', thesisId)
        .single()

      if (currentThesis) {
        const { data: similar } = await supabaseClient
          .from('theses')
          .select(`
            id, title, author, abstract, keywords, publish_date,
            colleges!inner(name)
          `)
          .neq('id', thesisId)
          .eq('status', 'approved')
          .or(`college_id.eq.${currentThesis.college_id},keywords.ov.{${currentThesis.keywords?.join(',') || ''}}`)
          .limit(limit)

        recommendations = similar || []
      }
    } else if (type === 'trending') {
      // Get trending theses based on recent views
      const { data: trending } = await supabaseClient
        .from('theses')
        .select(`
          id, title, author, abstract, view_count, publish_date,
          colleges!inner(name)
        `)
        .eq('status', 'approved')
        .gte('publish_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order('view_count', { ascending: false })
        .limit(limit)

      recommendations = trending || []
    } else if (type === 'personalized' && userId) {
      // Get personalized recommendations based on user's view history
      const { data: userHistory } = await supabaseClient
        .from('thesis_views')
        .select('thesis_id')
        .eq('user_id', userId)
        .limit(10)

      if (userHistory && userHistory.length > 0) {
        const viewedThesisIds = userHistory.map(v => v.thesis_id)
        
        // Get keywords from viewed theses
        const { data: viewedTheses } = await supabaseClient
          .from('theses')
          .select('keywords, college_id')
          .in('id', viewedThesisIds)

        if (viewedTheses && viewedTheses.length > 0) {
          const allKeywords = viewedTheses.flatMap(t => t.keywords || [])
          const collegeIds = [...new Set(viewedTheses.map(t => t.college_id))]
          
          const { data: personalized } = await supabaseClient
            .from('theses')
            .select(`
              id, title, author, abstract, keywords, publish_date,
              colleges!inner(name)
            `)
            .not('id', 'in', `(${viewedThesisIds.join(',')})`)
            .eq('status', 'approved')
            .or(`college_id.in.(${collegeIds.join(',')}),keywords.ov.{${allKeywords.join(',')}}`)
            .limit(limit)

          recommendations = personalized || []
        }
      }
    }

    // Score and rank recommendations
    const scoredRecommendations = recommendations.map(thesis => ({
      ...thesis,
      score: calculateRelevanceScore(thesis, type),
      reason: getRecommendationReason(thesis, type)
    })).sort((a, b) => b.score - a.score)

    console.log(`Generated ${scoredRecommendations.length} recommendations`)

    return new Response(JSON.stringify({
      success: true,
      recommendations: scoredRecommendations,
      type,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('AI recommendations error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function calculateRelevanceScore(thesis: any, type: string): number {
  let score = 0
  
  // Base score from view count
  score += Math.min(thesis.view_count || 0, 100) / 10
  
  // Recent publications get higher scores
  if (thesis.publish_date) {
    const daysSincePublish = (Date.now() - new Date(thesis.publish_date).getTime()) / (1000 * 60 * 60 * 24)
    score += Math.max(0, 10 - daysSincePublish / 30)
  }
  
  // Keyword density boost
  if (thesis.keywords && thesis.keywords.length > 0) {
    score += thesis.keywords.length * 2
  }
  
  // Abstract length (more detailed = higher score)
  if (thesis.abstract) {
    score += Math.min(thesis.abstract.length / 100, 5)
  }
  
  return Math.round(score * 10) / 10
}

function getRecommendationReason(thesis: any, type: string): string {
  switch (type) {
    case 'similar':
      return 'Similar topic and field of study'
    case 'trending':
      return 'Popular among recent readers'
    case 'personalized':
      return 'Based on your reading history'
    default:
      return 'Recommended for you'
  }
}