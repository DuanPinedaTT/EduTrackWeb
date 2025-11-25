using EduTrack.Domain.Users;

namespace EduTrack.Application.Authentication.Tokens;

public interface IJwtTokenGenerator
{
    Task<TokenResult> GenerateAsync(ApplicationUser user, CancellationToken cancellationToken = default);
}
