using FluentAssertions;
using NSubstitute;
using TrainingJournal.API.Models;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Services;
using Xunit;

namespace TrainingJournal.UnitTests.Services;

public class AuthServiceTests
{
    // 1. The Mock: A fake repository we can control
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    
    // 2. The Subject: The actual service we are testing
    private readonly AuthService _sut; // SUT = System Under Test

    public AuthServiceTests()
    {
        // Inject the mock into the service
        _sut = new AuthService(_userRepository);
    }

    [Fact]
    public async Task VerifyUserExistsAsync_ShouldReturnUser_WhenEmailExists()
    {
        // Arrange
        var email = "test@example.com";
        var expectedUser = new User { Id = Guid.NewGuid(), Email = email };

        // Tell the mock: "When someone asks for this email, return this user"
        _userRepository.GetByEmailAsync(email).Returns(expectedUser);

        // Act
        var result = await _sut.VerifyUserExistsAsync(email);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(expectedUser);
        
        // Verify the repository was actually called exactly once
        await _userRepository.Received(1).GetByEmailAsync(email);
    }

    [Fact]
    public async Task VerifyUserExistsAsync_ShouldReturnNull_WhenEmailDoesNotExist()
    {
        // Arrange
        var email = "ghost@example.com";

        // Tell the mock: "Return null for this email"
        _userRepository.GetByEmailAsync(email).Returns((User?)null);

        // Act
        var result = await _sut.VerifyUserExistsAsync(email);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
public async Task VerifyUserExistsAsync_ShouldThrowArgumentException_WhenEmailIsEmpty()
{
    // Arrange
    var email = ""; 

    // Act
    // We use a specific FluentAssertions method to check for exceptions
    var action = async () => await _sut.VerifyUserExistsAsync(email);

    // Assert
    await action.Should().ThrowAsync<ArgumentException>()
        .WithMessage("Email cannot be empty.");
}
}