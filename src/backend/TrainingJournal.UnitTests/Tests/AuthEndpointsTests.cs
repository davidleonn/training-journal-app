using FluentAssertions;
using NSubstitute;
using Microsoft.AspNetCore.Http.HttpResults;
using TrainingJournal.API.Endpoints;
using TrainingJournal.API.Services.Interfaces;
using TrainingJournal.API.Core.Interfaces; 
using TrainingJournal.API.Contracts;
using TrainingJournal.API.Models;

namespace TrainingJournal.UnitTests.Tests;

public class AuthEndpointsTests
{
    private readonly IAuthService _authService = Substitute.For<IAuthService>();
    private readonly ITokenService _tokenService = Substitute.For<ITokenService>();

    [Fact]
    public async Task Login_ShouldReturnToken_WhenUserExists()
    {
        // Arrange
        // 1. FIX: Provide dummy password if your LoginRequest expects 2 arguments
        var request = new LoginRequest("test@example.com");
        
        var fakeUser = new User 
        { 
            Id = Guid.NewGuid(), 
            Email = "test@example.com",
        };
        
        // 2. FIX: Create the AuthResult object (Token + Duration)
        // The mock must return this object, not just a string string
        var fakeAuthResult = new AuthResult("eyJ_FAKE_TOKEN_123", 60);

        // Mock the Auth Service
        _authService.VerifyUserExistsAsync(request.Email).Returns(fakeUser);
        
        // 3. FIX: Return the AuthResult object here
        _tokenService.CreateToken(fakeUser.Email, fakeUser.Id.ToString())
                     .Returns(fakeAuthResult);

        // Act
        var result = await AuthEndpoints.LoginHandler(request, _authService, _tokenService);

        // Assert
        var okResult = Assert.IsType<Ok<LoginResponse>>(result);
        
        okResult.Value.Should().NotBeNull();
        okResult.Value!.Token.Should().Be("eyJ_FAKE_TOKEN_123");
        okResult.Value.Expires.Should().Be(60); // Verify duration too
    }

    [Fact]
    public async Task Login_ShouldReturn401_WhenUserDoesNotExist()
    {
        // Arrange
        var request = new LoginRequest("ghost@example.com");

        _authService.VerifyUserExistsAsync(Arg.Any<string>()).Returns((User?)null);

        // Act
        var result = await AuthEndpoints.LoginHandler(request, _authService, _tokenService);

        // Assert
        var problemResult = Assert.IsType<ProblemHttpResult>(result);
        Assert.Equal(401, problemResult.StatusCode);
    }
}