namespace EduTrack.Application.Authentication.DTOs;

public sealed record AuthResponse
{
    public string AccessToken { get; init; } = string.Empty;
    public DateTime ExpiresAtUtc { get; init; }
    public UserSummaryDto User { get; init; } = new();
}
