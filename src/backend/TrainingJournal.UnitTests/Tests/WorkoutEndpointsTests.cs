using System.Security.Claims;
using FluentAssertions;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using NSubstitute;
using TrainingJournal.API.Contracts;
using TrainingJournal.API.Endpoints;
using TrainingJournal.API.Services.Interfaces;
using TrainingJournal.API.Validators;

namespace TrainingJournal.Tests;

public class WorkoutEndpointTests
{
    private readonly IWorkoutService _service;
    private readonly ClaimsPrincipal _user;
    private readonly Guid _userId = Guid.NewGuid();
    
    // Validators
    private readonly IValidator<CreateWorkoutRequest> _createValidator;
    private readonly IValidator<UpdateWorkoutRequest> _updateValidator;

    public WorkoutEndpointTests()
    {
        _service = Substitute.For<IWorkoutService>();
        
        // Use real validators to ensure integration is correct
        _createValidator = new CreateWorkoutValidator();
        _updateValidator = new UpdateWorkoutValidator();
        
        var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, _userId.ToString()) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        _user = new ClaimsPrincipal(identity);
    }

    // -------------------------------------------------------------
    // HELPER: Create Valid Data to pass Validation
    // -------------------------------------------------------------
    private List<WorkoutExerciseInputDto> GetValidExercises()
    {
        return new List<WorkoutExerciseInputDto> 
        { 
            new("Squat", 1, new() { new(1, new() { new(100, 5) }) }) 
        };
    }
    
    // Helper to get a safe "Past" date so validation never complains about "Future"
    private DateTimeOffset GetValidDate() => DateTimeOffset.UtcNow.AddMinutes(-1);

    // ==========================================
    // CREATE TESTS
    // ==========================================

    [Fact]
    public async Task HandleCreate_ShouldReturnConflict_WhenServiceThrowsDuplicateError()
    {
        // Arrange
        // We use a valid request so validation passes, allowing us to hit the Service logic
        var request = new CreateWorkoutRequest("Leg Day", GetValidDate(), GetValidExercises());
        
        _service.CreateAsync(request, _userId)
            .Returns(Task.FromException<WorkoutResponse>(new InvalidOperationException("Duplicate")));

        // Act
        var result = await WorkoutEndpoints.HandleCreate(request, _service, _createValidator, _user);

        // Assert
      var conflict = result.Should().BeAssignableTo<IStatusCodeHttpResult>().Subject;
        conflict.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task HandleCreate_ShouldReturnCreated_WhenServiceSucceeds()
    {
        // Arrange
        var request = new CreateWorkoutRequest("Leg Day", GetValidDate(), GetValidExercises());
        var expectedResponse = new WorkoutResponse(Guid.NewGuid(), _userId, "Leg Day", request.Date, []);

        _service.CreateAsync(request, _userId).Returns(expectedResponse);

        // Act
        var result = await WorkoutEndpoints.HandleCreate(request, _service, _createValidator, _user);

        // Assert
        var created = result.Should().BeOfType<Created<WorkoutResponse>>().Subject;
        created.StatusCode.Should().Be(201);
    }

    [Fact]
    public async Task HandleCreate_ShouldReturnBadRequest_WhenDateIsInFuture()
    {
        // Arrange
        // Intentionally Invalid Date to trigger Validation Failure
        var request = new CreateWorkoutRequest("Future Workout", DateTimeOffset.UtcNow.AddDays(1), GetValidExercises());

        // Act
        var result = await WorkoutEndpoints.HandleCreate(request, _service, _createValidator, _user);

        // Assert
        // Should be Bad Request (400) due to validation
        result.GetType().Name.Should().Contain("Problem"); 
        
        await _service.DidNotReceive().CreateAsync(Arg.Any<CreateWorkoutRequest>(), Arg.Any<Guid>());
    }

    // ==========================================
    // GET TESTS
    // ==========================================

    [Fact]
    public async Task HandleGetById_ShouldReturnNotFound_WhenServiceReturnsNull()
    {
        // Arrange
        var id = Guid.NewGuid();
        _service.GetByIdAsync(id, _userId).Returns((WorkoutResponse?)null);

        // Act
        var action = async () => await WorkoutEndpoints.HandleGetById(id, _service, _user);

        // Assert
        await action.Should().ThrowAsync<KeyNotFoundException>();
    }

    // ==========================================
    // UPDATE TESTS
    // ==========================================

    [Fact]
    public async Task HandleUpdate_ShouldReturnNoContent_WhenServiceSucceeds()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new UpdateWorkoutRequest("New Name", GetValidDate(), GetValidExercises());

        _service.UpdateAsync(id, request, _userId).Returns(true);

        // Act
        var result = await WorkoutEndpoints.HandleUpdate(id, request, _service, _updateValidator, _user);

        // Assert
        var noContent = result.Should().BeOfType<NoContent>().Subject;
        noContent.StatusCode.Should().Be(204);
    }

    [Fact]
    public async Task HandleUpdate_ShouldThrowKeyNotFound_WhenServiceReturnsFalse()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new UpdateWorkoutRequest("New Name", GetValidDate(), GetValidExercises());

        _service.UpdateAsync(id, request, _userId).Returns(false);

        // Act
        var action = async () => await WorkoutEndpoints.HandleUpdate(id, request, _service, _updateValidator, _user);

        // Assert
        await action.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task HandleUpdate_ShouldReturnBadRequest_WhenNameIsEmpty()
    {
        // Arrange
        var id = Guid.NewGuid();
        // Intentionally Invalid Name
        var request = new UpdateWorkoutRequest("", GetValidDate(), GetValidExercises());

        // Act
        var result = await WorkoutEndpoints.HandleUpdate(id, request, _service, _updateValidator, _user);

        // Assert
        result.GetType().Name.Should().Contain("Problem"); 
    }
}