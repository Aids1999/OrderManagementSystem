import { Router } from 'express';
import { AuthService } from '../../application/services/auth.service.js';

export function authController(service: AuthService): Router {
  const router = Router();

  router.post('/login', async (request, response) => {
    response.status(200).json(await service.login(request.body));
  });

  router.post('/register', async (request, response) => {
    const user = await service.register(request.body);
    response.status(201).location(`/api/profile?userId=${user.id}`).json(user);
  });

  return router;
}
