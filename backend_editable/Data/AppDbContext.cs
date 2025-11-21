using Microsoft.EntityFrameworkCore;
using edutrack_academy_api.Models;

namespace edutrack_academy_api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Curso> Cursos { get; set; }
        public DbSet<Estudiante> Estudiantes { get; set; }
        public DbSet<Inscripcion> Inscripciones { get; set; }
        public DbSet<Asignatura> Asignaturas { get; set; }
        public DbSet<Grado> Grados { get; set; }
        public DbSet<CursoAsignatura> CursoAsignaturas { get; set; }
        public DbSet<NotaConfig> NotaConfigs { get; set; }
        public DbSet<Nota> Notas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Curso - Docente
            modelBuilder.Entity<Curso>()
                .HasOne(c => c.Docente)
                .WithMany()
                .HasForeignKey(c => c.DocenteId)
                .OnDelete(DeleteBehavior.SetNull);

            // Inscripcion: relación many-to-many entre Curso y Estudiante
            modelBuilder.Entity<Inscripcion>()
                .HasOne(i => i.Curso)
                .WithMany(c => c.Inscripciones)
                .HasForeignKey(i => i.CursoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Inscripcion>()
                .HasOne(i => i.Estudiante)
                .WithMany(e => e.Inscripciones)
                .HasForeignKey(i => i.EstudianteId)
                .OnDelete(DeleteBehavior.Cascade);

            // Evitar duplicados: una inscripción única por (EstudianteId, CursoId)
            modelBuilder.Entity<Inscripcion>()
                .HasIndex(i => new { i.EstudianteId, i.CursoId })
                .IsUnique();

            // Nota: las asignaciones curso→asignatura ahora se gestionan
            // mediante la entidad intermedia `CursoAsignatura`.
            // Eliminamos el mapeo directo Curso->Asignatura para evitar
            // dependencias inconsistentes en el modelo.

            // Curso - Grado
            modelBuilder.Entity<Curso>()
                .HasOne(c => c.Grado)
                .WithMany(g => g.Cursos)
                .HasForeignKey(c => c.GradoId)
                .OnDelete(DeleteBehavior.SetNull);

            // Curso.Grupo
            modelBuilder.Entity<Curso>()
                .Property(c => c.Grupo)
                .HasMaxLength(50);

            // Grado Codigo y Grupos
            modelBuilder.Entity<Grado>()
                .Property(g => g.Codigo)
                .HasMaxLength(50);

            modelBuilder.Entity<Grado>()
                .Property(g => g.Grupos)
                .HasMaxLength(500);

            // Asignatura Codigo
            modelBuilder.Entity<Asignatura>()
                .Property(a => a.Codigo)
                .HasMaxLength(50);

            // CursoAsignatura configuration
            modelBuilder.Entity<CursoAsignatura>()
                .HasOne(ca => ca.Curso)
                .WithMany(c => c.CursoAsignaturas)
                .HasForeignKey(ca => ca.CursoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CursoAsignatura>()
                .HasOne(ca => ca.Asignatura)
                .WithMany()
                .HasForeignKey(ca => ca.AsignaturaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CursoAsignatura>()
                .HasOne(ca => ca.Docente)
                .WithMany()
                .HasForeignKey(ca => ca.DocenteId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<CursoAsignatura>()
                .HasIndex(ca => new { ca.CursoId, ca.AsignaturaId })
                .IsUnique();

            // NotaConfig - Curso
            modelBuilder.Entity<NotaConfig>()
                .HasOne(nc => nc.Curso)
                .WithMany()
                .HasForeignKey(nc => nc.CursoId)
                .OnDelete(DeleteBehavior.Cascade);

            // NotaConfig - Configurar decimal Peso
            modelBuilder.Entity<NotaConfig>()
                .Property(nc => nc.Peso)
                .HasPrecision(5, 2);

            // Nota - Estudiante
            modelBuilder.Entity<Nota>()
                .HasOne(n => n.Estudiante)
                .WithMany()
                .HasForeignKey(n => n.EstudianteId)
                .OnDelete(DeleteBehavior.Cascade);

            // Nota - NotaConfig
            modelBuilder.Entity<Nota>()
                .HasOne(n => n.NotaConfig)
                .WithMany()
                .HasForeignKey(n => n.NotaConfigId)
                .OnDelete(DeleteBehavior.Cascade);

            // Nota - Configurar decimal Valor
            modelBuilder.Entity<Nota>()
                .Property(n => n.Valor)
                .HasPrecision(4, 2);
        }
    }
}
