using Microsoft.AspNetCore.Mvc;
using OrderManagement.Api.Application;
using OrderManagement.Api.Application.Services;

namespace OrderManagement.Api.Controllers;

[ApiController]
[Route("api/orders")]
public sealed class OrdersController(OrderService service) : ControllerBase
{
    [HttpGet]
    public ActionResult<PageResponse<OrderResponse>> GetPage(
        [FromQuery] int? userId,
        [FromQuery] string? status = "all",
        [FromQuery] int? page = 1,
        [FromQuery] int? pageSize = 20)
    {
        return Ok(service.GetPage(userId, status, page, pageSize));
    }

    [HttpGet("{id:int}")]
    public ActionResult<OrderResponse> GetById(int id, [FromQuery] int? userId)
    {
        return Ok(service.GetById(id, userId));
    }

    [HttpPost]
    public ActionResult<OrderResponse> Create(OrderRequest request)
    {
        var order = service.Create(request);
        return CreatedAtAction(nameof(GetById), new { id = order.Id, userId = request.UserId }, order);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, OrderRequest request)
    {
        service.Update(id, request);
        return NoContent();
    }

    [HttpPatch("{id:int}")]
    public IActionResult ChangeStatus(int id, StatusRequest request)
    {
        service.ChangeStatus(id, request);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id, [FromQuery] int? userId)
    {
        service.Delete(id, userId);
        return NoContent();
    }
}
