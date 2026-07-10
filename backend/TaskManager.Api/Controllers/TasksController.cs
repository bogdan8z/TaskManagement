using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

namespace TaskManager.API.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
[Route("tasks")]
public class TasksController(ITaskRepository repo) : ControllerBase
{
    private readonly ITaskRepository _repo = repo;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var tasks = await _repo.GetByUserIdAsync(userId);

        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTaskRequest req)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var random = new Random();
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = req.Title,
            UserId = userId,
            IsCompleted =  random.Next(2) == 1
        };

        await _repo.AddAsync(task);

        return Ok();    
    }
}

public record CreateTaskRequest(string Title);
