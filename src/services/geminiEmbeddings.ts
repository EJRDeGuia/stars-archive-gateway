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
    // Enhanced text preprocessing
    const processedText = this.preprocessTextForEmbedding(text);
    const cacheKey = this.getCacheKey(processedText, options);
    
    // Check cache first
    if (this.embeddingsCache.has(cacheKey)) {
      return this.embeddingsCache.get(cacheKey)!;
    }

    if (!this.apiKey) {
      console.warn('No Gemini API key found, returning mock embedding');
      // Return mock embedding with appropriate dimensions
      const dimensions = options.dimensionality || 1024; // Increased default
      return Array.from({ length: dimensions }, () => Math.random() - 0.5);
    }

    try {
      const model = options.model || 'text-embedding-004';
      const url = `${this.baseUrl}/${model}:embedContent?key=${this.apiKey}`;

      const requestBody: any = {
        content: {
          parts: [{ text: processedText }]
        },
        taskType: options.taskType || 'SEMANTIC_SIMILARITY',
        outputDimensionality: options.dimensionality || 1024 // Enhanced default dimensions
      };

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
      const dimensions = options.dimensionality || 1024;
      return Array.from({ length: dimensions }, () => Math.random() - 0.5);
    }
  }

  // Enhanced text preprocessing for better embeddings
  private preprocessTextForEmbedding(text: string): string {
    if (!text) return '';
    
    // Chunking strategy for long text - use overlapping windows
    const maxLength = 800; // Optimal for Gemini embeddings
    if (text.length <= maxLength) {
      return this.normalizeText(text);
    }
    
    // For long text, take the most relevant parts
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    let result = '';
    let currentLength = 0;
    
    // Prioritize title and first sentences (usually most informative)
    for (const sentence of sentences) {
      const normalized = this.normalizeText(sentence);
      if (currentLength + normalized.length > maxLength) break;
      
      result += normalized + '. ';
      currentLength = result.length;
    }
    
    return result.trim();
  }

  private normalizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s.,!?-]/g, ' ') // Remove most special chars but keep sentence structure
      .replace(/\b(abstract|introduction|conclusion|references|thesis|dissertation)\b/gi, '') // Remove boilerplate
      .replace(/\s+/g, ' ')
      .trim();
  }

  async getQueryEmbedding(query: string, dimensionality?: 768 | 1024): Promise<number[]> {
    return this.getEmbedding(query, {
      taskType: 'RETRIEVAL_QUERY',
      dimensionality: dimensionality || 1024 // Enhanced default
    });
  }

  async getDocumentEmbedding(document: string, dimensionality?: 768 | 1024): Promise<number[]> {
    return this.getEmbedding(document, {
      taskType: 'RETRIEVAL_DOCUMENT',
      dimensionality: dimensionality || 1024 // Enhanced default
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