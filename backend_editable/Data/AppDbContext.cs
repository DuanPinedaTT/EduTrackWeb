using Microsoft.EntityFrameworkCore;
using edutrack_academy_api.Models;

namespace edutrack_academy_api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Administrador> Administradores { get; set; }
        public DbSet<Profesor> Profesores { get; set; }
        public DbSet<Curso> Cursos { get; set; }
        public DbSet<Estudiante> Estudiantes { get; set; }
        public DbSet<Inscripcion> Inscripciones { get; set; }
        public DbSet<Asignatura> Asignaturas { get; set; }
        public DbSet<Grado> Grados { get; set; }
        public DbSet<CursoAsignatura> CursoAsignaturas { get; set; }
        public DbSet<NotaConfig> NotaConfigs { get; set; }
        public DbSet<Nota> Notas { get; set; }
        public DbSet<PeriodoAcademico> PeriodosAcademicos { get; set; }
        public DbSet<Asistencia> Asistencias { get; set; }
        public DbSet<Notificacion> Notificaciones { get; set; }
        public DbSet<Observacion> Observaciones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.User)
                .IsUnique();

            // Usuario perfiles
            modelBuilder.Entity<Administrador>()
                .HasOne(a => a.Usuario)
                .WithOne(u => u.AdministradorPerfil)
                .HasForeignKey<Administrador>(a => a.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Profesor>()
                .HasOne(p => p.Usuario)
                .WithOne(u => u.ProfesorPerfil)
                .HasForeignKey<Profesor>(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Estudiante>()
                .HasOne(e => e.Usuario)
                .WithOne(u => u.EstudiantePerfil)
                .HasForeignKey<Estudiante>(e => e.UsuarioId)
                .OnDelete(DeleteBehavior.SetNull);

            // Curso - Profesor
            modelBuilder.Entity<Curso>()
                .HasOne(c => c.Profesor)
                .WithMany(p => p.CursosTitular!)
                .HasForeignKey(c => c.ProfesorId)
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
                .HasOne(ca => ca.Profesor)
                .WithMany(p => p.Asignaturas!)
                .HasForeignKey(ca => ca.ProfesorId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<CursoAsignatura>()
                .HasIndex(ca => new { ca.CursoId, ca.AsignaturaId })
                .IsUnique();

            // Periodos académicos
            modelBuilder.Entity<PeriodoAcademico>()
                .Property(p => p.Nombre)
                .HasMaxLength(120);

            modelBuilder.Entity<NotaConfig>()
                .HasOne(nc => nc.PeriodoAcademico)
                .WithMany(p => p.ConfiguracionesNotas)
                .HasForeignKey(nc => nc.PeriodoAcademicoId)
                .OnDelete(DeleteBehavior.Cascade);

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
                .WithMany(e => e.Notas)
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

            // Asistencias
            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.Estudiante)
                .WithMany(e => e.Asistencias)
                .HasForeignKey(a => a.EstudianteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.CursoAsignatura)
                .WithMany()
                .HasForeignKey(a => a.CursoAsignaturaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Notificaciones
            modelBuilder.Entity<Notificacion>()
                .HasOne(n => n.Profesor)
                .WithMany()
                .HasForeignKey(n => n.ProfesorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notificacion>()
                .HasOne(n => n.Estudiante)
                .WithMany(e => e.Notificaciones)
                .HasForeignKey(n => n.EstudianteId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Notificacion>()
                .HasOne(n => n.CursoAsignatura)
                .WithMany()
                .HasForeignKey(n => n.CursoAsignaturaId)
                .OnDelete(DeleteBehavior.SetNull);

            // Observaciones
            modelBuilder.Entity<Observacion>()
                .HasOne(o => o.Profesor)
                .WithMany()
                .HasForeignKey(o => o.ProfesorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Observacion>()
                .HasOne(o => o.Estudiante)
                .WithMany(e => e.Observaciones)
                .HasForeignKey(o => o.EstudianteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Observacion>()
                .HasOne(o => o.CursoAsignatura)
                .WithMany()
                .HasForeignKey(o => o.CursoAsignaturaId)
                .OnDelete(DeleteBehavior.SetNull);

            // Seed básico
            var adminUser = new Usuario
            {
                Id = 1,
                User = "admin",
                PasswordHash = "$2a$11$8Ax7AnCM1j7rwhhtjfiSeu41IrT9jp9.yhiAaZ1I.F7.DOPxJrj1C",
                Nombre = "Admin",
                Apellido = "Principal",
                Email = "admin@edutrack.com",
                Rol = "admin"
            };

            var profesorUser = new Usuario
            {
                Id = 2,
                User = "docente",
                PasswordHash = "$2a$11$k26qcKoy0eZZ.!9dBbTK1ehV4VHKs3P6KyHRxY6SY3n9Pqj8VimLa",
                Nombre = "María",
                Apellido = "González",
                Email = "docente@edutrack.com",
                Rol = "docente"
            };

            var estudianteUser = new Usuario
            {
                Id = 3,
                User = "estudiante",
                PasswordHash = "$2a$11$0LjXmJvLCYOtJk9gDC11SuGeUXLEVp3G.yUpiRaY1oWXcnZ6FQxK6",
                Nombre = "Juan",
                Apellido = "Pérez",
                Email = "estudiante@edutrack.com",
                Rol = "estudiante"
            };

            modelBuilder.Entity<Usuario>().HasData(adminUser, profesorUser, estudianteUser);

            modelBuilder.Entity<Administrador>().HasData(new Administrador
            {
                Id = 1,
                UsuarioId = adminUser.Id,
                Telefono = "3001234567",
                Direccion = "Calle Principal 123"
            });

            modelBuilder.Entity<Profesor>().HasData(new Profesor
            {
                Id = 1,
                UsuarioId = profesorUser.Id,
                Especialidad = "Matemáticas",
                Telefono = "3009876543",
                Direccion = "Avenida Educación 456",
                Biografia = "Docente titular de ciencias exactas"
            });

            modelBuilder.Entity<Estudiante>().HasData(new Estudiante
            {
                Id = 1,
                UsuarioId = estudianteUser.Id,
                Nombre = "Juan",
                Apellido = "Pérez",
                Documento = "123456789",
                Telefono = "3005551234",
                Direccion = "Calle Estudiantes 321",
                Acudiente = "Carlos Pérez",
                Nivel = "10°"
            });

            modelBuilder.Entity<PeriodoAcademico>().HasData(
                new PeriodoAcademico { Id = 1, Nombre = "Periodo 1", Orden = 1, FechaInicio = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), FechaFin = new DateTime(2025, 3, 31, 23, 59, 59, DateTimeKind.Utc), Activo = true },
                new PeriodoAcademico { Id = 2, Nombre = "Periodo 2", Orden = 2, FechaInicio = new DateTime(2025, 4, 1, 0, 0, 0, DateTimeKind.Utc), FechaFin = new DateTime(2025, 6, 30, 23, 59, 59, DateTimeKind.Utc), Activo = false },
                new PeriodoAcademico { Id = 3, Nombre = "Periodo 3", Orden = 3, FechaInicio = new DateTime(2025, 7, 1, 0, 0, 0, DateTimeKind.Utc), FechaFin = new DateTime(2025, 9, 30, 23, 59, 59, DateTimeKind.Utc), Activo = false },
                new PeriodoAcademico { Id = 4, Nombre = "Periodo 4", Orden = 4, FechaInicio = new DateTime(2025, 10, 1, 0, 0, 0, DateTimeKind.Utc), FechaFin = new DateTime(2025, 12, 31, 23, 59, 59, DateTimeKind.Utc), Activo = false }
            );
        }
    }
}
