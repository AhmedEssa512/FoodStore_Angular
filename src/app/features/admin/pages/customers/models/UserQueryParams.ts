export interface UserQueryParams {
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  descending?: boolean;
  pageNumber: number;
  pageSize: number;
}