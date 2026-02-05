using System.Security.Claims;
using FluentAssertions;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using NSubstitute;
using TrainingJournal.Api.Models;
using TrainingJournal.API.Contracts;
using TrainingJournal.API.Endpoints;
using TrainingJournal.API.Services.Interfaces;
using TrainingJournal.API.Validators;
using Xunit;

namespace TrainingJournal.Tests;

public class WorkoutEndpointTests
{
    private readonly IWorkoutService _service;
    private readonly ClaimsPrincipal _user;
    private readonly Guid _userId = Guid.NewGuid();
    
    private readonly IValidator<CreateWorkoutRequest> _createValidator;
    private readonly IValidator<UpdateWorkoutRequest> _updateValidator;

    public WorkoutEndpointTests()
    {
        _service = Substitute.For<IWorkoutService>();
        
        _createValidator = new CreateWorkoutValidator();
        _updateValidator = new UpdateWorkoutValidator();
        
        var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, _userId.ToString()) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        _user = new ClaimsPrincipal(identity);
    }

    // -------------------------------------------------------------
    // HELPER: Create a Valid Request (so Validation doesn't block us)
    // -------------------------------------------------------------
    private List<WorkoutExerciseInputDto> GetValidExercises()
    {
        return new List<WorkoutExerciseInputDto> 
        { 
            new("Squat", 1, new() { new(1, new() { new(100, 5) }) }) 
        };
    }

    [Fact]
    public async Task HandleCreate_ShouldReturnConflict_WhenServiceThrowsDuplicateError()
    {
        // Arrange
        // FIX: Add GetValidExercises() so validation passes
        var request = new CreateWorkoutRequest("Leg Day", DateTimeOffset.UtcNow, GetValidExercises());
        
        _service.CreateAsync(request, _userId)
            .Returns(Task.FromException<WorkoutResponse>(new InvalidOperationException("Duplicate")));

        // Act
        var result = await WorkoutEndpoints.HandleCreate(request, _service, _createValidator, _user);

        // Assert
        var conflict = result.Should().BeOfType<Conflict<object>>().Subject;
        conflict.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task HandleCreate_ShouldReturnCreated_WhenServiceSucceeds()
    {
        // Arrange
        // FIX: Add GetValidExercises()
        var request = new CreateWorkoutRequest("Leg Day", DateTimeOffset.UtcNow, GetValidExercises());
        var expectedResponse = new WorkoutResponse(Guid.NewGuid(), _userId, "Leg Day", DateTimeOffset.UtcNow, []);

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
        // This fails validation intentionally, so empty exercises are fine here (validation fails anyway)
        var request = new CreateWorkoutRequest("Future Workout", DateTimeOffset.UtcNow.AddDays(1), new());

        // Act
        var result = await WorkoutEndpoints.HandleCreate(request, _service, _createValidator, _user);

        // Assert
        // It returns a Problem result (ValidationProblem)
        result.GetType().Name.Should().Contain("Problem"); 
        
        await _service.DidNotReceive().CreateAsync(Arg.Any<CreateWorkoutRequest>(), Arg.Any<Guid>());
    }

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

    [Fact]
    public async Task HandleUpdate_ShouldReturnNoContent_WhenServiceSucceeds()
    {
        // Arrange
        var id = Guid.NewGuid();
        // FIX: Add GetValidExercises()
        var request = new UpdateWorkoutRequest("New Name", DateTimeOffset.UtcNow, GetValidExercises());

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
        // FIX: Add GetValidExercises()
        // If we don't add exercises, Validation fails first, returning 400 instead of reaching the Exception logic.
        var request = new UpdateWorkoutRequest("New Name", DateTimeOffset.UtcNow, GetValidExercises());

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
        var request = new UpdateWorkoutRequest("", DateTimeOffset.UtcNow, GetValidExercises());

        // Act
        var result = await WorkoutEndpoints.HandleUpdate(id, request, _service, _updateValidator, _user);

        // Assert
        result.GetType().Name.Should().Contain("Problem"); 
    }
}