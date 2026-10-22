namespace OrderManagement.Api.Domain;

public enum UserRole
{
    Customer,
    Executor
}

public sealed class User
{
    public int Id { get; }
    public string Name { get; private set; }
    public string Email { get; private set; }
    public string Password { get; }
    public UserRole Role { get; }

    public User(int? id, string? name, string? email, string? password, UserRole role)
    {
        Id = Guard.PositiveId(id, "Идентификатор пользователя");
        Name = Guard.RequiredString(name, "Имя", 100);
        Email = Guard.Email(email);
        Password = Guard.Password(password);
        Role = role;
    }

    public void UpdateProfile(string? name, string? email)
    {
        Name = Guard.RequiredString(name, "Имя", 100);
        Email = Guard.Email(email);
    }
}
