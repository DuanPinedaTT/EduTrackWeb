using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EduTrack.Application.Authentication.Tokens;
using EduTrack.Domain.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace EduTrack.Infrastructure.Authentication;

public sealed class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly JwtOptions _options;

    public JwtTokenGenerator(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public Task<TokenResult> GenerateAsync(ApplicationUser user, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.Secret))
        {
            throw new InvalidOperationException("El secreto JWT no está configurado.");
        }

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Secret));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddMinutes(_options.ExpiresInMinutes);

        var claims = BuildClaims(user);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        var handler = new JwtSecurityTokenHandler();
        var accessToken = handler.WriteToken(token);

        return Task.FromResult(new TokenResult(accessToken, expiresAt));
    }

    private static IEnumerable<Claim> BuildClaims(ApplicationUser user)
    {
        yield return new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString());
        yield return new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString());
        yield return new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty);
        yield return new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty);
        yield return new Claim(ClaimTypes.NameIdentifier, user.Id.ToString());
        yield return new Claim(ClaimTypes.Name, user.UserName ?? string.Empty);

        if (!string.IsNullOrWhiteSpace(user.Role))
        {
            yield return new Claim(ClaimTypes.Role, user.Role);
        }

        if (!string.IsNullOrWhiteSpace(user.FirstName))
        {
            yield return new Claim("given_name", user.FirstName);
        }

        if (!string.IsNullOrWhiteSpace(user.LastName))
        {
            yield return new Claim("family_name", user.LastName);
        }
    }
}
