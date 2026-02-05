using FluentValidation;
using TrainingJournal.API.Contracts;

namespace TrainingJournal.API.Validators;

public class CreateWorkoutValidator : AbstractValidator<CreateWorkoutRequest>
{
    public CreateWorkoutValidator()
    {
        // Rule 1: Name is required
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Workout name is required.")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

        // Rule 2: Date cannot be in the future
        RuleFor(x => x.Date)
            .LessThanOrEqualTo(DateTimeOffset.UtcNow)
            .WithMessage("You cannot log workouts in the future.");
            
        // Rule 3: Must have at least one exercise (Optional, but good practice)
        RuleFor(x => x.Exercises)
            .NotEmpty().WithMessage("A workout must contain at least one exercise.");
    }
}