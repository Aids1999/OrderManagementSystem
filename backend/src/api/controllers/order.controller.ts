import { Router } from 'express';
import { OrderService } from '../../application/services/order.service.js';

export function orderController(service: OrderService): Router {
  const router = Router();

  router.get('/', async (request, response) => {
    const result = await service.getPage(
      request.query['userId'],
      request.query['status'],
      request.query['page'] ?? 1,
      request.query['pageSize'] ?? 20
    );
    response.status(200).json(result);
  });

  router.get('/:id', async (request, response) => {
    response.status(200).json(await service.getById(request.params['id'], request.query['userId']));
  });

  router.post('/', async (request, response) => {
    const order = await service.create(request.body?.userId, request.body);
    response.status(201).location(`/api/orders/${order.id}`).json(order);
  });

  router.put('/:id', async (request, response) => {
    await service.update(request.params['id'], request.body?.userId, request.body);
    response.sendStatus(204);
  });

  router.delete('/:id', async (request, response) => {
    await service.delete(request.params['id'], request.query['userId']);
    response.sendStatus(204);
  });

  router.put('/:id/accept', async (request, response) => {
    await service.accept(request.params['id'], request.body?.userId);
    response.sendStatus(204);
  });

  router.put('/:id/status', async (request, response) => {
    await service.setStatus(request.params['id'], request.body?.userId, request.body?.status);
    response.sendStatus(204);
  });

  return router;
}
