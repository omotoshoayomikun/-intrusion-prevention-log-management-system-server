import { Request } from 'express';

export const parseQueryParams = (req: Request) => {
  const { from, to, search, page, status, limit, id, sortBy, sortOrder } = req.query;
  // Safe parsing for page and limit to prevent NaN or negative numbers
  const parsedPage = Math.max(1, parseInt(page as string, 10) || 1);
  const parsedLimit = Math.max(1, parseInt(limit as string, 10) || 50);

  return {
    from: from ? new Date(from as string) : undefined,
    to: to ? new Date(to as string) : undefined,
    search: search ? String(search).trim() : undefined,
    page: parsedPage,
    status: status ? String(status) : undefined,
    id: id ? String(id) : undefined,
    limit: parsedLimit,
    sortBy: sortBy ? String(sortBy) : "createdAt",
    sortOrder: (sortOrder === "asc" ? 1 : -1) as 1 | -1,
  };
};