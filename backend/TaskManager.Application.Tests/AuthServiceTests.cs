using FluentAssertions;
using NSubstitute;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Domain.Entities;
namespace TaskManager.Application.Tests;

public class AuthServiceTests
{
    private readonly IUserRepository _userRepositoryMock = Substitute.For<IUserRepository>();
    private readonly IJwtTokenGenerator _jwtTokenGeneratorMock = Substitute.For<IJwtTokenGenerator>();
    private readonly IPasswordService _passwordServiceMock = Substitute.For<IPasswordService>();
    private readonly IAuthService _authService;

    public AuthServiceTests()
    {
       _authService = new AuthService(_userRepositoryMock, _jwtTokenGeneratorMock, _passwordServiceMock);
        _jwtTokenGeneratorMock.Generate(Arg.Any<User>())
            .ReturnsForAnyArgs("token");
    }

    [Fact]
    public void Login_WhenUserIsNull_ShouldThrow()
    {
        // Arrange
        _userRepositoryMock.GetByEmailAsync(Arg.Any<string>())
            .Returns((User?)null);           
        
        // Act
         Func<Task> act =  async () => await _authService.Login("email", "pass");

        // Assert
        act.Should()
            .ThrowAsync<ArgumentException>()
            .WithMessage("Invalid credentials");
    }

    [Fact]
    public void Login_WhenPasswordIsInvalid_ShouldThrow()
    {
        // Arrange
        _userRepositoryMock.GetByEmailAsync(Arg.Any<string>())
            .Returns(new User());
        _passwordServiceMock.VerifyPassword(Arg.Any<string>(),Arg.Any<string>())
            .ReturnsForAnyArgs(false);
        
        // Act
         Func<Task> act =  async () => await _authService.Login("email", "pass");

        // Assert
        act.Should()
            .ThrowAsync<ArgumentException>()
            .WithMessage("Invalid credentials");
    }
}