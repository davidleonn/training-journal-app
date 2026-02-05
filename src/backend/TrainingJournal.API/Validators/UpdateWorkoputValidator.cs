using FluentValidation;
using TrainingJournal.API.Contracts;

namespace TrainingJournal.API.Validators;

public class UpdateWorkoutValidator : AbstractValidator<UpdateWorkoutRequest>
{
    public UpdateWorkoutValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Workout name is required.")
            .MaximumLength(100);

        RuleFor(x => x.Date)
            .LessThanOrEqualTo(DateTimeOffset.UtcNow)
            .WithMessage("You cannot log workouts in the future.");
    }
}