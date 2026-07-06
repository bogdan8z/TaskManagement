# Enterprise Task Management System

A personal project to demonstrate production-ready backend architecture and modern frontend development practices.

## What the project does
- Lets users register and log in securely.
- Allows authenticated users to create and view their own tasks.
- Stores task data in SQL Server through a REST API.

## Frontend
- Built with React 18 and Vite.
- Provides the login/register experience and the task dashboard UI.
- Uses browser-based fetch requests to talk to the backend.
- Sends JWT tokens in the Authorization header for protected requests.
- REST API integration.

## Backend
- Built with ASP.NET Core (.NET 9).
- Unit Tests.
- Exposes REST endpoints for authentication and task management.
- Uses Entity Framework Core with SQL Server for persistence.
- Implements JWT-based authentication and Swagger for API exploration.
- Clean Architecture.
- Repository Pattern.
- Swagger.
- FluentValidation.
- Docker.

## Project structure
```text
backend/
  TaskManager.Api/        # ASP.NET Core API layer
  TaskManager.Application/ # Business logic and interfaces
  TaskManager.Domain/      # Core entities
  TaskManager.Infrastructure/ # EF Core, repositories, JWT, password hashing
frontend/
  src/                     # React components and API integration
  public/                  # Static assets
```

## Run the app
Backend:
```bash
docker-compose up -d
dotnet run
```

Frontend:
```bash
npm install
npm run dev
```
