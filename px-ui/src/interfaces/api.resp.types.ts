export interface ApiResponse {
  message: string;
  code: number;
}

export interface FullAPiResponse extends ApiResponse {
  error: string;
  path: string;
  status: number;
  timestamp: Date;
}
