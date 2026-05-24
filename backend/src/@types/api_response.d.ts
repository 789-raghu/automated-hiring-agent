import { PaginationMeta } from "../utils/pagination";

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?:   T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}
