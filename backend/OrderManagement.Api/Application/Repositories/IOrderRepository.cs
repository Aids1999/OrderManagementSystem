using OrderManagement.Api.Domain;

namespace OrderManagement.Api.Application.Repositories;

public sealed record OrderQuery(
    int? CustomerId,
    int? ExecutorId,
    bool IncludeFree,
    OrderStatus? Status,
    int Page,
    int PageSize);

public interface IOrderRepository
{
    Order? FindById(int id);
    PageResponse<Order> FindPage(OrderQuery query);
    void Add(Order order);
    void Update(Order order);
    void Delete(int id);
    int NextId();
}
