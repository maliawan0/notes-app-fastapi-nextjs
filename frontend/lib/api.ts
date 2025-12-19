/**
 * API utility functions for making requests to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiError {
  error: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('quicknote_token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse<T>(response);
}

// Auth API functions
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  getMe: async (): Promise<User> => {
    return apiRequest<User>('/auth/me');
  },
};

// Notes API functions
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteUpdateRequest {
  content: string;
}

export interface Tag {
  name: string;
  count: number;
}

export const notesApi = {
  getNotes: async (search?: string, tag?: string, isArchived: boolean = false): Promise<Note[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (tag) params.append('tag', tag);
    params.append('isArchived', isArchived.toString());
    
    const queryString = params.toString();
    return apiRequest<Note[]>(`/notes${queryString ? `?${queryString}` : ''}`);
  },

  createNote: async (): Promise<Note> => {
    return apiRequest<Note>('/notes', {
      method: 'POST',
    });
  },

  updateNote: async (noteId: string, data: NoteUpdateRequest): Promise<Note> => {
    return apiRequest<Note>(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  archiveNote: async (noteId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/notes/${noteId}/archive`, {
      method: 'PUT',
    });
  },

  restoreNote: async (noteId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/notes/${noteId}/restore`, {
      method: 'PUT',
    });
  },

  deleteNote: async (noteId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  },

  getTags: async (): Promise<Tag[]> => {
    return apiRequest<Tag[]>('/tags');
  },
};

