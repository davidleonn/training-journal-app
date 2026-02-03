using FluentAssertions;
using NSubstitute;
using TrainingJournal.API.Models;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Services;
using Xunit;

namespace TrainingJournal.UnitTests.UserServiceTests;

public class UserServiceTests
{
    private readonly UserService _sut;       // System Under Test
    private readonly IUserRepository _repo;  // The Fake Database

    public UserServiceTests()
    {
        // 1. Create the Fake Repository
        _repo = Substitute.For<IUserRepository>();

        // 2. Inject the Fake into the Service
        _sut = new UserService(_repo);
    }

    [Fact]
    public async Task RegisterUser_ShouldThrow_WhenEmailIsEmpty()
    {
        // Arrange
        var user = new User { Email = "" };

        // Act & Assert
        await _sut.Invoking(x => x.RegisterUserAsync(user))
            .Should().ThrowAsync<ArgumentException>()
            .WithMessage("Email is required.");
    }

    [Theory]
    [InlineData("invalid-email")]
    [InlineData("test@")]
    public async Task RegisterUser_ShouldThrow_WhenEmailFormatIsInvalid(string badEmail)
    {
        // Arrange
        var user = new User { Email = badEmail };

        // Act & Assert
        await _sut.Invoking(x => x.RegisterUserAsync(user))
            .Should().ThrowAsync<ArgumentException>();
    }

    [Fact]
    public async Task RegisterUser_ShouldThrow_WhenUserAlreadyExists()
    {
        // Arrange
        var email = "duplicate@test.com";
        var user = new User { Email = email };

        // MOCK: Database says "Yes, I found someone"
        _repo.GetByEmailAsync(email).Returns(new User { Email = email });

        // Act & Assert
        await _sut.Invoking(x => x.RegisterUserAsync(user))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("User already exists.");
    }

    [Fact]
    public async Task RegisterUser_ShouldReturnId_WhenUserIsValid()
    {
        // Arrange
        var user = new User { Email = "valid@test.com" };
        var expectedId = Guid.NewGuid();

        // MOCK: Database says "No user found" (null)
        _repo.GetByEmailAsync(user.Email).Returns((User?)null);
        _repo.CreateAsync(user).Returns(expectedId);

        // Act
        var result = await _sut.RegisterUserAsync(user);

        // Assert
        result.Should().Be(expectedId);
    }
}