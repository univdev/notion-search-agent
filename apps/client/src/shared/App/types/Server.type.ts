export type ServerResponse<D, M, P> = {
  data: D;
  metadata?: M;
  pagination?: P;
};
