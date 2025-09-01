const ROUTES = {
  CONVERSATIONS: {
    HOME: '/',
    DETAIL: '/conversations/:conversationId',
  },
  SYNC_HISTORIES: {
    NOTION: '/histories/notion',
  },
} as const;

export default ROUTES;
