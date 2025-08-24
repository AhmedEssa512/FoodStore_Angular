export interface OrderQuery {
  pageNumber: number;
  pageSize: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}