
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
    const { query, limit = 10 } = await req.json();

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
      throw new Error("Embedding API error: " + (await embeddingResp.text()));
    }

    const embeddingJson = await embeddingResp.json();
    const embedding = embeddingJson.data[0].embedding;

    // 2. Semantic search on 'theses' table using cosine distance
    // Super simple, just return top N
    const { data, error } = await supabase.rpc("match_theses", {
      query_embedding: embedding,
      match_count: limit,
    });

    if (error) {
      // Fall back to manual query if the RPC does not exist yet
      // Fallback: fetch all vectors and calculate similarity (not performant for big data!)
      const { data: theses, error: thesesError } = await supabase
        .from("theses")
        .select("*")
        .not("embedding", "is", null);

      if (thesesError) throw thesesError;

      // Calculate similarity in JS
      function cosineSim(a, b) {
        const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dot / (magA * magB);
      }

      const results = theses.map((thesis) => ({
        ...thesis,
        similarity: cosineSim(embedding, thesis.embedding),
      }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If using RPC (preferred, for performance)
    return new Response(JSON.stringify({ results: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Semantic search error:", error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
