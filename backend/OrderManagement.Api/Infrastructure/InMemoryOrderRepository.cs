using OrderManagement.Api.Application;
using OrderManagement.Api.Application.Repositories;
using OrderManagement.Api.Domain;

namespace OrderManagement.Api.Infrastructure;

public sealed class InMemoryOrderRepository : IOrderRepository
{
    private readonly List<Order> _orders =
    [
        new Order(1, 1, "Создать логотип", "Нужен простой логотип для сайта",
            "2026-10-20", 5000)
    ];

    public Order? FindById(int id)
    {
        var validId = Guard.PositiveId(id, "Идентификатор заказа");
        return _orders.Find(order => order.Id == validId);
    }

    public PageResponse<Order> FindPage(OrderQuery query)
    {
        ArgumentNullException.ThrowIfNull(query);
        var page = Guard.PositiveId(query.Page, "Номер страницы");
        var pageSize = Guard.PositiveId(query.PageSize, "Размер страницы");
        IEnumerable<Order> items = _orders;

        if (query.CustomerId is not null)
            items = items.Where(order => order.CustomerId == query.CustomerId);

        if (query.ExecutorId is not null)
            items = items.Where(order => order.ExecutorId == query.ExecutorId
                || query.IncludeFree && order.Status == OrderStatus.New);

        if (query.Status is not null)
            items = items.Where(order => order.Status == query.Status);

        var result = items.ToList();
        var total = result.Count;
        var pageItems = result.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return new PageResponse<Order>(
            pageItems,
            page,
            pageSize,
            total,
            (int)Math.Ceiling((double)total / pageSize));
    }

    public void Add(Order order)
    {
        ArgumentNullException.ThrowIfNull(order);
        if (_orders.Any(item => item.Id == order.Id))
            throw new DomainException("Заказ уже существует");
        _orders.Add(order);
    }

    public void Update(Order order)
    {
        ArgumentNullException.ThrowIfNull(order);
        if (_orders.All(item => item.Id != order.Id))
            throw new DomainException("Заказ не найден");
    }

    public void Delete(int id)
    {
        var orderId = Guard.PositiveId(id, "Идентификатор заказа");
        _orders.RemoveAll(order => order.Id == orderId);
    }

    public int NextId() => _orders.Count == 0 ? 1 : _orders.Max(order => order.Id) + 1;
}
