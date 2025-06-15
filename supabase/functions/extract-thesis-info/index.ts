
// Deno/Edge Function for extracting thesis metadata from a PDF in storage.
// Uses "pdf-parse" via esm.sh CDN for PDF text parsing.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.5";
import pdfParse from "https://esm.sh/pdf-parse@1.1.1";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { path } = await req.json();
    if (!path) throw new Error("No file path specified");

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Download the PDF file from storage
    const { data, error } = await supabase.storage
      .from("thesis-pdfs")
      .download(path);

    if (error || !data) throw new Error("Failed to download PDF: " + error?.message);

    // Read as ArrayBuffer and convert to Uint8Array
    const buf = new Uint8Array(await data.arrayBuffer());
    // Parse using pdf-parse
    const result = await pdfParse(buf);

    // Naive extraction: Try to find probable fields (flexible for any format)
    const text = result.text;
    // Naive regexes for academic thesis (these can be improved)
    const title = text.match(/(?:Title:|TITLE|Title)\s*([\s\S]{5,120})/)?.[1]?.split('\n')[0]?.trim()
      || text.split("\n")[0].trim();
    const author = text.match(/(?:Author:|AUTHOR|Authors?)\s*([\s\S]{2,70})/)?.[1]?.split('\n')[0]?.trim() ||
      (text.match(/by\s+([\w ,.'\-]+)/i)?.[1]?.trim());
    const abstract = (() => {
      const idx = text.toLowerCase().indexOf("abstract");
      if (idx !== -1) {
        return text.substring(idx + 8, idx + 1000).split("\n\n")[0]?.trim()?.replace(/\n/g," ");
      }
      return "";
    })();
    // Advisors also captured if available:
    const advisor = (text.match(/(?:Adviser|Advisor|Supervisor):?\s*([^\n]+)/i)?.[1]?.trim()) || "";

    // Just extract some keywords if found
    const keywordsMatch = text.match(/(?:Keywords?|KEYWORDS):?\s*([^\n]+)/);
    const keywords = keywordsMatch ? keywordsMatch[1].split(",").map(x=>x.trim()).filter(Boolean) : [];

    // For debugging
    console.log({ title, author, abstract: abstract?.slice(0,100)+'...', advisor, keywords });

    return new Response(
      JSON.stringify({
        title: title || "",
        author: author || "",
        abstract: abstract || "",
        advisor: advisor || "",
        keywords,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("extract-thesis-info error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
