/**
 * HTTP Client for making requests to Next.js API Routes
 * Handles JSON serialization and error handling
 */

interface RequestOptions extends RequestInit {
  data?: unknown;
}

class HTTPClient {
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

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
   * Base request method with automatic token refresh
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
      credentials: 'include',
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    console.log('[HTTP Client] Request:', { url, method: options.method, data });

    let response = await fetch(url, config);

    console.log('[HTTP Client] Response status:', response.status, response.statusText);

    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401 && !url.includes('/api/auth/')) {
      console.log('[HTTP Client] 401 detected, attempting token refresh...');

      // Wait for ongoing refresh or start new one
      await this.refreshAccessToken();

      // Retry the original request with new token
      console.log('[HTTP Client] Retrying request after refresh...');
      response = await fetch(url, config);
      console.log('[HTTP Client] Retry response status:', response.status);
    }

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
      // If still 401 after refresh, redirect to login
      if (response.status === 401) {
        console.error('[HTTP Client] Still unauthorized after refresh, redirecting to login');
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }

      throw new Error(result.message || result.error || 'Request failed');
    }

    return result as T;
  }

  /**
   * Refresh the access token using refresh token
   */
  private async refreshAccessToken(): Promise<void> {
    // If already refreshing, wait for that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start new refresh
    this.refreshPromise = this.performRefresh();

    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual refresh request
   */
  private async performRefresh(): Promise<void> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      console.log('[HTTP Client] Token refresh successful');
    } catch (error) {
      console.error('[HTTP Client] Token refresh error:', error);
      throw error;
    }
  }
}

/**
 * Singleton instance of the HTTP client
 */
export const httpClient = new HTTPClient();
