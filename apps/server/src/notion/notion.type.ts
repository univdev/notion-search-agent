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
