export class HttpExceptionData {
  public errorKey: string;
  public errorData: Record<string, any> | undefined;

  constructor(errorKey: string, errorData?: Record<string, any>) {
    this.errorKey = errorKey;
    this.errorData = errorData ?? undefined;
  }
}
