using System.Security.Claims;
using FluentAssertions;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using NSubstitute;
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
    
    // FIX 1: Define the validator field
    private readonly IValidator<CreateWorkoutRequest> _validator;
    private readonly IValidator<UpdateWorkoutRequest> _updateValidator;

    public WorkoutEndpointTests()
    {
        _service = Substitute.For<IWorkoutService>();
        _validator = new CreateWorkoutValidator();
        _updateValidator = new UpdateWorkoutValidator();
        
        // Setup a fake logged-in user
        var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, _userId.ToString()) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        _user = new ClaimsPrincipal(identity);
    }

    [Fact]
    public async Task HandleCreate_ShouldReturnConflict_WhenServiceThrowsDuplicateError()
    {
        // Arrange
        var request = new CreateWorkoutRequest("Leg Day", DateTimeOffset.UtcNow, new());
        
        // Mock the Service throwing the exception
        _service.CreateAsync(request, _userId)
            .Returns(Task.FromException<WorkoutResponse>(new InvalidOperationException("Duplicate")));

        // Act
        // FIX 3: Pass _validator as the 3rd argument
        var result = await WorkoutEndpoints.HandleCreate(request, _service, _validator, _user);

        // Assert
        var conflict = result.Should().BeOfType<Conflict<object>>().Subject;
        conflict.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task HandleCreate_ShouldReturnCreated_WhenServiceSucceeds()
    {
        // Arrange
        var request = new CreateWorkoutRequest("Leg Day", DateTimeOffset.UtcNow, new());
        var expectedResponse = new WorkoutResponse(Guid.NewGuid(), _userId, "Leg Day", DateTimeOffset.UtcNow, []);

        _service.CreateAsync(request, _userId).Returns(expectedResponse);

        // Act
        // FIX 4: Pass _validator here too
        var result = await WorkoutEndpoints.HandleCreate(request, _service, _validator, _user);

        // Assert
        var created = result.Should().BeOfType<Created<WorkoutResponse>>().Subject;
        created.StatusCode.Should().Be(201);
        created.Location.Should().Be($"/workouts/{expectedResponse.Id}");
        created.Value.Should().Be(expectedResponse);
    }

    [Fact]
    public async Task HandleCreate_ShouldReturnBadRequest_WhenDateIsInFuture()
    {
        // Arrange
        // Invalid Request: Date is tomorrow
        var request = new CreateWorkoutRequest("Future Workout", DateTimeOffset.UtcNow.AddDays(1), new());

        // Act
        // FIX 5: Pass _validator
        var result = await WorkoutEndpoints.HandleCreate(request, _service, _validator, _user);

        // Assert
        // Expect a 400 Validation Problem (ValidationProblem details are technically in HttpValidationProblemDetails)
        // But checking for ProblemHttpResult is usually safe for Minimal APIs
        result.GetType().Name.Should().Contain("Problem"); 
        
        // Ensure we NEVER called the service (Security Check)
        await _service.DidNotReceive().CreateAsync(Arg.Any<CreateWorkoutRequest>(), Arg.Any<Guid>());
    }

    [Fact]
    public async Task HandleGetById_ShouldReturnNotFound_WhenServiceReturnsNull()
    {
        // Arrange
        var id = Guid.NewGuid();
        _service.GetByIdAsync(id, _userId).Returns((WorkoutResponse?)null);

        // Act
        // Since we throw KeyNotFoundException in the endpoint for 404s
        var action = async () => await WorkoutEndpoints.HandleGetById(id, _service, _user);

        // Assert
        await action.Should().ThrowAsync<KeyNotFoundException>();
    }

    // UPDATE TESTS

 [Fact]
    public async Task HandleUpdate_ShouldReturnNoContent_WhenServiceSucceeds()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new UpdateWorkoutRequest("New Name", DateTimeOffset.UtcNow, new());

        _service.UpdateAsync(id, request, _userId).Returns(true);

        // Act
        var result = await WorkoutEndpoints.HandleUpdate(id, request, _service, _updateValidator, _user);

        // Assert
        var noContent = result.Should().BeOfType<NoContent>().Subject;
        noContent.StatusCode.Should().Be(204);
    }

    [Fact]
    public async Task HandleUpdate_ShouldReturnBadRequest_WhenNameIsEmpty()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new UpdateWorkoutRequest("", DateTimeOffset.UtcNow, new()); // Invalid Name

        // Act
        var result = await WorkoutEndpoints.HandleUpdate(id, request, _service, _updateValidator, _user);

        // Assert
        result.GetType().Name.Should().Contain("Problem"); // Expect 400 Validation Error
    }

    [Fact]
    public async Task HandleUpdate_ShouldThrowKeyNotFound_WhenServiceReturnsFalse()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new UpdateWorkoutRequest("New Name", DateTimeOffset.UtcNow, new());

        _service.UpdateAsync(id, request, _userId).Returns(false);

        // Act
        var action = async () => await WorkoutEndpoints.HandleUpdate(id, request, _service,  _updateValidator, _user);

        // Assert
        await action.Should().ThrowAsync<KeyNotFoundException>();
    }
}