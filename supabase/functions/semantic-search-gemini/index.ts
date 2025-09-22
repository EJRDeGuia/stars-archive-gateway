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
    const { query, match_threshold = 0.6, match_count = 20, similar_to_thesis } = await req.json(); // Lowered threshold for better recall

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

    // Perform semantic search using RPC function with hybrid approach
    const { data: semanticResults, error } = await supabase.rpc('match_theses_gemini', {
      query_embedding: embedding,
      match_threshold,
      match_count: Math.min(match_count * 2, 40) // Get more results for hybrid ranking
    });

    let results = semanticResults || [];

    // If we have a query (not similar_to_thesis), add keyword boost for hybrid search
    if (query && !similar_to_thesis && results.length > 0) {
      results = results.map((thesis: any) => {
        let hybridScore = thesis.similarity_score || thesis.similarity || 0;
        
        // Boost score based on keyword matches
        const titleMatch = thesis.title?.toLowerCase().includes(query.toLowerCase());
        const abstractMatch = thesis.abstract?.toLowerCase().includes(query.toLowerCase());
        const keywordMatch = thesis.keywords?.some((k: string) => 
          k.toLowerCase().includes(query.toLowerCase())
        );
        
        if (titleMatch) hybridScore += 0.2;
        if (abstractMatch) hybridScore += 0.1;
        if (keywordMatch) hybridScore += 0.15;
        
        return {
          ...thesis,
          similarity_score: Math.min(hybridScore, 1.0),
          similarity: Math.min(hybridScore, 1.0)
        };
      }).sort((a, b) => (b.similarity_score || b.similarity) - (a.similarity_score || a.similarity))
        .slice(0, match_count); // Trim to requested count after hybrid ranking
    }

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
    // Enhanced text preprocessing for better embeddings
    const processedText = preprocessTextForEmbedding(text);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: {
            parts: [{ text: processedText }]
          },
          taskType: 'RETRIEVAL_QUERY',
          outputDimensionality: 1024 // Increased from 768 for better accuracy
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

// Enhanced text preprocessing for better semantic search
function preprocessTextForEmbedding(text: string): string {
  if (!text) return '';
  
  // Remove extra whitespace and normalize
  let processed = text.trim().replace(/\s+/g, ' ');
  
  // Remove common academic boilerplate that doesn't add semantic value
  const boilerplatePatterns = [
    /^(abstract|introduction|conclusion|references|bibliography):?\s*/i,
    /\b(thesis|dissertation|research|study|paper|document)\b/gi,
    /\b(university|college|department|faculty)\b/gi,
    /\b(page \d+|chapter \d+|section \d+)\b/gi,
    /\b\d{4}[-\/]\d{2}[-\/]\d{2}\b/g, // dates
    /\b[A-Z]{2,}\b/g // Remove all-caps abbreviations
  ];
  
  boilerplatePatterns.forEach(pattern => {
    processed = processed.replace(pattern, ' ');
  });
  
  // Normalize and clean
  processed = processed
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ')
    .trim();
  
  // Limit length for better embedding quality (Gemini works better with focused text)
  if (processed.length > 1000) {
    processed = processed.substring(0, 1000);
  }
  
  return processed;
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