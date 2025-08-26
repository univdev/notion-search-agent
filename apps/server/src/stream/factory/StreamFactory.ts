export default function streamFactory(data: any) {
  return `data: ${JSON.stringify(data)}\n\n`;
}
