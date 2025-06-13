const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ServiceAnalysis {
  isValid: boolean;
  zone: string;
  precision: number;
  ballPosition: {
    x: number;
    y: number;
  };
}

export interface ServiceStats {
  totalServices: number;
  validServices: number;
  faultServices: number;
  averagePrecision: number;
  zoneStats: {
    [key: string]: number;
  };
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async analyzeService(x: number, y: number): Promise<ServiceAnalysis> {
    try {
      const response = await fetch(`${this.baseUrl}/api/service/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x, y }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing service:', error);
      throw error;
    }
  }

  async getStats(): Promise<ServiceStats> {
    try {
      const response = await fetch(`${this.baseUrl}/api/service/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  async resetStats(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/service/stats`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error resetting stats:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 