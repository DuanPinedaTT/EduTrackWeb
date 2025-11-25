namespace EduTrack.Application.Authentication.DTOs;

public sealed record AuthResult
{
    public bool Succeeded { get; init; }
    public IReadOnlyCollection<string> Errors { get; init; } = Array.Empty<string>();
    public AuthResponse? Response { get; init; }

    public static AuthResult Success(AuthResponse response) => new()
    {
        Succeeded = true,
        Response = response
    };

    public static AuthResult Failure(params string[] errors) => new()
    {
        Succeeded = false,
        Errors = errors
    };

    public static AuthResult Failure(IEnumerable<string> errors) => new()
    {
        Succeeded = false,
        Errors = errors.ToArray()
    };
}
