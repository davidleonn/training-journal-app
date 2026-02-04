using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TrainingJournal.API.Core.Interfaces; // Links to Step 1

namespace TrainingJournal.API.Infrastructure.Security;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }
public AuthResult CreateToken(string email, string userId)
{
    // 1. Get the duration from config
    var durationMinutes = Convert.ToInt32(_config["JwtSettings:DurationInMinutes"]);

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

    var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Email, email),
        new Claim(JwtRegisteredClaimNames.Sub, userId)
    };

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(claims),
        // We still use DateTime internally to stamp the token
        Expires = DateTime.UtcNow.AddMinutes(durationMinutes), 
        SigningCredentials = creds,
        Issuer = _config["JwtSettings:Issuer"],
        Audience = _config["JwtSettings:Audience"]
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);

    // 2. Return the string AND the raw minutes
    return new AuthResult(tokenHandler.WriteToken(token), durationMinutes);
}
}