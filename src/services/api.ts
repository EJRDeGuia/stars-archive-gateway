
import { API_ENDPOINTS } from '@/utils/constants';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-api.com' 
      : 'http://localhost:3001';
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request(`${API_ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request(`${API_ENDPOINTS.AUTH}/logout`, {
      method: 'POST',
    });
  }

  // Thesis methods
  async getTheses(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);

    return this.request(`${API_ENDPOINTS.THESES}?${searchParams}`);
  }

  async getThesis(id: string) {
    return this.request(`${API_ENDPOINTS.THESES}/${id}`);
  }

  async createThesis(thesis: FormData) {
    return this.request(API_ENDPOINTS.THESES, {
      method: 'POST',
      body: thesis,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  async updateThesis(id: string, thesis: Partial<any>) {
    return this.request(`${API_ENDPOINTS.THESES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(thesis),
    });
  }

  async deleteThesis(id: string) {
    return this.request(`${API_ENDPOINTS.THESES}/${id}`, {
      method: 'DELETE',
    });
  }

  // Search methods
  async search(query: string, filters?: any) {
    return this.request(`${API_ENDPOINTS.SEARCH}`, {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  // College methods
  async getColleges() {
    return this.request(API_ENDPOINTS.COLLEGES);
  }

  async getCollegeTheses(collegeId: string) {
    return this.request(`${API_ENDPOINTS.COLLEGES}/${collegeId}/theses`);
  }
}

export const apiService = new ApiService();
