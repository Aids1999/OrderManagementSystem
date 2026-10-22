using Microsoft.AspNetCore.Mvc;
using OrderManagement.Api.Application;
using OrderManagement.Api.Application.Services;

namespace OrderManagement.Api.Controllers;

[ApiController]
[Route("api/profile")]
public sealed class ProfileController(ProfileService service) : ControllerBase
{
    [HttpGet]
    public ActionResult<UserResponse> Get([FromQuery] int? userId)
    {
        return Ok(service.Get(userId));
    }

    [HttpPut]
    public ActionResult<UserResponse> Update(ProfileRequest request)
    {
        return Ok(service.Update(request));
    }
}
