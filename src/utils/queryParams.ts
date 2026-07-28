import { Request } from 'express';

export const parseQueryParams = (req: Request) => {
  const { from, to, q, page, status, limit, staff_id } = req.query;

  return {
    from: from ? new Date(from as string) : undefined, // Convert `from` to a Date object
    to: to ? new Date(to as string) : undefined,       // Convert `to` to a Date object
    q: q ? String(q) : undefined,                     // Convert `q` to a string
    page: page ? parseInt(page as string, 10) : 1,    // Default page to 1
    status: status ? String(status) : undefined,      // Convert `status` to a string
    staff_id: staff_id ? String(staff_id) : undefined,      // Convert `status` to a string
    limit: limit ? parseInt(limit as string, 10) : 50, // Default limit to 50
    // role: role ? String(role) : undefined
  };
};