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

export type RichTextAnnotation = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
};

export type SearchedNotionDocument = {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  documentUrl: string;
};

export type NotionMetadata = {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: NotionPageEditor;
  last_edited_by: NotionPageEditor;
  cover: string | null;
  icon: string | null;
  archived: boolean;
  in_trash: boolean;
  properties: NotionPageProperties;
  url: string;
  public_url: string | null;
  request_id: string;
};

export type NotionPageEditor = {
  object: string;
  id: string;
};

export type NotionPageProperties = {
  title: {
    id: 'title';
    type: 'title';
    title: {
      type: 'text';
      text: {};
      annotations: RichTextAnnotation;
      plain_text: string;
      href: string | null;
    }[];
  };
};

export type NotionDocumentGeneratorResult = {
  blockId: string;
  pageId: string;
  pageTitle: string;
  content: string;
  documentUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NotionDocumentGeneratorStatus = {
  success: boolean;
  error?: string;
};

export type NotionDocumentGeneratorResponse = {
  result: NotionDocumentGeneratorResult | null;
  status: NotionDocumentGeneratorStatus | null;
  done?: boolean;
};

export type NotionDocumentGenerator = AsyncGenerator<NotionDocumentGeneratorResponse>;

export type StreamSyncNotionDocumentsResponse = {
  completedPageCount: number;
  errorPageCount: number;
  ok: boolean;
};
