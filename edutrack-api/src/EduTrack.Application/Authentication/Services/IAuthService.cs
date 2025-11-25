using EduTrack.Application.Authentication.DTOs;

namespace EduTrack.Application.Authentication.Services;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterUserRequest request, CancellationToken cancellationToken = default);
    Task<AuthResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
