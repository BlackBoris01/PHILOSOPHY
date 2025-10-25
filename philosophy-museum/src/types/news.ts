export interface NewsItem {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsRequest {
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl?: string;
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {
  id: number;
}



