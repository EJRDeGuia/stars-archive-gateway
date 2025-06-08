
import { theses } from '@/data/mockData';

interface SearchResult {
  thesis: any;
  similarity: number;
}

interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
}

// Placeholder for semantic search - in a real implementation, you'd store embeddings in a vector database
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

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async semanticSearch(query: string, limit: number = 10): Promise<SearchResult[]> {
    const queryEmbedding = await this.getEmbedding(query);
    
    const results: SearchResult[] = [];
    
    for (const thesis of theses) {
      // Create a searchable text combining title, abstract, and keywords
      const searchableText = `${thesis.title} ${thesis.abstract} ${thesis.keywords.join(' ')}`;
      const thesisEmbedding = await this.getEmbedding(searchableText);
      
      const similarity = this.cosineSimilarity(queryEmbedding, thesisEmbedding);
      results.push({ thesis, similarity });
    }
    
    // Sort by similarity and return top results
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  // Traditional keyword search as fallback
  keywordSearch(query: string): any[] {
    const lowercaseQuery = query.toLowerCase();
    return theses.filter(thesis =>
      thesis.title.toLowerCase().includes(lowercaseQuery) ||
      thesis.author.toLowerCase().includes(lowercaseQuery) ||
      thesis.abstract.toLowerCase().includes(lowercaseQuery) ||
      thesis.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
    );
  }
}

export const semanticSearchService = new SemanticSearchService();
