export interface ApiResponse {
  message: string;
  code: string;
  status: number;
}

export interface ErrorObject {
  code: string;
  property: string;
  message: string;
  rejectedValue: string;
  path: string;
}

export interface FullAPiResponse extends ApiResponse {
  fieldErrors?: ErrorObject[];
  globalErrors?: ErrorObject[];
  parameterErrors?: ErrorObject[];
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
  errorType:
    | "UNKNOWN"
    | "INTERNAL"
    | "NOT_FOUND"
    | "UNAUTHENTICATED"
    | "PERMISSION_DENIED"
    | "BAD_REQUEST"
    | "UNAVAILABLE"
    | "FAILED_PRECONDITION";
  debugInfo: object;
  errorDetails?: Record<string, string>;
}

export enum ApiAuthCodes {
  "UNAUTHORIZED",
  "BAD_CREDENTIALS",
  "ACCESS_DENIED",
}

export function isGraphqlApiResponse(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  object: any,
): object is GraphqlApiResponse {
  return "response" in object;
}
