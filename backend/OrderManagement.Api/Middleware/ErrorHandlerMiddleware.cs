using OrderManagement.Api.Application;
using OrderManagement.Api.Domain;

namespace OrderManagement.Api.Middleware;

public sealed class ErrorHandlerMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (AppException error)
        {
            await WriteError(context, error.StatusCode, error.Message);
        }
        catch (DomainException error)
        {
            await WriteError(context, 400, error.Message);
        }
        catch (Exception)
        {
            await WriteError(context, 500, "Внутренняя ошибка сервера");
        }
    }

    private static async Task WriteError(HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(new { message });
    }
}
