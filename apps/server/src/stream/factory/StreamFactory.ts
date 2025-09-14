export default function streamFactory<T = any>(key = 'data', data: T) {
  return `${key}: ${JSON.stringify(data)}\n\n`;
}
