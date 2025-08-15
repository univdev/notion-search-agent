const API_ROUTES = {
  CONFIGS: {
    GET_HEALTH: '/health',
  },
  CHAT: {
    NOTIION: {
      GET_SEARCH: '/chat/notion/search',
    },
  },
  NOTION: {
    PATCH_SYNC_HISTORIES: '/notion/sync-histories',
  },
} as const;

export default API_ROUTES;
