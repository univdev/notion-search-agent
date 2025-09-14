export default function exportStreamMessageObject(
  data: string,
): { type: string; data: Record<string, any> | string }[] {
  const messages: { type: string; data: Record<string, any> | string }[] = data
    .split('\n')
    .filter(Boolean)
    .map((message) =>
      message
        .split(new RegExp(/^([\w]{1,}:) (.+)/))
        .map((m) => m.trim())
        .filter(Boolean),
    )
    .map(([event, data]) => {
      const type = event.split(':')[0];

      try {
        const parsedData = JSON.parse(data);
        return {
          type,
          data: parsedData,
        };
      } catch {
        return {
          type,
          data,
        };
      }
    });

  return messages;
}
