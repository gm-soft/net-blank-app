export interface PaginatedList<T> {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  linkPrefix: string;
  results: Array<T>;
}
