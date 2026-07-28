
export const pagination = (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
}