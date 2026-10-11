import { Router } from 'express';
import { ProfileService } from '../../application/services/profile.service.js';

export function profileController(service: ProfileService): Router {
  const router = Router();

  router.get('/', async (request, response) => {
    response.status(200).json(await service.get(request.query['userId']));
  });

  router.put('/', async (request, response) => {
    response.status(200).json(await service.update(request.body?.userId, request.body));
  });

  return router;
}
