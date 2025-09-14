import API_ROUTES from '@/shared/routes/APIRoutes';

export default function syncDocumentsStream() {
  const url = [import.meta.env.VITE_API_URL, API_ROUTES.KNOWLEDGES.SYNC_NOTION_DOCUMENTS].join('');

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}
