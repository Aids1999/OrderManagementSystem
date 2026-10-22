using OrderManagement.Api.Application.Repositories;
using OrderManagement.Api.Domain;

namespace OrderManagement.Api.Application.Services;

public sealed class AuthService(IUserRepository users)
{
    public UserResponse Login(LoginRequest? request)
    {
        if (request is null)
            throw new DomainException("Данные входа обязательны");

        var email = Guard.Email(request.Email);
        var password = Guard.Password(request.Password);
        var user = users.FindByEmail(email);

        if (user is null || user.Password != password)
            throw new AppException(401, "Неверный email или пароль");

        return user.ToResponse();
    }

    public UserResponse Register(RegisterRequest? request)
    {
        if (request is null)
            throw new DomainException("Данные регистрации обязательны");

        var name = Guard.RequiredString(request.Name, "Имя", 100);
        var email = Guard.Email(request.Email);
        var password = Guard.Password(request.Password);

        if (users.FindByEmail(email) is not null)
            throw new AppException(409, "Пользователь с таким email уже существует");

        var user = new User(users.NextId(), name, email, password, UserRole.Customer);
        users.Add(user);
        return user.ToResponse();
    }
}
