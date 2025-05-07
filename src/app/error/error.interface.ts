

export interface ValidationErrorResponse {
  message: string;
  success: boolean;
  stack?: string;
}

export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  error: TErrorSources;
};