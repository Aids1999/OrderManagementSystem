using OrderManagement.Api.Application.Repositories;
using OrderManagement.Api.Domain;

namespace OrderManagement.Api.Infrastructure;

public sealed class InMemoryUserRepository : IUserRepository
{
    private readonly List<User> _users =
    [
        new User(1, "Анна Заказчик", "customer@mail.ru", "123456", UserRole.Customer),
        new User(2, "Иван Исполнитель", "executor@mail.ru", "123456", UserRole.Executor)
    ];

    public User? FindById(int id)
    {
        var validId = Guard.PositiveId(id, "Идентификатор пользователя");
        return _users.Find(user => user.Id == validId);
    }

    public User? FindByEmail(string email)
    {
        var validEmail = Guard.Email(email);
        return _users.Find(user => user.Email == validEmail);
    }

    public void Add(User user)
    {
        ArgumentNullException.ThrowIfNull(user);
        if (_users.Any(item => item.Id == user.Id))
            throw new DomainException("Пользователь уже существует");
        _users.Add(user);
    }

    public void Update(User user)
    {
        ArgumentNullException.ThrowIfNull(user);
        if (_users.All(item => item.Id != user.Id))
            throw new DomainException("Пользователь не найден");
    }

    public int NextId() => _users.Max(user => user.Id) + 1;
}
