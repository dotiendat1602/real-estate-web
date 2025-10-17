export interface PropertyCategoryResponse {
  paging: boolean;
  hasMore: boolean;
  pageIndex: any;
  totalPages: number;
  totalItems: number;
  data: PropertyCategoryData[];
}

export interface PropertyCategoryData {
  category_id: number,
  category_name: string,
  category_description: string,
}

export interface PropertyCategoryRequest {
  category_name: string,
  category_description: string,
}

export interface PropertyCategoryUpdate extends Partial<PropertyCategoryRequest> { }