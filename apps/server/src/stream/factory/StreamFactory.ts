export default function streamFactory(key = 'data', data: any) {
  return `${key}: ${JSON.stringify(data)}\n\n`;
}
