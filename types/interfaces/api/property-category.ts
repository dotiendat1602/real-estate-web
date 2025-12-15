export interface PropertyCategoryResponse {
  paging: boolean;
  hasMore: boolean;
  pageIndex: any;
  totalPages: number;
  totalItems: number;
  data: PropertyCategoryData[];
}

export interface PropertyCategoryData {
  id: number,
  categoryName: string,
  categoryDescription: string,
  createdAt: Date,
}

export interface PropertyCategoryRequest {
  categoryName: string,
  categoryDescription: string,
}

export interface PropertyCategoryUpdate extends Partial<PropertyCategoryRequest> { }