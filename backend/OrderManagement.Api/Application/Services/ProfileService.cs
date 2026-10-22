using OrderManagement.Api.Application.Repositories;
using OrderManagement.Api.Domain;

namespace OrderManagement.Api.Application.Services;

public sealed class ProfileService(IUserRepository users)
{
    public UserResponse Get(int? userId)
    {
        return FindUser(userId).ToResponse();
    }

    public UserResponse Update(ProfileRequest? request)
    {
        if (request is null)
            throw new DomainException("Данные профиля обязательны");

        var user = FindUser(request.UserId);
        var email = Guard.Email(request.Email);
        var otherUser = users.FindByEmail(email);

        if (otherUser is not null && otherUser.Id != user.Id)
            throw new AppException(409, "Пользователь с таким email уже существует");

        user.UpdateProfile(request.Name, email);
        users.Update(user);
        return user.ToResponse();
    }

    private User FindUser(int? id)
    {
        var userId = Guard.PositiveId(id, "Идентификатор пользователя");
        return users.FindById(userId) ?? throw new AppException(404, "Пользователь не найден");
    }
}
