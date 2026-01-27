// API client for communicating with vite-plugin-api endpoints

const API_BASE = '/api';

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json();
}

/**
 * Generic API request helper
 * @param method HTTP method (GET, POST, PUT, DELETE)
 * @param path API endpoint path (e.g., '/api/roleplay/session')
 * @param body Optional request body (will be JSON stringified)
 * @returns Response object
 */
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(path, options);
  return response;
}
