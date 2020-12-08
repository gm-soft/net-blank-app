export interface PageParams {
  page: number;
  pageSize: number;
}

export const defaultPageParams: PageParams = {
  pageSize: 10,
  page: 1
};
