using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Interfaces;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService auth) : ControllerBase
{
    private readonly IAuthService _auth = auth;

    [HttpPost("register")]
    public async Task<IActionResult> Register(AuthRequest req)
    {
        var token = await _auth.Register(req.Email, req.Password);
        return Ok(token);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(AuthRequest req)
    {
        var token = await _auth.Login(req.Email, req.Password);
        return Ok(token);
    }
}

public record AuthRequest(string Email, string Password);
