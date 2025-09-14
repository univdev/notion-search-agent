export const getURLWithQuery = (url: string, query: Record<string, string>) => {
  const queryString = new URLSearchParams(query).toString();
  return `${url}?${queryString}`;
};
