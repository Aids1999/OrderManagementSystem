using OrderManagement.Api.Domain;

namespace OrderManagement.Api.Application;

public static class Mappings
{
    public static UserResponse ToResponse(this User user) => new(
        user.Id,
        user.Name,
        user.Email,
        user.Role == UserRole.Customer ? "customer" : "executor");

    public static OrderResponse ToResponse(this Order order) => new(
        order.Id,
        order.Title,
        order.Description,
        order.Deadline,
        order.Price,
        order.Status switch
        {
            OrderStatus.New => "new",
            OrderStatus.InProgress => "in_progress",
            _ => "completed"
        },
        order.CustomerId,
        order.ExecutorId);
}
