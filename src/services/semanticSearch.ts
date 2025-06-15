
interface SearchResult {
  thesis: any;
  similarity: number;
}

interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
}

const SEMANTIC_SEARCH_ENDPOINT = 'https://cylsbcjqemluouxblywl.supabase.co/functions/v1/semantic-search';

export class SemanticSearchService {
  private apiKey: string | null = null;
  private embeddingsCache = new Map<string, number[]>();

  constructor() {
    // Get API key from localStorage for now - in production, use Supabase Edge Functions
    this.apiKey = localStorage.getItem('openai_api_key');
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('openai_api_key', apiKey);
  }

  async getEmbedding(text: string): Promise<number[]> {
    if (this.embeddingsCache.has(text)) {
      return this.embeddingsCache.get(text)!;
    }

    if (!this.apiKey) {
      // Return mock embedding for demo purposes
      return Array.from({ length: 1536 }, () => Math.random() - 0.5);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get embedding');
      }

      const data: EmbeddingResponse = await response.json();
      const embedding = data.data[0].embedding;
      
      this.embeddingsCache.set(text, embedding);
      return embedding;
    } catch (error) {
      console.error('Error getting embedding:', error);
      // Return mock embedding as fallback
      return Array.from({ length: 1536 }, () => Math.random() - 0.5);
    }
  }

  // Not used anymore, replaced with backend
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Updated: Use Supabase Edge Function for semantic search
  async semanticSearch(query: string, limit: number = 10): Promise<any[]> {
    try {
      const resp = await fetch(SEMANTIC_SEARCH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit }),
      });

      if (!resp.ok) throw new Error('Failed to fetch semantic search results.');
      const data = await resp.json();
      // Each item is a row from theses table with a 'similarity' property
      if (data.results && Array.isArray(data.results)) {
        return data.results.map((thesis: any) => ({
          id: thesis.id,
          title: thesis.title,
          author: thesis.author,
          year: thesis.publish_date ? new Date(thesis.publish_date).getFullYear() : 0,
          college: thesis.college_id,
          abstract: thesis.abstract,
          keywords: thesis.keywords || [],
        }));
      }
      return [];
    } catch (err) {
      console.error('Semantic search error:', err);
      return [];
    }
  }
}

export const semanticSearchService = new SemanticSearchService();
