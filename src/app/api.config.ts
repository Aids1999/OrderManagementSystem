import { HttpErrorResponse } from '@angular/common/http';

export const API_URL = 'http://localhost:3000/api';

export function apiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string') {
    return error.error.message;
  }
  return 'Не удалось связаться с сервером';
}
