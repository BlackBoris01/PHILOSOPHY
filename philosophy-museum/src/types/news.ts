export interface NewsItem {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  tableOfContents?: TableOfContentsItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface CreateNewsRequest {
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  tableOfContents?: TableOfContentsItem[];
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {
  id: number;
}



