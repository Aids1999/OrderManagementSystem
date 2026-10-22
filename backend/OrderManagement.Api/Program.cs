using System.Text.Json.Serialization;
using OrderManagement.Api.Application.Repositories;
using OrderManagement.Api.Application.Services;
using OrderManagement.Api.Infrastructure;
using OrderManagement.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<InMemoryUserRepository>();
builder.Services.AddSingleton<InMemoryOrderRepository>();
builder.Services.AddSingleton<IUserRepository>(provider =>
    provider.GetRequiredService<InMemoryUserRepository>());
builder.Services.AddSingleton<IOrderRepository>(provider =>
    provider.GetRequiredService<InMemoryOrderRepository>());
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton<ProfileService>();
builder.Services.AddSingleton<OrderService>();

builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

app.UseMiddleware<ErrorHandlerMiddleware>();
app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();
