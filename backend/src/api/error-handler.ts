import { ErrorRequestHandler } from 'express';
import { AppError } from '../application/errors.js';
import { DomainError } from '../domain/domain-error.js';

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }
  if (error instanceof DomainError) {
    response.status(400).json({ message: error.message });
    return;
  }

  console.error(error);
  response.status(500).json({ message: 'Внутренняя ошибка сервера' });
};
