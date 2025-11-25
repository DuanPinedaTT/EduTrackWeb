namespace EduTrack.Infrastructure.Seed;

public sealed class SeedSettings
{
    public AdminSeedSettings Admin { get; set; } = new();
    public List<SeedAsignatura> Asignaturas { get; set; } = new();
    public List<SeedGrado> Grados { get; set; } = new();
}

public sealed class AdminSeedSettings
{
    public string UserName { get; set; } = "admin";
    public string Email { get; set; } = "admin@edutrack.com";
    public string FirstName { get; set; } = "Admin";
    public string LastName { get; set; } = "EduTrack";
    public string Password { get; set; } = "CambiarEstaClave123!";
    public string? PhoneNumber { get; set; }
}

public sealed class SeedAsignatura
{
    public string Nombre { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;
}

public sealed class SeedGrado
{
    public string Nombre { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;
    public List<string> Grupos { get; set; } = new();
}
