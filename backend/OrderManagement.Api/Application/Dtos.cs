namespace OrderManagement.Api.Application;

public sealed record LoginRequest(string? Email, string? Password);

public sealed record RegisterRequest(string? Name, string? Email, string? Password);

public sealed record ProfileRequest(int? UserId, string? Name, string? Email);

public sealed record OrderRequest(
    int? UserId,
    string? Title,
    string? Description,
    string? Deadline,
    decimal? Price);

public sealed record StatusRequest(int? UserId, string? Status);

public sealed record UserResponse(int Id, string Name, string Email, string Role);

public sealed record OrderResponse(
    int Id,
    string Title,
    string Description,
    string Deadline,
    decimal Price,
    string Status,
    int CustomerId,
    int? ExecutorId);

public sealed record PageResponse<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int Total,
    int TotalPages);
