namespace OrderManagement.Api.Domain;

public enum OrderStatus
{
    New,
    InProgress,
    Completed
}

public sealed class Order
{
    public int Id { get; }
    public int CustomerId { get; }
    public string Title { get; private set; }
    public string Description { get; private set; }
    public string Deadline { get; private set; }
    public decimal Price { get; private set; }
    public OrderStatus Status { get; private set; }
    public int? ExecutorId { get; private set; }

    public Order(int? id, int? customerId, string? title, string? description,
        string? deadline, decimal? price)
    {
        Id = Guard.PositiveId(id, "Идентификатор заказа");
        CustomerId = Guard.PositiveId(customerId, "Идентификатор заказчика");
        Title = Guard.RequiredString(title, "Название", 100);
        Description = Guard.RequiredString(description, "Описание", 1000);
        Deadline = Guard.Date(deadline);
        Price = Guard.PositiveNumber(price, "Стоимость");
        Status = OrderStatus.New;
    }

    public void Update(string? title, string? description, string? deadline,
        decimal? price, User customer)
    {
        if (customer.Role != UserRole.Customer || customer.Id != CustomerId || Status != OrderStatus.New)
            throw new DomainException("Изменять можно только свой новый заказ");

        Title = Guard.RequiredString(title, "Название", 100);
        Description = Guard.RequiredString(description, "Описание", 1000);
        Deadline = Guard.Date(deadline);
        Price = Guard.PositiveNumber(price, "Стоимость");
    }

    public void Accept(User executor)
    {
        if (executor.Role != UserRole.Executor || Status != OrderStatus.New)
            throw new DomainException("Заказ нельзя принять");

        ExecutorId = executor.Id;
        Status = OrderStatus.InProgress;
    }

    public void Complete(User executor)
    {
        if (executor.Role != UserRole.Executor || ExecutorId != executor.Id || Status != OrderStatus.InProgress)
            throw new DomainException("Завершить можно только принятый заказ");

        Status = OrderStatus.Completed;
    }
}
