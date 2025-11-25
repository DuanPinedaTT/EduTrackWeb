using EduTrack.Domain.Academics;
using EduTrack.Domain.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UserRoleConstants = EduTrack.Domain.Users.UserRoles;

namespace EduTrack.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Grado> Grados => Set<Grado>();
    public DbSet<Curso> Cursos => Set<Curso>();
    public DbSet<Asignatura> Asignaturas => Set<Asignatura>();
    public DbSet<Estudiante> Estudiantes => Set<Estudiante>();
    public DbSet<Inscripcion> Inscripciones => Set<Inscripcion>();
    public DbSet<CursoAsignatura> CursoAsignaturas => Set<CursoAsignatura>();
    public DbSet<NotaConfig> NotaConfigs => Set<NotaConfig>();
    public DbSet<Nota> Notas => Set<Nota>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(user => user.FirstName)
                .HasMaxLength(100);

            entity.Property(user => user.LastName)
                .HasMaxLength(100);

            entity.Property(user => user.Role)
                .HasMaxLength(50)
                .HasDefaultValue(UserRoleConstants.Docente);

            entity.Property(user => user.CreatedAtUtc)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(user => user.UpdatedAtUtc)
                .IsRequired(false);
        });

        builder.Entity<ApplicationRole>(entity =>
        {
            entity.Property(role => role.Name)
                .HasMaxLength(50);

            entity.Property(role => role.NormalizedName)
                .HasMaxLength(50);
        });

        ConfigureAcademics(builder);
    }

    private static void ConfigureAcademics(ModelBuilder builder)
    {
        builder.Entity<Grado>(entity =>
        {
            entity.Property(g => g.Nombre)
                .HasMaxLength(150);

            entity.Property(g => g.Codigo)
                .HasMaxLength(50);

            entity.Property(g => g.Grupos)
                .HasMaxLength(500);
        });

        builder.Entity<Asignatura>(entity =>
        {
            entity.Property(a => a.Nombre)
                .HasMaxLength(150);

            entity.Property(a => a.Codigo)
                .HasMaxLength(50);

            entity.HasIndex(a => a.Codigo)
                .IsUnique();
        });

        builder.Entity<Curso>(entity =>
        {
            entity.Property(c => c.Nombre)
                .HasMaxLength(150);

            entity.Property(c => c.Grupo)
                .HasMaxLength(50);

            entity.HasOne(c => c.Grado)
                .WithMany(g => g.Cursos)
                .HasForeignKey(c => c.GradoId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(c => c.Docente)
                .WithMany()
                .HasForeignKey(c => c.DocenteId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<CursoAsignatura>(entity =>
        {
            entity.HasOne(ca => ca.Curso)
                .WithMany(c => c.CursoAsignaturas)
                .HasForeignKey(ca => ca.CursoId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ca => ca.Asignatura)
                .WithMany(a => a.CursoAsignaturas)
                .HasForeignKey(ca => ca.AsignaturaId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ca => ca.Docente)
                .WithMany()
                .HasForeignKey(ca => ca.DocenteId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(ca => new { ca.CursoId, ca.AsignaturaId })
                .IsUnique();
        });

        builder.Entity<Estudiante>(entity =>
        {
            entity.Property(e => e.Nombre)
                .HasMaxLength(150);

            entity.Property(e => e.Documento)
                .HasMaxLength(50);

            entity.HasIndex(e => e.Documento)
                .IsUnique();
        });

        builder.Entity<Inscripcion>(entity =>
        {
            entity.HasOne(i => i.Curso)
                .WithMany(c => c.Inscripciones)
                .HasForeignKey(i => i.CursoId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(i => i.Estudiante)
                .WithMany(e => e.Inscripciones)
                .HasForeignKey(i => i.EstudianteId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(i => new { i.CursoId, i.EstudianteId })
                .IsUnique();
        });

        builder.Entity<NotaConfig>(entity =>
        {
            entity.Property(nc => nc.Nombre)
                .HasMaxLength(150);

            entity.Property(nc => nc.Peso)
                .HasPrecision(5, 2);

            entity.HasOne(nc => nc.Curso)
                .WithMany(c => c.NotaConfigs)
                .HasForeignKey(nc => nc.CursoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Nota>(entity =>
        {
            entity.Property(n => n.Valor)
                .HasPrecision(4, 2);

            entity.HasOne(n => n.Estudiante)
                .WithMany(e => e.Notas)
                .HasForeignKey(n => n.EstudianteId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(n => n.NotaConfig)
                .WithMany(nc => nc.Notas)
                .HasForeignKey(n => n.NotaConfigId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
