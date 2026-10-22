# Пояснение к третьей лабораторной

## Что сделано

- разработан REST API на C# и ASP.NET Core;
- Angular-сервисы переведены с массивов на реальные HTTP-запросы;
- вместо базы данных используются репозитории-заглушки в памяти;
- бизнес-правила отделены от контроллеров;
- добавлены проверки входных данных и тесты;
- список заказов возвращается постранично;
- Swagger показывает все методы API по адресу `http://localhost:3000/swagger`.

## Структура DDD

```text
backend/
├── OrderManagement.Api/
│   ├── Domain/          сущности User и Order, проверки и бизнес-правила
│   ├── Application/     сценарии, DTO и интерфейсы репозиториев
│   ├── Infrastructure/  заглушки репозиториев вместо базы данных
│   └── Controllers/     контроллеры ASP.NET Core
└── OrderManagement.Tests/  тесты API
```

Зависимости направлены внутрь: API и Infrastructure используют Application,
а Application использует Domain. Domain не знает об ASP.NET Core и базе данных.

## Контроллеры

Контроллеры только получают HTTP-данные, вызывают Application-сервис и формируют
ответ. Проверки и правила находятся в Domain и Application.

## Основные адреса API

| Метод | Адрес | Успешный ответ |
| --- | --- | --- |
| POST | `/api/auth/login` | `200 OK` |
| POST | `/api/auth/register` | `201 Created` |
| GET | `/api/orders` | `200 OK` |
| GET | `/api/orders/{id}` | `200 OK` |
| POST | `/api/orders` | `201 Created` |
| PUT | `/api/orders/{id}` | `204 No Content` |
| DELETE | `/api/orders/{id}` | `204 No Content` |
| PATCH | `/api/orders/{id}` | `204 No Content` |
| GET | `/api/profile` | `200 OK` |
| PUT | `/api/profile` | `200 OK` |

Ошибки возвращают `400`, `401`, `403`, `404` или `409` и JSON с полем
`message`.

`PATCH /api/orders/{id}` принимает статус `in_progress` или `completed`.
Бизнес-правила смены статуса выполняются в Domain, а не в контроллере.

## Постраничная выдача

`GET /api/orders` принимает `page` и `pageSize`. Ответ содержит:

- `items` — текущую пачку заказов;
- `page` — номер страницы;
- `pageSize` — размер страницы;
- `total` — общее число заказов;
- `totalPages` — число страниц.

Максимальный размер страницы — 100 записей.

## Проверка данных

Проверяются идентификаторы, строки, email, дата, стоимость, роль, статус, номер
страницы и размер страницы. Domain дополнительно запрещает:

- изменять или удалять чужой либо уже принятый заказ;
- принимать заказ не исполнителю;
- завершать чужой или ещё не принятый заказ.

## Тесты

Тесты проверяют вход, регистрацию, повторный email, валидацию, создание,
изменение, удаление, принятие, завершение и постраничную выдачу заказов.

```bash
dotnet test backend/OrderManagement.sln
```

## Почему репозитории являются заглушками БД

Application работает только с интерфейсами `IUserRepository` и
`IOrderRepository`. Сейчас их реализуют `InMemoryUserRepository` и
`InMemoryOrderRepository`. Позже можно добавить PostgreSQL-реализацию, не меняя
контроллеры, Domain и Angular-компоненты.
