export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  name: string;
  count: number;
}
