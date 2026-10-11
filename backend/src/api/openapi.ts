export const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Система учёта заказов',
    version: '1.0.0',
    description: 'API для заказчиков и исполнителей'
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/api/health': {
      get: {
        summary: 'Проверить работу API',
        responses: { '200': { description: 'API работает' } }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Войти',
        requestBody: { required: true, content: jsonBody('LoginInput') },
        responses: {
          '200': jsonResponse('Пользователь', 'User'),
          '400': errorResponse('Некорректные данные'),
          '401': errorResponse('Неверный email или пароль')
        }
      }
    },
    '/api/auth/register': {
      post: {
        summary: 'Зарегистрироваться',
        requestBody: { required: true, content: jsonBody('RegisterInput') },
        responses: {
          '201': jsonResponse('Пользователь создан', 'User'),
          '400': errorResponse('Некорректные данные'),
          '409': errorResponse('Email уже используется')
        }
      }
    },
    '/api/orders': {
      get: {
        summary: 'Получить страницу заказов',
        parameters: [
          queryParameter('userId', 'integer', true),
          queryParameter('status', 'string'),
          queryParameter('page', 'integer'),
          queryParameter('pageSize', 'integer')
        ],
        responses: {
          '200': jsonResponse('Страница заказов', 'OrderPage'),
          '400': errorResponse('Некорректные параметры')
        }
      },
      post: {
        summary: 'Создать заказ',
        requestBody: { required: true, content: jsonBody('OrderInput') },
        responses: {
          '201': jsonResponse('Заказ создан', 'Order'),
          '400': errorResponse('Некорректные данные'),
          '403': errorResponse('Недостаточно прав')
        }
      }
    },
    '/api/orders/{id}': {
      get: {
        summary: 'Получить заказ',
        parameters: [idParameter(), queryParameter('userId', 'integer', true)],
        responses: {
          '200': jsonResponse('Заказ', 'Order'),
          '404': errorResponse('Заказ не найден')
        }
      },
      put: {
        summary: 'Изменить заказ',
        parameters: [idParameter()],
        requestBody: { required: true, content: jsonBody('OrderInput') },
        responses: {
          '204': { description: 'Заказ изменён' },
          '400': errorResponse('Заказ нельзя изменить'),
          '404': errorResponse('Заказ не найден')
        }
      },
      patch: {
        summary: 'Изменить статус заказа',
        parameters: [idParameter()],
        requestBody: { required: true, content: jsonBody('StatusInput') },
        responses: {
          '204': { description: 'Статус изменён' },
          '400': errorResponse('Статус нельзя изменить'),
          '404': errorResponse('Заказ не найден')
        }
      },
      delete: {
        summary: 'Удалить заказ',
        parameters: [idParameter(), queryParameter('userId', 'integer', true)],
        responses: {
          '204': { description: 'Заказ удалён' },
          '403': errorResponse('Недостаточно прав'),
          '404': errorResponse('Заказ не найден')
        }
      }
    },
    '/api/profile': {
      get: {
        summary: 'Получить профиль',
        parameters: [queryParameter('userId', 'integer', true)],
        responses: { '200': jsonResponse('Профиль', 'User') }
      },
      put: {
        summary: 'Изменить профиль',
        requestBody: { required: true, content: jsonBody('ProfileInput') },
        responses: {
          '200': jsonResponse('Профиль изменён', 'User'),
          '409': errorResponse('Email уже используется')
        }
      }
    }
  },
  components: {
    schemas: {
      LoginInput: objectSchema(['email', 'password'], {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 }
      }),
      RegisterInput: objectSchema(['name', 'email', 'password'], {
        name: { type: 'string', maxLength: 100 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 }
      }),
      ProfileInput: objectSchema(['userId', 'name', 'email'], {
        userId: { type: 'integer', minimum: 1 },
        name: { type: 'string', maxLength: 100 },
        email: { type: 'string', format: 'email' }
      }),
      OrderInput: objectSchema(['userId', 'title', 'description', 'deadline', 'price'], {
        userId: { type: 'integer', minimum: 1 },
        title: { type: 'string', maxLength: 100 },
        description: { type: 'string', maxLength: 1000 },
        deadline: { type: 'string', format: 'date' },
        price: { type: 'number', minimum: 0, exclusiveMinimum: true }
      }),
      StatusInput: objectSchema(['userId', 'status'], {
        userId: { type: 'integer', minimum: 1 },
        status: { type: 'string', enum: ['in_progress', 'completed'] }
      }),
      User: objectSchema(['id', 'name', 'email', 'role'], {
        id: { type: 'integer' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string', enum: ['customer', 'executor'] }
      }),
      Order: objectSchema(['id', 'title', 'description', 'deadline', 'price', 'status'], {
        id: { type: 'integer' },
        title: { type: 'string' },
        description: { type: 'string' },
        deadline: { type: 'string', format: 'date' },
        price: { type: 'number' },
        status: { type: 'string', enum: ['new', 'in_progress', 'completed'] },
        customerId: { type: 'integer' },
        executorId: { type: 'integer', nullable: true }
      }),
      OrderPage: objectSchema(['items', 'page', 'pageSize', 'total', 'totalPages'], {
        items: { type: 'array', items: schemaReference('Order') },
        page: { type: 'integer' },
        pageSize: { type: 'integer' },
        total: { type: 'integer' },
        totalPages: { type: 'integer' }
      }),
      Error: objectSchema(['message'], { message: { type: 'string' } })
    }
  }
};

function schemaReference(name: string) {
  return { $ref: `#/components/schemas/${name}` };
}

function jsonBody(schema: string) {
  return { 'application/json': { schema: schemaReference(schema) } };
}

function jsonResponse(description: string, schema: string) {
  return { description, content: jsonBody(schema) };
}

function errorResponse(description: string) {
  return jsonResponse(description, 'Error');
}

function idParameter() {
  return { name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } };
}

function queryParameter(name: string, type: string, required = false) {
  return { name, in: 'query', required, schema: { type } };
}

function objectSchema(required: string[], properties: object) {
  return { type: 'object', required, properties };
}
