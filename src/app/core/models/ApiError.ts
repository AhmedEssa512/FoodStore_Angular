export interface ApiError {
  message: string;
  status?: number;
  validationErrors?: { [key: string]: string[] } | null;
}