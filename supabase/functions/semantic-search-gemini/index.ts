import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeminiEmbeddingResponse {
  embedding: {
    values: number[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, match_threshold = 0.7, match_count = 20, similar_to_thesis } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.warn('No Gemini API key found, falling back to keyword search');
      return await performKeywordSearch(query, match_count, similar_to_thesis, supabase, corsHeaders);
    }

    let embedding: number[];

    if (similar_to_thesis) {
      // Get embedding from existing thesis
      const { data: thesis, error } = await supabase
        .from('theses')
        .select('embedding, title, abstract')
        .eq('id', similar_to_thesis)
        .single();

      if (error || !thesis?.embedding) {
        return new Response(
          JSON.stringify({ error: 'Thesis not found or no embedding available' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      embedding = thesis.embedding;
    } else {
      // Generate embedding for query using Gemini
      embedding = await getGeminiEmbedding(query, geminiApiKey);
    }

    // Perform semantic search using RPC function
    const { data, error } = await supabase.rpc('match_theses_gemini', {
      query_embedding: embedding,
      match_threshold,
      match_count
    });

    if (error) {
      console.error('RPC error:', error);
      return await performKeywordSearch(query, match_count, similar_to_thesis, supabase, corsHeaders);
    }

    // Format results
    const results = data?.map((thesis: any) => ({
      ...thesis,
      similarity: thesis.similarity_score || thesis.similarity
    })) || [];

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in semantic search:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function getGeminiEmbedding(text: string, apiKey: string): Promise<number[]> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: {
            parts: [{ text }]
          },
          taskType: 'RETRIEVAL_QUERY',
          outputDimensionality: 768
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data: GeminiEmbeddingResponse = await response.json();
    return data.embedding.values;
  } catch (error) {
    console.error('Error getting Gemini embedding:', error);
    throw error;
  }
}

async function performKeywordSearch(
  query: string, 
  limit: number, 
  thesisId: string | null, 
  supabase: any, 
  corsHeaders: any
) {
  try {
    let queryBuilder = supabase
      .from('theses')
      .select(`
        id,
        title,
        author,
        abstract,
        keywords,
        publish_date,
        view_count,
        download_count,
        cover_image_url,
        colleges!inner(name)
      `)
      .eq('status', 'approved');

    if (thesisId) {
      // For similar thesis search, exclude the current thesis
      queryBuilder = queryBuilder.neq('id', thesisId);
    }

    if (query) {
      queryBuilder = queryBuilder.or(`
        title.ilike.%${query}%,
        abstract.ilike.%${query}%,
        keywords.cs.{${query}}
      `);
    }

    const { data, error } = await queryBuilder
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Add similarity scores based on keyword matching
    const results = data?.map((thesis: any) => {
      let similarity = 0.5; // Base similarity for keyword search
      
      if (query) {
        const titleMatch = thesis.title?.toLowerCase().includes(query.toLowerCase());
        const abstractMatch = thesis.abstract?.toLowerCase().includes(query.toLowerCase());
        const keywordMatch = thesis.keywords?.some((k: string) => 
          k.toLowerCase().includes(query.toLowerCase())
        );
        
        if (titleMatch) similarity += 0.3;
        if (abstractMatch) similarity += 0.2;
        if (keywordMatch) similarity += 0.1;
        
        similarity = Math.min(similarity, 1.0);
      }
      
      return {
        ...thesis,
        college_name: thesis.colleges?.name,
        similarity
      };
    }) || [];

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Keyword search error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}