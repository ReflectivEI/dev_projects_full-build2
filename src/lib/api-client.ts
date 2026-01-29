// API client for communicating with backend API

// Use environment variable for API base URL, fallback to relative path for local dev
const API_BASE = import.meta.env.VITE_API_URL || '/api';

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
 * @param path API endpoint path (e.g., '/api/roleplay/session' or '/roleplay/session')
 * @param body Optional request body (will be JSON stringified)
 * @returns Response object
 */
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown
): Promise<Response> {
  // Remove leading /api if present, since API_BASE already includes it
  const cleanPath = path.startsWith('/api/') ? path.substring(4) : path;
  const url = `${API_BASE}${cleanPath}`;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  return response;
}
