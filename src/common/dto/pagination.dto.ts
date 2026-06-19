export class PaginationOptions {
  page?: number = 1;
  limit?: number = 10;
  sortBy?: string = 'id';
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
