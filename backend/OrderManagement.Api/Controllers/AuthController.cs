using Microsoft.AspNetCore.Mvc;
using OrderManagement.Api.Application;
using OrderManagement.Api.Application.Services;

namespace OrderManagement.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(AuthService service) : ControllerBase
{
    [HttpPost("login")]
    public ActionResult<UserResponse> Login(LoginRequest request)
    {
        return Ok(service.Login(request));
    }

    [HttpPost("register")]
    public ActionResult<UserResponse> Register(RegisterRequest request)
    {
        var user = service.Register(request);
        return Created($"/api/profile?userId={user.Id}", user);
    }
}
