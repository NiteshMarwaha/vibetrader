export type ApiClientConfig = {
  baseUrl?: string;
  headers?: Record<string, string>;
};

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? "";
    this.headers = config.headers ?? {};
  }

  withHeaders(headers: Record<string, string>) {
    return new ApiClient({
      baseUrl: this.baseUrl,
      headers: { ...this.headers, ...headers },
    });
  }

  getBaseUrl() {
    return this.baseUrl;
  }
}
