using OrderManagement.Api.Domain;

namespace OrderManagement.Api.Application.Repositories;

public interface IUserRepository
{
    User? FindById(int id);
    User? FindByEmail(string email);
    void Add(User user);
    void Update(User user);
    int NextId();
}
