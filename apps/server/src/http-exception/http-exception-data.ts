export class LocalizedError extends Error {
  public localeKey: string;
  public interpolateData: Record<string, any> | undefined;

  constructor(message: string, errorKey: string, interpolateData?: Record<string, any>) {
    super(message);
    this.localeKey = errorKey;
    this.interpolateData = interpolateData ?? undefined;
  }
}
