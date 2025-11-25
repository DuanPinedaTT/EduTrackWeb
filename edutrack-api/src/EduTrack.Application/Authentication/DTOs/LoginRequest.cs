using System.ComponentModel.DataAnnotations;

namespace EduTrack.Application.Authentication.DTOs;

public sealed record LoginRequest
{
    [Required]
    public string UserNameOrEmail { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}
