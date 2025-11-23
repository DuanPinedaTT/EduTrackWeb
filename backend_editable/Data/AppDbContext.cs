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

            // Seed demo data (usuarios + estructura académica)
            var usuariosSeed = new List<Usuario>
            {
                new Usuario
                {
                    Id = 1,
                    User = "admin.campus",
                    PasswordHash = "$2a$11$hUQWqGG5.yWyM/qqiHKF4uxRXLbYvGcXkXhH5u6yrSqhEvWrkN3CO",
                    Nombre = "Laura",
                    Apellido = "Medina",
                    Email = "laura.medina@edutrack.com",
                    Rol = "admin"
                },
                new Usuario
                {
                    Id = 2,
                    User = "coordinacion",
                    PasswordHash = "$2a$11$qvllrbCaMbGgYllRCgvL/ewadMQK0Y0xFyPJHbKiROon3GgTB0tN2",
                    Nombre = "Diego",
                    Apellido = "Herrera",
                    Email = "diego.herrera@edutrack.com",
                    Rol = "admin"
                },
                new Usuario
                {
                    Id = 3,
                    User = "rectoria",
                    PasswordHash = "$2a$11$bSnUxtpacM98uXY0SX1rTOOJUXJG3OCM5UVzBaSiBLvWWW0kWfwJu",
                    Nombre = "Sofía",
                    Apellido = "Roldán",
                    Email = "sofia.roldan@edutrack.com",
                    Rol = "admin"
                },
                new Usuario
                {
                    Id = 4,
                    User = "prof.mvalencia",
                    PasswordHash = "$2a$11$oixTIg92I4Pfm5TUafTLe.D3atM/eQNY3PORqf4Z3cFFBNklcHmpq",
                    Nombre = "Martina",
                    Apellido = "Valencia",
                    Email = "martina.valencia@edutrack.com",
                    Rol = "docente"
                },
                new Usuario
                {
                    Id = 5,
                    User = "prof.jramirez",
                    PasswordHash = "$2a$11$OubtyYofmljpSC0TooyC0uUR2FGPP8XrYCCRvrSiu0JZW9/BCCQU6",
                    Nombre = "Julio",
                    Apellido = "Ramírez",
                    Email = "julio.ramirez@edutrack.com",
                    Rol = "docente"
                },
                new Usuario
                {
                    Id = 6,
                    User = "prof.zamora",
                    PasswordHash = "$2a$11$aOVh.JyjDYjih70j9g/jwu3b4WRSFn0pfSCvCqQdLnpU5GtWtW4zC",
                    Nombre = "Lucía",
                    Apellido = "Zamora",
                    Email = "lucia.zamora@edutrack.com",
                    Rol = "docente"
                },
                new Usuario
                {
                    Id = 7,
                    User = "est.luisa",
                    PasswordHash = "$2a$11$Mi70yXzDH8aqBCCn45bkk..dKm3xZmbLMBdErkWzpgzxiFG3Dhv76",
                    Nombre = "Luisa",
                    Apellido = "Marín",
                    Email = "luisa.marin@edutrack.com",
                    Rol = "estudiante"
                },
                new Usuario
                {
                    Id = 8,
                    User = "est.carlos",
                    PasswordHash = "$2a$11$2cpxkHQJT/6voaIPqNFHsexie2arprDlffJxVsesaEDqwvgTj.tFK",
                    Nombre = "Carlos",
                    Apellido = "Ruiz",
                    Email = "carlos.ruiz@edutrack.com",
                    Rol = "estudiante"
                },
                new Usuario
                {
                    Id = 9,
                    User = "est.ana",
                    PasswordHash = "$2a$11$vO3ZrqzQCN3pzQwGGNOq8u7fKUcrWUng80aZWb4ZpKNKqH9DW/M2e",
                    Nombre = "Ana",
                    Apellido = "Suárez",
                    Email = "ana.suarez@edutrack.com",
                    Rol = "estudiante"
                }
            };

            modelBuilder.Entity<Usuario>().HasData(usuariosSeed);

            modelBuilder.Entity<Administrador>().HasData(
                new Administrador
                {
                    Id = 1,
                    UsuarioId = 1,
                    Telefono = "3001112233",
                    Direccion = "Calle 10 #45-21"
                },
                new Administrador
                {
                    Id = 2,
                    UsuarioId = 2,
                    Telefono = "3002223344",
                    Direccion = "Carrera 50 #12-44"
                },
                new Administrador
                {
                    Id = 3,
                    UsuarioId = 3,
                    Telefono = "3003334455",
                    Direccion = "Diagonal 80 #66-01"
                }
            );

            modelBuilder.Entity<Profesor>().HasData(
                new Profesor
                {
                    Id = 1,
                    UsuarioId = 4,
                    Especialidad = "Matemáticas",
                    Telefono = "3009876543",
                    Direccion = "Av. Educativa 45",
                    Biografia = "Mentora STEM con enfoque en innovación"
                },
                new Profesor
                {
                    Id = 2,
                    UsuarioId = 5,
                    Especialidad = "Ciencias Naturales",
                    Telefono = "3008765432",
                    Direccion = "Calle 23 #18-55",
                    Biografia = "Coordinador de laboratorios escolares"
                },
                new Profesor
                {
                    Id = 3,
                    UsuarioId = 6,
                    Especialidad = "Inglés",
                    Telefono = "3007654321",
                    Direccion = "Transversal 90 #33-10",
                    Biografia = "Docente bilingüe con certificación CELTA"
                }
            );

            var estudiantesSeed = new List<Estudiante>
            {
                new Estudiante
                {
                    Id = 1,
                    UsuarioId = 7,
                    Nombre = "Luisa",
                    Apellido = "Marín",
                    Documento = "1053891201",
                    Telefono = "3015558899",
                    Direccion = "Barrio Primavera",
                    Acudiente = "Patricia Gómez",
                    Nivel = "5°",
                    FechaNacimiento = new DateTime(2014, 5, 17, 0, 0, 0, DateTimeKind.Utc)
                },
                new Estudiante
                {
                    Id = 2,
                    UsuarioId = 8,
                    Nombre = "Carlos",
                    Apellido = "Ruiz",
                    Documento = "1054782203",
                    Telefono = "3017776644",
                    Direccion = "Conjunto Nogales",
                    Acudiente = "Sandra Ruiz",
                    Nivel = "8°",
                    FechaNacimiento = new DateTime(2012, 11, 9, 0, 0, 0, DateTimeKind.Utc)
                },
                new Estudiante
                {
                    Id = 3,
                    UsuarioId = 9,
                    Nombre = "Ana",
                    Apellido = "Suárez",
                    Documento = "1045221188",
                    Telefono = "3027773311",
                    Direccion = "Urbanización Cedros",
                    Acudiente = "Marcos Suárez",
                    Nivel = "10°",
                    FechaNacimiento = new DateTime(2010, 3, 28, 0, 0, 0, DateTimeKind.Utc)
                },
                new Estudiante
                {
                    Id = 4,
                    Nombre = "Mateo",
                    Apellido = "López",
                    Documento = "1053999981",
                    Telefono = "3009007766",
                    Direccion = "Villa del Prado",
                    Acudiente = "Carolina López",
                    Nivel = "5°",
                    FechaNacimiento = new DateTime(2014, 8, 5, 0, 0, 0, DateTimeKind.Utc)
                },
                new Estudiante
                {
                    Id = 5,
                    Nombre = "Valentina",
                    Apellido = "Ortiz",
                    Documento = "1045888812",
                    Telefono = "3012203344",
                    Direccion = "Bosques del Norte",
                    Acudiente = "Andrea Ortiz",
                    Nivel = "8°",
                    FechaNacimiento = new DateTime(2012, 1, 15, 0, 0, 0, DateTimeKind.Utc)
                },
                new Estudiante
                {
                    Id = 6,
                    Nombre = "Samuel",
                    Apellido = "Torres",
                    Documento = "1050011223",
                    Telefono = "3021144556",
                    Direccion = "Altos de la Sabana",
                    Acudiente = "Ricardo Torres",
                    Nivel = "10°",
                    FechaNacimiento = new DateTime(2010, 9, 2, 0, 0, 0, DateTimeKind.Utc)
                }
            };

            modelBuilder.Entity<Estudiante>().HasData(estudiantesSeed);

            modelBuilder.Entity<Grado>().HasData(
                new Grado { Id = 1, Nombre = "Quinto Básico", Codigo = "5BAS", Grupos = "A,B" },
                new Grado { Id = 2, Nombre = "Octavo Básico", Codigo = "8BAS", Grupos = "A,B" },
                new Grado { Id = 3, Nombre = "Décimo Académico", Codigo = "10ACA", Grupos = "A" }
            );

            modelBuilder.Entity<Asignatura>().HasData(
                new Asignatura { Id = 1, Nombre = "Matemáticas", Codigo = "MAT" },
                new Asignatura { Id = 2, Nombre = "Lengua Castellana", Codigo = "LEN" },
                new Asignatura { Id = 3, Nombre = "Ciencias Naturales", Codigo = "CIE" },
                new Asignatura { Id = 4, Nombre = "Inglés", Codigo = "ING" },
                new Asignatura { Id = 5, Nombre = "Historia", Codigo = "HIS" }
            );

            modelBuilder.Entity<Curso>().HasData(
                new Curso { Id = 1, Nombre = "5° Básico A", Grupo = "A", GradoId = 1, ProfesorId = 1 },
                new Curso { Id = 2, Nombre = "8° Básico A", Grupo = "A", GradoId = 2, ProfesorId = 2 },
                new Curso { Id = 3, Nombre = "10° Académico A", Grupo = "A", GradoId = 3, ProfesorId = 3 }
            );

            modelBuilder.Entity<CursoAsignatura>().HasData(
                new CursoAsignatura { Id = 1, CursoId = 1, AsignaturaId = 1, ProfesorId = 1 },
                new CursoAsignatura { Id = 2, CursoId = 1, AsignaturaId = 4, ProfesorId = 3 },
                new CursoAsignatura { Id = 3, CursoId = 2, AsignaturaId = 3, ProfesorId = 2 },
                new CursoAsignatura { Id = 4, CursoId = 2, AsignaturaId = 2, ProfesorId = 1 },
                new CursoAsignatura { Id = 5, CursoId = 3, AsignaturaId = 4, ProfesorId = 3 },
                new CursoAsignatura { Id = 6, CursoId = 3, AsignaturaId = 5, ProfesorId = 2 }
            );

            modelBuilder.Entity<Inscripcion>().HasData(
                new Inscripcion { Id = 1, CursoId = 1, EstudianteId = 1 },
                new Inscripcion { Id = 2, CursoId = 1, EstudianteId = 4 },
                new Inscripcion { Id = 3, CursoId = 2, EstudianteId = 2 },
                new Inscripcion { Id = 4, CursoId = 2, EstudianteId = 5 },
                new Inscripcion { Id = 5, CursoId = 3, EstudianteId = 3 },
                new Inscripcion { Id = 6, CursoId = 3, EstudianteId = 6 }
            );

            modelBuilder.Entity<PeriodoAcademico>().HasData(
                new PeriodoAcademico { Id = 1, Nombre = "Periodo 1", Orden = 1, FechaInicio = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), FechaFin = new DateTime(2025, 3, 31, 23, 59, 59, DateTimeKind.Utc), Activo = true },
                new PeriodoAcademico { Id = 2, Nombre = "Periodo 2", Orden = 2, FechaInicio = new DateTime(2025, 4, 1, 0, 0, 0, DateTimeKind.Utc), FechaFin = new DateTime(2025, 6, 30, 23, 59, 59, DateTimeKind.Utc), Activo = false },
                new PeriodoAcademico { Id = 3, Nombre = "Periodo 3", Orden = 3, FechaInicio = new DateTime(2025, 7, 1, 0, 0, 0, DateTimeKind.Utc), FechaFin = new DateTime(2025, 9, 30, 23, 59, 59, DateTimeKind.Utc), Activo = false },
                new PeriodoAcademico { Id = 4, Nombre = "Periodo 4", Orden = 4, FechaInicio = new DateTime(2025, 10, 1, 0, 0, 0, DateTimeKind.Utc), FechaFin = new DateTime(2025, 12, 31, 23, 59, 59, DateTimeKind.Utc), Activo = false }
            );

            modelBuilder.Entity<NotaConfig>().HasData(
                new NotaConfig { Id = 1, CursoId = 1, Nombre = "Proyecto STEAM", Orden = 1, Peso = 50m, PeriodoAcademicoId = 1 },
                new NotaConfig { Id = 2, CursoId = 1, Nombre = "Evaluación integral", Orden = 2, Peso = 50m, PeriodoAcademicoId = 1 },
                new NotaConfig { Id = 3, CursoId = 2, Nombre = "Laboratorio de ciencias", Orden = 1, Peso = 40m, PeriodoAcademicoId = 1 },
                new NotaConfig { Id = 4, CursoId = 2, Nombre = "Examen bimestral", Orden = 2, Peso = 60m, PeriodoAcademicoId = 1 },
                new NotaConfig { Id = 5, CursoId = 3, Nombre = "Ensayo crítico", Orden = 1, Peso = 40m, PeriodoAcademicoId = 1 },
                new NotaConfig { Id = 6, CursoId = 3, Nombre = "Examen final", Orden = 2, Peso = 60m, PeriodoAcademicoId = 1 }
            );

            modelBuilder.Entity<Nota>().HasData(
                new Nota { Id = 1, EstudianteId = 1, NotaConfigId = 1, Valor = 4.5m },
                new Nota { Id = 2, EstudianteId = 1, NotaConfigId = 2, Valor = 4.2m },
                new Nota { Id = 3, EstudianteId = 4, NotaConfigId = 1, Valor = 3.8m },
                new Nota { Id = 4, EstudianteId = 4, NotaConfigId = 2, Valor = 3.5m },
                new Nota { Id = 5, EstudianteId = 2, NotaConfigId = 3, Valor = 4.0m },
                new Nota { Id = 6, EstudianteId = 2, NotaConfigId = 4, Valor = 4.6m },
                new Nota { Id = 7, EstudianteId = 5, NotaConfigId = 3, Valor = 3.2m },
                new Nota { Id = 8, EstudianteId = 5, NotaConfigId = 4, Valor = 3.4m },
                new Nota { Id = 9, EstudianteId = 3, NotaConfigId = 5, Valor = 4.8m },
                new Nota { Id = 10, EstudianteId = 3, NotaConfigId = 6, Valor = 4.4m },
                new Nota { Id = 11, EstudianteId = 6, NotaConfigId = 5, Valor = 3.9m },
                new Nota { Id = 12, EstudianteId = 6, NotaConfigId = 6, Valor = 3.6m }
            );

            modelBuilder.Entity<Asistencia>().HasData(
                new Asistencia { Id = 1, EstudianteId = 1, CursoAsignaturaId = 1, Fecha = new DateTime(2025, 2, 3, 12, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Presente, Observacion = "Participó activamente" },
                new Asistencia { Id = 2, EstudianteId = 1, CursoAsignaturaId = 1, Fecha = new DateTime(2025, 2, 4, 12, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Presente, Observacion = string.Empty },
                new Asistencia { Id = 3, EstudianteId = 1, CursoAsignaturaId = 1, Fecha = new DateTime(2025, 2, 5, 12, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Tardanza, Observacion = "Llegó 10 min tarde" },
                new Asistencia { Id = 4, EstudianteId = 4, CursoAsignaturaId = 1, Fecha = new DateTime(2025, 2, 3, 12, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Presente, Observacion = string.Empty },
                new Asistencia { Id = 5, EstudianteId = 4, CursoAsignaturaId = 1, Fecha = new DateTime(2025, 2, 4, 12, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Ausente, Observacion = "Justificada por cita médica" },
                new Asistencia { Id = 6, EstudianteId = 4, CursoAsignaturaId = 1, Fecha = new DateTime(2025, 2, 5, 12, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Presente, Observacion = string.Empty },
                new Asistencia { Id = 7, EstudianteId = 2, CursoAsignaturaId = 3, Fecha = new DateTime(2025, 2, 3, 15, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Presente, Observacion = string.Empty },
                new Asistencia { Id = 8, EstudianteId = 2, CursoAsignaturaId = 3, Fecha = new DateTime(2025, 2, 4, 15, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Presente, Observacion = "Dirigió laboratorio" },
                new Asistencia { Id = 9, EstudianteId = 5, CursoAsignaturaId = 3, Fecha = new DateTime(2025, 2, 3, 15, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Presente, Observacion = string.Empty },
                new Asistencia { Id = 10, EstudianteId = 5, CursoAsignaturaId = 3, Fecha = new DateTime(2025, 2, 4, 15, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Ausente, Observacion = "No entregó excusa" },
                new Asistencia { Id = 11, EstudianteId = 3, CursoAsignaturaId = 5, Fecha = new DateTime(2025, 2, 3, 17, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Presente, Observacion = "Exposición sobresaliente" },
                new Asistencia { Id = 12, EstudianteId = 3, CursoAsignaturaId = 5, Fecha = new DateTime(2025, 2, 4, 17, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Presente, Observacion = string.Empty },
                new Asistencia { Id = 13, EstudianteId = 6, CursoAsignaturaId = 5, Fecha = new DateTime(2025, 2, 3, 17, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Tardanza, Observacion = "Ingreso tarde por transporte" },
                new Asistencia { Id = 14, EstudianteId = 6, CursoAsignaturaId = 5, Fecha = new DateTime(2025, 2, 4, 17, 0, 0, DateTimeKind.Utc), Estado = AsistenciaEstado.Presente, Observacion = string.Empty }
            );

            modelBuilder.Entity<Notificacion>().HasData(
                new Notificacion
                {
                    Id = 1,
                    ProfesorId = 1,
                    CursoAsignaturaId = 1,
                    Titulo = "Entrega de proyecto STEAM",
                    Mensaje = "Recuerden cargar la presentación antes del viernes.",
                    Tipo = "evaluacion",
                    FechaEnvio = new DateTime(2025, 2, 2, 13, 0, 0, DateTimeKind.Utc),
                    Leida = false
                },
                new Notificacion
                {
                    Id = 2,
                    ProfesorId = 3,
                    CursoAsignaturaId = 5,
                    EstudianteId = 3,
                    Titulo = "Reconocimiento",
                    Mensaje = "Excelente liderazgo en la exposición final.",
                    Tipo = "reconocimiento",
                    FechaEnvio = new DateTime(2025, 2, 5, 18, 0, 0, DateTimeKind.Utc),
                    Leida = true
                }
            );

            modelBuilder.Entity<Observacion>().HasData(
                new Observacion
                {
                    Id = 1,
                    ProfesorId = 2,
                    EstudianteId = 5,
                    CursoAsignaturaId = 3,
                    Tipo = "seguimiento",
                    Comentario = "Requiere refuerzo en registro de laboratorio",
                    Fecha = new DateTime(2025, 2, 6, 14, 30, 0, DateTimeKind.Utc)
                },
                new Observacion
                {
                    Id = 2,
                    ProfesorId = 1,
                    EstudianteId = 1,
                    CursoAsignaturaId = 1,
                    Tipo = "reconocimiento",
                    Comentario = "Lideró al equipo durante el reto de robótica",
                    Fecha = new DateTime(2025, 2, 7, 10, 0, 0, DateTimeKind.Utc)
                }
            );

        }
    }
}
