import { Injectable } from '@angular/core';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  constructor() { }

  getErrorMessage(prefix: string, field: string, type: string): string {
    const key = `${prefix}_${field}_${type}`.toUpperCase();
    return (ERROR_MESSAGES as any)[key] || key;
  }
}
