
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Infrastructure;
using TaskManager.Infrastructure.Repositories;
using TaskManager.Infrastructure.Service;

namespace TaskManager.API;
public class Program
{
    const string allowSpecificOrigins = "_allowSpecificOrigins";
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(allowSpecificOrigins,
                policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                                         .AllowAnyOrigin()
                                          .AllowAnyMethod()
                                          .AllowAnyHeader();
                });
        });

        // Add services to the container.
        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Version = "v1",
                Title = "Task Management API",
                Description = "An ASP.NET Core Web API for managing tasks"
            });
        });

        ConnectToDb(builder);

        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<ITaskRepository, TaskRepository>();
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        builder.Services.AddScoped<IPasswordService, PasswordService>();

        // JWT AUTH
        builder.Services.AddAuthentication(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                var cfg = builder.Configuration;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = cfg["Jwt:Issuer"],
                    ValidAudience = cfg["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(cfg["Jwt:Key"]!)
                    )
                };
            });

        builder.Services.AddAuthorization();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.UseCors(allowSpecificOrigins);

        app.Run();
    }

    private static void ConnectToDb(WebApplicationBuilder builder)
    {
        var useInMemoryDatabase = builder.Configuration.GetValue<bool?>("UseInMemoryDatabase");
        if(useInMemoryDatabase == true)
        {
            builder.Services.AddDbContext<AppDbContext>(opt =>
                  opt.UseInMemoryDatabase("db-name-1"));    
        }
        else
        {
        // Resolve connection string from configuration or environment fallback
            var connectionString = AppDbContextFactory.GetConnectionString(builder.Configuration);
            builder.Services.AddDbContext<AppDbContext>(opt =>
                opt.UseSqlServer(connectionString));
        }        
    }
}
