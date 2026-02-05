using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.Generation.Processors.Security;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Repositories;
using TrainingJournal.API.Endpoints;
using TrainingJournal.API;
using TrainingJournal.API.Services;
using TrainingJournal.API.Services.Interfaces;
using TrainingJournal.API.Infrastructure.Security;
using TrainingJournal.API.Core.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using FluentValidation;
using TrainingJournal.API.Validators;

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
var builder = WebApplication.CreateBuilder(args);
Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

// --- 1. Add Services ---

var jwtKey = builder.Configuration["JwtSettings:Key"];
if (string.IsNullOrEmpty(jwtKey)) throw new Exception("JwtSettings:Key is missing");

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();
builder.Services.AddCors(options => options.AddPolicy("FrontendPolicy", 
    p => p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOpenApiDocument(document =>
{
    document.Title = "Training Journal API";
    document.Version = "v1";

    // 1. Define the Security Scheme
    document.AddSecurity("Bearer", Enumerable.Empty<string>(), new OpenApiSecurityScheme
    {
        Type = OpenApiSecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT", 
        Description = "Paste your JWT token here (no need to type 'Bearer ')"
    });

    // 2. Add the Operation Processor (Applies it to endpoints)
    document.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("Bearer"));
});

// Register Dependencies
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IWorkoutRepository, WorkoutRepository>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<IWorkoutService, WorkoutService>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateWorkoutValidator>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails(); 

var app = builder.Build();

// --- 2. Configure Pipeline ---

app.UseExceptionHandler();
app.UseCors("FrontendPolicy");

app.UseAuthentication(); 
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

app.MapUserEndpoints(); 
app.MapAuthEndpoints();
app.MapWorkoutEndpoints();
app.MapGet("/health", () => Results.Ok(new { Status = "OK" }));

app.Run();