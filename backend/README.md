# Task Management API

This backend powers the task manager application for the React frontend. It exposes secure REST endpoints for authentication and task operations.

## Tech stack
- ASP.NET Core Web API on .NET 9
- Entity Framework Core with SQL Server
- JWT Bearer authentication
- Swagger/OpenAPI for API exploration
- Clean Architecture with separate API, Application, Domain, and Infrastructure layers

## What the backend does
- Registers and authenticates users
- Issues JWT tokens after successful login
- Stores and retrieves tasks for each authenticated user
- Applies EF Core migrations automatically when the application starts

## Architecture layers
- API: controllers that receive HTTP requests and return responses
- Application: business logic and service interfaces
- Domain: core entities such as User and TaskItem
- Infrastructure: EF Core DbContext, repositories, password hashing, JWT generation, SQL Server access

## How it communicates with the frontend
- The frontend sends JSON HTTP requests to the API.
- Authentication endpoints:
  - POST /api/auth/register
  - POST /api/auth/login
- Protected task endpoints:
  - GET /tasks
  - POST /tasks
- The frontend includes a Bearer token in the Authorization header for protected requests.

## Running locally
### Install dotnet-ef tool
```bash
dotnet tool install dotnet-ef
```

### Start the database, by running this in the API project:
```bash
docker-compose up -d
```

### Run the API:
```bash
dotnet run
```

### If you change entities, add a new migration, by running this in Infrastructure project, before starting the API:
```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
dotnet ef migrations script -o Scripts/db-changes.sql
```
So every time you do a change to the entities you need to add a new migration (also be sure you have added any new tables in AppDbContext.cs file)

### If the SQL Server connection is not working, verify the container IP and update the connection string in the app settings accordingly, by running:
```bash
docker inspect <container_id> | grep IPAddress
```

### Debugging database:
```bash
> docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -C
> select name from sys.databases
> GO
```

## Links
- [Clean Architecture Overview](CLEANARCHITECTURE.md)
- https://sharpskill.dev/en/blog/dotnet/clean-architecture-dotnet-practical-guide
- https://dev.to/ravivis13370227/clean-architecture-in-net-application-step-by-step-2ol0
- https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/applying?tabs=dotnet-core-cli
