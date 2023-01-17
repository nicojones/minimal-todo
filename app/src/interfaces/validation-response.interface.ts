export interface ValidationResponse {
  errors: Record<string, string[]>;
  message: string;
}