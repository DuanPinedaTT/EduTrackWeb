using System.ComponentModel.DataAnnotations;
using EduTrack.Domain.Users;

namespace EduTrack.Application.Authentication.DTOs;

public sealed record RegisterUserRequest
{
    [Required]
    public string UserName { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; init; } = string.Empty;

    [Required]
    public string FirstName { get; init; } = string.Empty;

    [Required]
    public string LastName { get; init; } = string.Empty;

    public string Role { get; init; } = UserRoles.Docente;
}
