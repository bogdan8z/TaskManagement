
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskManager.Infrastructure;

namespace TaskManager.API;
public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddDbContext<AppDbContext>(opt =>
            opt.UseSqlServer(builder.Configuration.GetConnectionString("Default"))
        );

        // builder.Services.AddScoped<IUserRepository, UserRepository>();
        // builder.Services.AddScoped<ITaskRepository, TaskRepository>();
        // builder.Services.AddScoped<IAuthService, AuthService>();
        // builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

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

        // AUTO MIGRATION HERE
        AutoAddDbMigration(app);

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

        app.Run();
    }

    private static void AutoAddDbMigration(WebApplication app)
    {
        var retries = 5;
        Exception? lastException = null;
        while (retries > 0)
        {
            try
            {
                using var scope = app.Services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.Migrate();
                Console.WriteLine("Database migration completed successfully.");
                lastException = null;
                break;
            }
            catch(Exception ex)
            {
                retries--;
                lastException = ex;
                Thread.Sleep(2000);
            }
        }

        if(lastException != null)
        {
            Console.WriteLine("Database migration failed after 5 attempts.");
            Console.WriteLine(lastException.Message);
        }
    }
}
