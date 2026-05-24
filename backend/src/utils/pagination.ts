export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(page = "1", limit = "10"): ParsedPagination {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  return { page: pageNum, limit: limitNum, skip: (pageNum - 1) * limitNum };
}

export function buildMeta(
  total: number,
  { page, limit }: ParsedPagination,
): PaginationMeta {
  return { total, page, limit, pages: Math.ceil(total / limit) };
}
