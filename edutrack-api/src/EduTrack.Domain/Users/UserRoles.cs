namespace EduTrack.Domain.Users;

public static class UserRoles
{
    public const string Admin = "admin";
    public const string Docente = "docente";

    public static IReadOnlyCollection<string> All { get; } = Array.AsReadOnly(new[] { Admin, Docente });
}
