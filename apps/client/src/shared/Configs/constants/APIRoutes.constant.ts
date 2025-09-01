const API_ROUTES = {
  HEALTH: {
    CHECK: '/health',
  },
  CONVERSATIONS: {
    QUESTION: '/conversations',
    GET_LIST: '/conversations',
    GET_DETAIL: (id: string) => `/conversations/${id}`,
  },
  KNOWLEDGES: {
    SYNC_NOTION_DOCUMENTS: '/knowledges/notion/documents',
  },
  SYNC_HISTORIES: {
    NOTION: '/sync-histories/notion',
  },
  NAVIGATION: {
    CONVERSATIONS: '/navigation/conversations',
  },
} as const;

export default API_ROUTES;
