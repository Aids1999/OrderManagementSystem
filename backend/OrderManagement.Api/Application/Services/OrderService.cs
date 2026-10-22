using OrderManagement.Api.Application.Repositories;
using OrderManagement.Api.Domain;

namespace OrderManagement.Api.Application.Services;

public sealed class OrderService(IOrderRepository orders, IUserRepository users)
{
    public PageResponse<OrderResponse> GetPage(
        int? userId,
        string? statusValue,
        int? pageValue,
        int? pageSizeValue)
    {
        var user = FindUser(userId);
        var page = Guard.PositiveId(pageValue, "Номер страницы");
        var pageSize = Guard.PositiveId(pageSizeValue, "Размер страницы");
        if (pageSize > 100)
            throw new DomainException("Размер страницы не должен превышать 100");

        var query = user.Role == UserRole.Customer
            ? new OrderQuery(user.Id, null, false, ParseStatus(statusValue), page, pageSize)
            : new OrderQuery(null, user.Id, true, ParseStatus(statusValue), page, pageSize);

        var result = orders.FindPage(query);
        return new PageResponse<OrderResponse>(
            result.Items.Select(order => order.ToResponse()).ToList(),
            result.Page,
            result.PageSize,
            result.Total,
            result.TotalPages);
    }

    public OrderResponse GetById(int? id, int? userId)
    {
        var user = FindUser(userId);
        var order = FindOrder(id);
        var visible = user.Role == UserRole.Customer
            ? order.CustomerId == user.Id
            : order.Status == OrderStatus.New || order.ExecutorId == user.Id;

        if (!visible)
            throw new AppException(403, "Нет доступа к заказу");

        return order.ToResponse();
    }

    public OrderResponse Create(OrderRequest? request)
    {
        if (request is null)
            throw new DomainException("Данные заказа обязательны");

        var user = FindUser(request.UserId);
        if (user.Role != UserRole.Customer)
            throw new AppException(403, "Заказы создаёт только заказчик");

        var order = new Order(orders.NextId(), user.Id, request.Title, request.Description,
            request.Deadline, request.Price);
        orders.Add(order);
        return order.ToResponse();
    }

    public void Update(int? id, OrderRequest? request)
    {
        if (request is null)
            throw new DomainException("Данные заказа обязательны");

        var user = FindUser(request.UserId);
        var order = FindOrder(id);
        if (user.Id != order.CustomerId || order.Status != OrderStatus.New)
            throw new AppException(403, "Изменять можно только свой новый заказ");

        order.Update(request.Title, request.Description, request.Deadline, request.Price, user);
        orders.Update(order);
    }

    public void Delete(int? id, int? userId)
    {
        var user = FindUser(userId);
        var order = FindOrder(id);
        if (user.Id != order.CustomerId || order.Status != OrderStatus.New)
            throw new AppException(403, "Удалять можно только свой новый заказ");

        orders.Delete(order.Id);
    }

    public void ChangeStatus(int? id, StatusRequest? request)
    {
        if (request is null)
            throw new DomainException("Новый статус обязателен");

        var user = FindUser(request.UserId);
        var order = FindOrder(id);

        if (request.Status == "in_progress")
            order.Accept(user);
        else if (request.Status == "completed")
            order.Complete(user);
        else
            throw new DomainException("Допустимый статус: in_progress или completed");

        orders.Update(order);
    }

    private User FindUser(int? id)
    {
        var userId = Guard.PositiveId(id, "Идентификатор пользователя");
        return users.FindById(userId) ?? throw new AppException(404, "Пользователь не найден");
    }

    private Order FindOrder(int? id)
    {
        var orderId = Guard.PositiveId(id, "Идентификатор заказа");
        return orders.FindById(orderId) ?? throw new AppException(404, "Заказ не найден");
    }

    private static OrderStatus? ParseStatus(string? value)
    {
        return value switch
        {
            null or "all" => null,
            "new" => OrderStatus.New,
            "in_progress" => OrderStatus.InProgress,
            "completed" => OrderStatus.Completed,
            _ => throw new DomainException("Некорректный статус")
        };
    }
}
