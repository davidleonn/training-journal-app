using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Repositories;
using TrainingJournal.API.Endpoints;
using TrainingJournal.API;
using TrainingJournal.API.Services;
using TrainingJournal.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Add Services ---

// Define CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails(); 
builder.Services.AddScoped<UserService>();

var app = builder.Build();

// --- 2. Configure Pipeline ---

app.UseExceptionHandler();

// Use CORS Policy (Must be placed before Endpoints)
app.UseCors("FrontendPolicy");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- 3. Register Endpoints ---

app.MapUserEndpoints(); 
app.MapAuthEndpoints();

// Health Check
app.MapGet("/health", () => Results.Ok(new { Status = "OK" }));

app.Run();