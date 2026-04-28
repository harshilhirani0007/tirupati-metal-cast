export interface Enquiry {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export interface Product {
  id: number;
  category: string;
  description: string;
  grade: string;
  applications: string[];
  color: string;
  active: number;
  sort_order: number;
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

export interface EnquiryStats {
  total: number;
  new: number;
  read: number;
  replied: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
