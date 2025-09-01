export type ExportedNotionDocument = {
  pageId: string;
  title: string;
  content: string;
  documentUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AddNotionDocumentPayload = {
  title: string;
  content: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  historyId: string;
};
