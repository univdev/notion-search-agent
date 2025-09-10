export type ServerResponse<D, M = undefined, P = undefined> = {
  data: D;
  metadata?: M;
  pagination?: P;
};
