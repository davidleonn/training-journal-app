using FluentAssertions;
using NSubstitute;
using TrainingJournal.Api.Models;
using TrainingJournal.API.Contracts;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Services;

namespace TrainingJournal.Tests;

public class WorkoutServiceTests
{
    private readonly IWorkoutRepository _repo;
    private readonly WorkoutService _sut; // SUT = System Under Test
    private readonly Guid _userId = Guid.NewGuid();

    public WorkoutServiceTests()
    {
        _repo = Substitute.For<IWorkoutRepository>();
        _sut = new WorkoutService(_repo);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenWorkoutExists()
    {
        // Arrange
        var request = new CreateWorkoutRequest("Leg Day", DateTimeOffset.UtcNow, new());
        
        // Mock that it exists
        _repo.ExistsAsync(_userId, request.Name, request.Date).Returns(true);

        // Act
        var action = async () => await _sut.CreateAsync(request, _userId);

        // Assert
        await action.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage($"A workout named '{request.Name}' already exists for this date.");
            
        // Ensure we never touched the database write method
        await _repo.DidNotReceive().CreateFullWorkoutAsync(Arg.Any<Workout>());
    }

    [Fact]
    public async Task CreateAsync_ShouldMapAndSave_WhenValid()
    {
        // Arrange
        var request = new CreateWorkoutRequest("Leg Day", DateTimeOffset.UtcNow, new());
        _repo.ExistsAsync(_userId, request.Name, request.Date).Returns(false);
        _repo.CreateFullWorkoutAsync(Arg.Any<Workout>()).Returns(true);

        // Act
        var result = await _sut.CreateAsync(request, _userId);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(request.Name);
        result.UserId.Should().Be(_userId);
        
        // Verify repository call
        await _repo.Received(1).CreateFullWorkoutAsync(Arg.Is<Workout>(w => 
            w.Name == request.Name && 
            w.UserId == _userId
        ));
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenRepoReturnsNull()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repo.GetOwnedByIdAsync(id, _userId).Returns((Workout?)null);

        // Act
        var result = await _sut.GetByIdAsync(id, _userId);

        // Assert
        result.Should().BeNull();
    }
    [Fact]
    public async Task UpdateAsync_ShouldReturnTrue_WhenRepoSucceeds()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new UpdateWorkoutRequest("New Name", DateTimeOffset.UtcNow, new());
        
        _repo.UpdateFullWorkoutAsync(Arg.Any<Workout>()).Returns(true);

        // Act
        var result = await _sut.UpdateAsync(id, request, _userId);

        // Assert
        result.Should().BeTrue();
        await _repo.Received(1).UpdateFullWorkoutAsync(Arg.Is<Workout>(w => 
            w.Id == id && w.Name == "New Name"));
    }

    [Fact]
    public async Task UpdateAsync_ShouldReturnFalse_WhenWorkoutNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new UpdateWorkoutRequest("New Name", DateTimeOffset.UtcNow, new());
        
        _repo.UpdateFullWorkoutAsync(Arg.Any<Workout>()).Returns(false);

        // Act
        var result = await _sut.UpdateAsync(id, request, _userId);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task CreateAsync_ShouldCapNegativeWeightsToZero()
    {
        // Arrange
        var request = new CreateWorkoutRequest("Leg Day", DateTimeOffset.UtcNow, new()
        {
            new WorkoutExerciseInputDto("Squat", 1, new()
            {
                new WorkoutSetInputDto(1, new()
                {
                    new WorkoutRepInputDto(-500, 1) // 👈 USER INPUT: -500kg
                })
            })
        });

        _repo.ExistsAsync(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<DateTimeOffset>()).Returns(false);
        _repo.CreateFullWorkoutAsync(Arg.Any<Workout>()).Returns(true);

        // Act
        var result = await _sut.CreateAsync(request, _userId);

        // Assert
        // Check that we passed '0' to the database, NOT -500
        await _repo.Received(1).CreateFullWorkoutAsync(Arg.Is<Workout>(w => 
            w.Exercises[0].Sets[0].Reps[0].Weight == 0 // ✅ EXPECTED: 0
        ));
    }   
}