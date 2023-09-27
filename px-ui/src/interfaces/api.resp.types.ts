export interface ApiResponse {
  message: string;
  code: number;
}

export interface FullAPiResponse extends ApiResponse {
  errors: string[];
  path: string;
  status: number;
  timestamp: Date;
}

export interface GraphqlApiResponse {
  response: Response;
  request: Request;
}

interface Request {
  query: string;
  variables: Variables;
}

interface Variables {
  organizationId: string;
}

interface Response {
  errors: Error[];
  data: unknown;
  status: number;
  headers: Headers;
}

interface Headers {
  map: Map;
}

interface Map {
  "cache-control": string;
  "content-length": string;
  "content-type": string;
  expires: string;
  pragma: string;
}

interface Error {
  message: string;
  path: null[];
  extensions: Extensions;
}

interface Extensions {
  classification: string;
}

export function isGraphqlApiResponse(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  object: any
): object is GraphqlApiResponse {
  return "response" in object;
}
