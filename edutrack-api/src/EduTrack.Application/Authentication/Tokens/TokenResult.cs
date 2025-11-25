namespace EduTrack.Application.Authentication.Tokens;

public sealed record TokenResult(string AccessToken, DateTime ExpiresAtUtc);
