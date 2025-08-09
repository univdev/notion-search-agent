export type PatchNotionSyncPayload = {
  ip: string;
};

export type GetNotionSyncHistoriesPayload = {
  offset: number;
  limit: number;
};

export type Sentence = {
  blockId: string;
  value: string;
  type: string;
  language?: string;
};
