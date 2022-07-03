export interface TaskStatus {
  success: boolean;
  message?: string;
  data?: Record<string, any>;
}
