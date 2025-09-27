
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// OpenAI API Key should be stored in Supabase project secrets as OPENAI_API_KEY
const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit = 10, thesisId } = await req.json();
    
    console.log('Semantic search request:', { query, limit, thesisId });

    // If no OpenAI API key, use keyword-based search as fallback
    if (!openAIApiKey) {
      console.log('No OpenAI API key - using keyword-based search fallback');
      return await performKeywordSearch(query, limit, thesisId, supabase, corsHeaders);
    }

    // 1. Get embedding for the query
    const embeddingResp = await fetch("https://api.openai.com/v1/embeddings", {
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
      }),
    });

    if (!embeddingResp.ok) {
      console.log('OpenAI API failed - falling back to keyword search');
      return await performKeywordSearch(query, limit, thesisId, supabase, corsHeaders);
    }

    const embeddingJson = await embeddingResp.json();
    const embedding = embeddingJson.data[0].embedding;

    // 2. Semantic search on 'theses' table using cosine distance
    const { data, error } = await supabase.rpc("match_theses", {
      query_embedding: embedding,
      match_count: limit,
    });

    if (error) {
      console.log('RPC match_theses failed - using keyword search fallback');
      return await performKeywordSearch(query, limit, thesisId, supabase, corsHeaders);
    }

    // If using RPC (preferred, for performance)
    return new Response(JSON.stringify({ results: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Semantic search error:", error);
    // Final fallback to keyword search
    try {
      const { query, limit = 10, thesisId } = await req.json();
      return await performKeywordSearch(query, limit, thesisId, supabase, corsHeaders);
    } catch (fallbackError) {
      console.error("Fallback search also failed:", fallbackError);
      const errorMessage = error instanceof Error ? error.message : String(error)
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }
});

// Keyword-based search fallback function
async function performKeywordSearch(query: string, limit: number, thesisId: string | null, supabase: any, corsHeaders: any) {
  console.log('Performing keyword-based search for:', query);
  
  try {
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    
    let searchQuery = supabase
      .from('theses')
      .select(`
        id, title, author, abstract, keywords, publish_date, view_count,
        colleges!inner(name)
      `)
      .eq('status', 'approved');
    
    // If searching for similar theses, exclude the current thesis
    if (thesisId) {
      searchQuery = searchQuery.neq('id', thesisId);
    }
    
    // Build search conditions for title, abstract, and keywords
    const searchConditions = queryWords.map(word => 
      `title.ilike.%${word}%,abstract.ilike.%${word}%,keywords.cs.{${word}}`
    ).join(',');
    
    if (searchConditions) {
      searchQuery = searchQuery.or(searchConditions);
    }
    
    const { data: theses, error } = await searchQuery.limit(limit * 2); // Get more for scoring
    
    if (error) throw error;
    
    // Score results based on keyword relevance
    const scoredResults = (theses || []).map((thesis: any) => {
      let score = 0;
      const titleLower = thesis.title.toLowerCase();
      const abstractLower = (thesis.abstract || '').toLowerCase();
      const keywordsLower = (thesis.keywords || []).map((k: string) => k.toLowerCase());
      
      // Score based on query word matches
      queryWords.forEach(word => {
        if (titleLower.includes(word)) score += 10; // Title matches are most important
        if (abstractLower.includes(word)) score += 5;
        if (keywordsLower.some((k: string) => k.includes(word))) score += 8;
      });
      
      // Boost for view count and recent publications
      score += Math.min((thesis.view_count || 0) / 10, 5);
      if (thesis.publish_date) {
        const daysSincePublish = (Date.now() - new Date(thesis.publish_date).getTime()) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 3 - daysSincePublish / 365);
      }
      
      return {
        ...thesis,
        similarity_score: Math.round(score * 100) / 100
      };
    })
    .filter((thesis: any) => thesis.similarity_score > 0)
    .sort((a: any, b: any) => b.similarity_score - a.similarity_score)
    .slice(0, limit);
    
    console.log(`Keyword search found ${scoredResults.length} results`);
    
    return new Response(JSON.stringify({ 
      results: scoredResults,
      search_type: 'keyword_based',
      query_words: queryWords
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error: unknown) {
    console.error('Keyword search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(JSON.stringify({ error: 'Search failed', details: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}
