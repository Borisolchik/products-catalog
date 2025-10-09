export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  url?: string;
}
