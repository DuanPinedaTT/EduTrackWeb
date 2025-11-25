using EduTrack.Domain.Academics;
using EduTrack.Domain.Users;
using EduTrack.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EduTrack.Infrastructure.Seed;

public sealed class DatabaseSeeder : IDatabaseSeeder
{
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly SeedSettings _settings;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(
        ApplicationDbContext dbContext,
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        IOptions<SeedSettings> settings,
        ILogger<DatabaseSeeder> logger)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _roleManager = roleManager;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.Database.MigrateAsync(cancellationToken);

        await EnsureRolesAsync(cancellationToken);
        await EnsureAdminAsync(cancellationToken);
        await EnsureAsignaturasAsync(cancellationToken);
        await EnsureGradosAsync(cancellationToken);
    }

    private async Task EnsureRolesAsync(CancellationToken cancellationToken)
    {
        foreach (var role in UserRoles.All)
        {
            if (await _roleManager.RoleExistsAsync(role))
            {
                continue;
            }

            var result = await _roleManager.CreateAsync(new ApplicationRole(role));
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(error => error.Description));
                _logger.LogError("Error creando el rol {Role}: {Errors}", role, errors);
                throw new InvalidOperationException($"No se pudo crear el rol {role}");
            }
        }
    }

    private async Task EnsureAdminAsync(CancellationToken cancellationToken)
    {
        var admin = _settings.Admin ?? new AdminSeedSettings();

        if (string.IsNullOrWhiteSpace(admin.UserName) || string.IsNullOrWhiteSpace(admin.Password))
        {
            _logger.LogWarning("Configuración de admin incompleta. Se omite la siembra de usuario administrador.");
            return;
        }

        var existing = await _userManager.FindByNameAsync(admin.UserName);
        if (existing is not null)
        {
            if (!await _userManager.IsInRoleAsync(existing, UserRoles.Admin))
            {
                await _userManager.AddToRoleAsync(existing, UserRoles.Admin);
            }

            if (!string.Equals(existing.Role, UserRoles.Admin, StringComparison.OrdinalIgnoreCase))
            {
                existing.Role = UserRoles.Admin;
                await _userManager.UpdateAsync(existing);
            }

            return;
        }

        var adminUser = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = admin.UserName.Trim(),
            Email = admin.Email.Trim(),
            FirstName = admin.FirstName.Trim(),
            LastName = admin.LastName.Trim(),
            PhoneNumber = admin.PhoneNumber,
            Role = UserRoles.Admin,
            EmailConfirmed = true
        };

        var createResult = await _userManager.CreateAsync(adminUser, admin.Password);
        if (!createResult.Succeeded)
        {
            var errors = string.Join(", ", createResult.Errors.Select(error => error.Description));
            _logger.LogError("Error creando el usuario admin: {Errors}", errors);
            throw new InvalidOperationException("No se pudo crear el usuario administrador.");
        }

        await _userManager.AddToRoleAsync(adminUser, UserRoles.Admin);
    }

    private async Task EnsureAsignaturasAsync(CancellationToken cancellationToken)
    {
        if (_settings.Asignaturas is null || _settings.Asignaturas.Count == 0)
        {
            return;
        }

        foreach (var seedAsignatura in _settings.Asignaturas.Where(a => !string.IsNullOrWhiteSpace(a.Codigo)))
        {
            var codigo = seedAsignatura.Codigo.Trim().ToUpperInvariant();
            if (await _dbContext.Asignaturas.AnyAsync(a => a.Codigo == codigo, cancellationToken))
            {
                continue;
            }

            _dbContext.Asignaturas.Add(new Asignatura
            {
                Nombre = string.IsNullOrWhiteSpace(seedAsignatura.Nombre) ? codigo : seedAsignatura.Nombre.Trim(),
                Codigo = codigo
            });
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsureGradosAsync(CancellationToken cancellationToken)
    {
        if (_settings.Grados is null || _settings.Grados.Count == 0)
        {
            return;
        }

        foreach (var seedGrado in _settings.Grados.Where(g => !string.IsNullOrWhiteSpace(g.Codigo)))
        {
            var codigo = seedGrado.Codigo.Trim().ToUpperInvariant();
            var existing = await _dbContext.Grados.FirstOrDefaultAsync(g => g.Codigo == codigo, cancellationToken);
            var grupos = seedGrado.Grupos is null
                ? string.Empty
                : string.Join(',', seedGrado.Grupos.Where(g => !string.IsNullOrWhiteSpace(g)).Select(g => g.Trim()));

            if (existing is null)
            {
                _dbContext.Grados.Add(new Grado
                {
                    Nombre = string.IsNullOrWhiteSpace(seedGrado.Nombre) ? codigo : seedGrado.Nombre.Trim(),
                    Codigo = codigo,
                    Grupos = grupos
                });
            }
            else
            {
                var needsUpdate = false;
                if (!string.IsNullOrWhiteSpace(seedGrado.Nombre) && existing.Nombre != seedGrado.Nombre)
                {
                    existing.Nombre = seedGrado.Nombre.Trim();
                    needsUpdate = true;
                }

                if (!string.Equals(existing.Grupos, grupos, StringComparison.Ordinal))
                {
                    existing.Grupos = grupos;
                    needsUpdate = true;
                }

                if (needsUpdate)
                {
                    _dbContext.Grados.Update(existing);
                }
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
