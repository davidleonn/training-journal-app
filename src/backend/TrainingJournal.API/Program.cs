using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TrainingJournal.API.Repositories.Interfaces;
using TrainingJournal.API.Repositories;
using TrainingJournal.API.Endpoints;
using TrainingJournal.API;
using TrainingJournal.API.Services;
using TrainingJournal.API.Services.Interfaces;
using TrainingJournal.API.Infrastructure.Security;
using TrainingJournal.API.Core.Interfaces;

var builder = WebApplication.CreateBuilder(args);
var jwtKey = builder.Configuration["JwtSettings:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("FATAL ERROR: JwtSettings:Key is missing in appsettings.json");
}
// --- 1. Add Services ---

// JWT Configuration
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
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
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]!))
    };
});

builder.Services.AddAuthorization();

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

app.UseCors("FrontendPolicy");

// --- IMPORTANT: Authentication must come BEFORE Authorization ---
app.UseAuthentication(); 
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- 3. Register Endpoints ---

app.MapUserEndpoints(); 
app.MapAuthEndpoints();

app.MapGet("/health", () => Results.Ok(new { Status = "OK" }));

app.Run();