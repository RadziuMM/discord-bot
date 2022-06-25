export interface Response {
  success: boolean;
  message?: string;
  data?: Record<string, any>;
}