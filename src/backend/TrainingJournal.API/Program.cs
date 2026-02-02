using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Repositories;
using TrainingJournal.API.Endpoints;
using TrainingJournal.API;
using TrainingJournal.API.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails(); // Adds standard fields to the JSON
builder.Services.AddScoped<UserService>();

var app = builder.Build();
app.UseExceptionHandler();

// 2. Configure Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 3. Register Endpoints
app.MapUserEndpoints(); // Connects our UserEndpoints.cs file

// Health Check
app.MapGet("/health", () => Results.Ok(new { Status = "OK" }));

app.Run();