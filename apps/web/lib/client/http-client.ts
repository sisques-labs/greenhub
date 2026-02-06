/**
 * HTTP Client for making requests to Next.js API Routes
 * Handles JSON serialization and error handling
 */

interface RequestOptions extends RequestInit {
  data?: unknown;
}

class HTTPClient {
  /**
   * Make a GET request
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * Make a POST request
   */
  async post<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      data,
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      data,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Base request method
   */
  private async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { data, headers, ...restOptions } = options;

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const config: RequestInit = {
      ...restOptions,
      headers: requestHeaders,
      credentials: 'include', // Important: include cookies in requests
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    console.log('[HTTP Client] Request:', { url, method: options.method, data });

    const response = await fetch(url, config);

    console.log('[HTTP Client] Response status:', response.status, response.statusText);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return {} as T;
    }

    const result = await response.json();
    console.log('[HTTP Client] Response data:', result);

    // Handle error responses
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Request failed');
    }

    return result as T;
  }
}

/**
 * Singleton instance of the HTTP client
 */
export const httpClient = new HTTPClient();
