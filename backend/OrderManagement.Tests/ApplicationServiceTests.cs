using OrderManagement.Api.Application;
using OrderManagement.Api.Application.Services;
using OrderManagement.Api.Domain;
using OrderManagement.Api.Infrastructure;

namespace OrderManagement.Tests;

public sealed class ApplicationServiceTests
{
    [Fact]
    public void Login_WithCorrectData_ReturnsUser()
    {
        var service = CreateAuthService();

        var user = service.Login(new LoginRequest("customer@mail.ru", "123456"));

        Assert.Equal("customer", user.Role);
    }

    [Fact]
    public void Register_WithNewEmail_CreatesCustomer()
    {
        var service = CreateAuthService();

        var user = service.Register(new RegisterRequest("Аида", "aida@mail.ru", "123456"));

        Assert.Equal("Аида", user.Name);
        Assert.Equal("customer", user.Role);
    }

    [Fact]
    public void Register_WithDuplicateEmail_ReturnsConflict()
    {
        var service = CreateAuthService();

        var error = Assert.Throws<AppException>(() => service.Register(
            new RegisterRequest("Аида", "customer@mail.ru", "123456")));

        Assert.Equal(409, error.StatusCode);
    }

    [Fact]
    public void Register_WithInvalidEmail_ReturnsValidationError()
    {
        var service = CreateAuthService();

        Assert.Throws<DomainException>(() => service.Register(
            new RegisterRequest("Аида", "wrong-email", "123456")));
    }

    [Fact]
    public void GetPage_ReturnsOrdersInPages()
    {
        var service = CreateOrderService();

        var page = service.GetPage(1, "all", 1, 5);

        Assert.Single(page.Items);
        Assert.Equal(1, page.Total);
    }

    [Fact]
    public void Create_WithValidData_AddsOrder()
    {
        var service = CreateOrderService();

        var order = service.Create(new OrderRequest(
            1, "Новый заказ", "Описание заказа", "2026-12-20", 1500));

        Assert.Equal("Новый заказ", order.Title);
        Assert.Equal("new", order.Status);
    }

    [Fact]
    public void Create_WithNegativePrice_ReturnsValidationError()
    {
        var service = CreateOrderService();

        Assert.Throws<DomainException>(() => service.Create(new OrderRequest(
            1, "Новый заказ", "Описание заказа", "2026-12-20", -1)));
    }

    [Fact]
    public void ChangeStatus_AllowsExecutorToCompleteOrder()
    {
        var service = CreateOrderService();

        service.ChangeStatus(1, new StatusRequest(2, "in_progress"));
        service.ChangeStatus(1, new StatusRequest(2, "completed"));

        var order = service.GetById(1, 2);
        Assert.Equal("completed", order.Status);
    }

    [Fact]
    public void Delete_RemovesCustomersNewOrder()
    {
        var service = CreateOrderService();

        service.Delete(1, 1);

        Assert.Throws<AppException>(() => service.GetById(1, 1));
    }

    [Fact]
    public void GetPage_WithLargePageSize_ReturnsValidationError()
    {
        var service = CreateOrderService();

        Assert.Throws<DomainException>(() => service.GetPage(1, "all", 1, 101));
    }

    private static AuthService CreateAuthService()
    {
        return new AuthService(new InMemoryUserRepository());
    }

    private static OrderService CreateOrderService()
    {
        return new OrderService(new InMemoryOrderRepository(), new InMemoryUserRepository());
    }
}
