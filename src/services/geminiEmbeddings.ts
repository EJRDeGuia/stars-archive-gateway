interface GeminiEmbeddingResponse {
  embedding: {
    values: number[];
  };
}

interface EmbeddingOptions {
  model?: 'text-embedding-004';
  dimensionality?: 768 | 1024; // Gemini supports these dimensions
  taskType?: 'RETRIEVAL_QUERY' | 'RETRIEVAL_DOCUMENT' | 'SEMANTIC_SIMILARITY';
}

export class GeminiEmbeddingService {
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private embeddingsCache = new Map<string, number[]>();
  private readonly maxCacheSize = 1000;

  constructor() {
    // Try to get API key from environment or localStorage
    this.apiKey = process.env.GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('gemini_api_key', apiKey);
  }

  private getCacheKey(text: string, options: EmbeddingOptions): string {
    return `${JSON.stringify(options)}:${text}`;
  }

  private manageCacheSize(): void {
    if (this.embeddingsCache.size >= this.maxCacheSize) {
      // Remove oldest entries (simple FIFO)
      const keys = Array.from(this.embeddingsCache.keys());
      const toDelete = keys.slice(0, Math.floor(this.maxCacheSize * 0.1));
      toDelete.forEach(key => this.embeddingsCache.delete(key));
    }
  }

  async getEmbedding(text: string, options: EmbeddingOptions = {}): Promise<number[]> {
    const cacheKey = this.getCacheKey(text, options);
    
    // Check cache first
    if (this.embeddingsCache.has(cacheKey)) {
      return this.embeddingsCache.get(cacheKey)!;
    }

    if (!this.apiKey) {
      console.warn('No Gemini API key found, returning mock embedding');
      // Return mock embedding with appropriate dimensions
      const dimensions = options.dimensionality || 768;
      return Array.from({ length: dimensions }, () => Math.random() - 0.5);
    }

    try {
      const model = options.model || 'text-embedding-004';
      const url = `${this.baseUrl}/${model}:embedContent?key=${this.apiKey}`;

      const requestBody: any = {
        content: {
          parts: [{ text }]
        },
        taskType: options.taskType || 'SEMANTIC_SIMILARITY'
      };

      // Add dimensionality if specified
      if (options.dimensionality) {
        requestBody.outputDimensionality = options.dimensionality;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiEmbeddingResponse = await response.json();
      const embedding = data.embedding.values;

      // Cache the result
      this.manageCacheSize();
      this.embeddingsCache.set(cacheKey, embedding);

      return embedding;
    } catch (error) {
      console.error('Error getting Gemini embedding:', error);
      // Return mock embedding as fallback
      const dimensions = options.dimensionality || 768;
      return Array.from({ length: dimensions }, () => Math.random() - 0.5);
    }
  }

  async getQueryEmbedding(query: string, dimensionality?: 768 | 1024): Promise<number[]> {
    return this.getEmbedding(query, {
      taskType: 'RETRIEVAL_QUERY',
      dimensionality
    });
  }

  async getDocumentEmbedding(document: string, dimensionality?: 768 | 1024): Promise<number[]> {
    return this.getEmbedding(document, {
      taskType: 'RETRIEVAL_DOCUMENT',
      dimensionality
    });
  }

  clearCache(): void {
    this.embeddingsCache.clear();
  }

  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.embeddingsCache.size,
      maxSize: this.maxCacheSize
    };
  }
}

export const geminiEmbeddingService = new GeminiEmbeddingService();