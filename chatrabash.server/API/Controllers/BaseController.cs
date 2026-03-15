using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private IMediator? _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>() ?? throw new InvalidOperationException("IMediator not found!");

        protected ActionResult<T> HandleResult<T>(Result<T> result)
        {
            if (!result.IsSuccess && result.Code == 404) return NotFound();
            if (result.IsSuccess && result.Value != null) return Ok(result.Value);
            return BadRequest(result.Error);
        }

        protected ActionResult SuccessResponse(string message, object data = null)
        {
            return Ok(new { success = true, message, data });
        }

        protected ActionResult ErrorResponse(string message, int statusCode = StatusCodes.Status400BadRequest)
        {
            return StatusCode(statusCode, new { success = false, message });
        }
    }
}