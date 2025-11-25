using EduTrack.Application.Authentication.DTOs;
using EduTrack.Application.Authentication.Services;
using EduTrack.Application.Authentication.Tokens;
using EduTrack.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace EduTrack.Infrastructure.Authentication;

public sealed class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        IJwtTokenGenerator jwtTokenGenerator,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwtTokenGenerator = jwtTokenGenerator;
        _logger = logger;
    }

    public async Task<AuthResult> RegisterAsync(RegisterUserRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedUserName = request.UserName.Trim();
        var normalizedEmail = request.Email.Trim();

        if (await _userManager.FindByNameAsync(normalizedUserName) is not null)
        {
            return AuthResult.Failure("El usuario ya existe.");
        }

        if (await _userManager.FindByEmailAsync(normalizedEmail) is not null)
        {
            return AuthResult.Failure("El correo electrónico ya está registrado.");
        }

        var role = NormalizeRole(request.Role);

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = normalizedUserName,
            Email = normalizedEmail,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Role = role,
            EmailConfirmed = true
        };

        var createResult = await _userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            return AuthResult.Failure(createResult.Errors.Select(error => error.Description));
        }

        await EnsureRoleExistsAsync(role);

        var roleResult = await _userManager.AddToRoleAsync(user, role);
        if (!roleResult.Succeeded)
        {
            await _userManager.DeleteAsync(user);
            return AuthResult.Failure(roleResult.Errors.Select(error => error.Description));
        }

        var tokenResult = await _jwtTokenGenerator.GenerateAsync(user, cancellationToken);
        var response = BuildResponse(user, tokenResult);

        return AuthResult.Success(response);
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var identifier = request.UserNameOrEmail.Trim();
        var user = await _userManager.FindByNameAsync(identifier) ?? await _userManager.FindByEmailAsync(identifier);

        if (user is null)
        {
            return AuthResult.Failure("Credenciales inválidas.");
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!passwordValid)
        {
            return AuthResult.Failure("Credenciales inválidas.");
        }

        await SyncUserRoleAsync(user);

        var tokenResult = await _jwtTokenGenerator.GenerateAsync(user, cancellationToken);
        var response = BuildResponse(user, tokenResult);

        return AuthResult.Success(response);
    }

    private async Task EnsureRoleExistsAsync(string role)
    {
        if (await _roleManager.RoleExistsAsync(role))
        {
            return;
        }

        var createResult = await _roleManager.CreateAsync(new ApplicationRole(role));
        if (!createResult.Succeeded)
        {
            var errors = string.Join(", ", createResult.Errors.Select(error => error.Description));
            _logger.LogError("No se pudo crear el rol {Role}: {Errors}", role, errors);
            throw new InvalidOperationException($"No se pudo crear el rol {role}. {errors}");
        }
    }

    private async Task SyncUserRoleAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var currentRole = roles.FirstOrDefault();

        if (string.IsNullOrWhiteSpace(currentRole))
        {
            currentRole = user.Role ?? UserRoles.Docente;
            await EnsureRoleExistsAsync(currentRole);
            await _userManager.AddToRoleAsync(user, currentRole);
        }

        if (!string.Equals(user.Role, currentRole, StringComparison.OrdinalIgnoreCase))
        {
            user.Role = currentRole;
            await _userManager.UpdateAsync(user);
        }
    }

    private static string NormalizeRole(string? role)
    {
        if (string.IsNullOrWhiteSpace(role))
        {
            return UserRoles.Docente;
        }

        var normalizedRole = role.ToLowerInvariant();
        return UserRoles.All.Contains(normalizedRole) ? normalizedRole : UserRoles.Docente;
    }

    private static AuthResponse BuildResponse(ApplicationUser user, TokenResult tokenResult)
    {
        return new AuthResponse
        {
            AccessToken = tokenResult.AccessToken,
            ExpiresAtUtc = tokenResult.ExpiresAtUtc,
            User = new UserSummaryDto
            {
                Id = user.Id,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role
            }
        };
    }
}
