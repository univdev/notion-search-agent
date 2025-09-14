export default function isLocalizedError(error: unknown) {
  if (error instanceof Error && 'localeKey' in error) return true;
  return false;
}
