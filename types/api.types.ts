// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  statusCode: number;
}

// Query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface TourQueryParams extends PaginationParams {
  category?: string;
  onSale?: boolean;
  search?: string;
}

export interface BookingQueryParams extends PaginationParams {
  status?: 'pending' | 'confirmed' | 'cancelled';
  search?: string;
}

export interface ReviewQueryParams extends PaginationParams {
  tourId?: string;
  isApproved?: boolean;
  search?: string;
}
