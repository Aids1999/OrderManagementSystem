import { DomainError } from './domain-error.js';

export function requiredString(value: unknown, field: string, maxLength = 200): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new DomainError(`${field} обязательно`);
  }

  const result = value.trim();
  if (result.length > maxLength) {
    throw new DomainError(`${field} не должно быть длиннее ${maxLength} символов`);
  }
  return result;
}

export function email(value: unknown): string {
  const result = requiredString(value, 'Email', 100).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) {
    throw new DomainError('Некорректный email');
  }
  return result;
}

export function password(value: unknown): string {
  const result = requiredString(value, 'Пароль', 100);
  if (result.length < 6) {
    throw new DomainError('Пароль должен содержать не меньше 6 символов');
  }
  return result;
}

export function positiveInteger(value: unknown, field: string): number {
  const result = typeof value === 'string' ? Number(value) : value;
  if (!Number.isInteger(result) || Number(result) <= 0) {
    throw new DomainError(`${field} должно быть положительным целым числом`);
  }
  return Number(result);
}

export function positiveNumber(value: unknown, field: string): number {
  const result = typeof value === 'string' ? Number(value) : value;
  if (typeof result !== 'number' || !Number.isFinite(result) || result <= 0) {
    throw new DomainError(`${field} должно быть положительным числом`);
  }
  return result;
}

export function date(value: unknown): string {
  const result = requiredString(value, 'Срок', 10);
  const parsedDate = new Date(`${result}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(result)
    || Number.isNaN(parsedDate.getTime())
    || parsedDate.toISOString().slice(0, 10) !== result
  ) {
    throw new DomainError('Срок должен быть датой в формате ГГГГ-ММ-ДД');
  }
  return result;
}
