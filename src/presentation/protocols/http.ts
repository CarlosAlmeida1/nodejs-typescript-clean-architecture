export interface HttpResponse {
  statusCode: number;
  body: any;
}

export interface HttpRequest {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
}
