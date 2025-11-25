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
        public DbSet<DocenteAsignatura> DocenteAsignaturas { get; set; }
        public DbSet<DocenteGradoGrupo> DocenteGradoGrupos { get; set; }
        public DbSet<TutorEstudiante> TutorEstudiantes { get; set; }
        public DbSet<Asistencia> Asistencias { get; set; }
        public DbSet<Comunicacion> Comunicaciones { get; set; }
        public DbSet<ComunicacionDestino> ComunicacionDestinos { get; set; }

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

            modelBuilder.Entity<Estudiante>()
                .HasOne(e => e.Grado)
                .WithMany()
                .HasForeignKey(e => e.GradoId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Estudiante>()
                .HasOne(e => e.Usuario)
                .WithMany()
                .HasForeignKey(e => e.UsuarioId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Estudiante>()
                .Property(e => e.Grupo)
                .HasMaxLength(50);

            // Grado Codigo y Grupos
            modelBuilder.Entity<Grado>()
                .Property(g => g.Codigo)
                .HasMaxLength(50);

            modelBuilder.Entity<Grado>()
                .Property(g => g.Grupos)
                .HasMaxLength(500);

            modelBuilder.Entity<DocenteAsignatura>()
                .HasOne(da => da.Docente)
                .WithMany(u => u.DocenteAsignaturas)
                .HasForeignKey(da => da.DocenteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DocenteAsignatura>()
                .HasOne(da => da.Asignatura)
                .WithMany()
                .HasForeignKey(da => da.AsignaturaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DocenteAsignatura>()
                .HasIndex(da => new { da.DocenteId, da.AsignaturaId })
                .IsUnique();

            modelBuilder.Entity<DocenteGradoGrupo>()
                .Property(dg => dg.Grupo)
                .HasMaxLength(50);

            modelBuilder.Entity<DocenteGradoGrupo>()
                .HasOne(dg => dg.Docente)
                .WithMany(u => u.DocenteGradoGrupos)
                .HasForeignKey(dg => dg.DocenteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DocenteGradoGrupo>()
                .HasOne(dg => dg.Grado)
                .WithMany()
                .HasForeignKey(dg => dg.GradoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DocenteGradoGrupo>()
                .HasIndex(dg => new { dg.DocenteId, dg.GradoId, dg.Grupo })
                .IsUnique();

            modelBuilder.Entity<TutorEstudiante>()
                .HasIndex(te => new { te.TutorId, te.EstudianteId })
                .IsUnique();

            modelBuilder.Entity<TutorEstudiante>()
                .Property(te => te.Relacion)
                .HasMaxLength(50);

            modelBuilder.Entity<TutorEstudiante>()
                .HasOne(te => te.Tutor)
                .WithMany(u => u.TutorEstudiantes)
                .HasForeignKey(te => te.TutorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TutorEstudiante>()
                .HasOne(te => te.Estudiante)
                .WithMany(e => e.Tutores)
                .HasForeignKey(te => te.EstudianteId)
                .OnDelete(DeleteBehavior.Cascade);

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

            modelBuilder.Entity<Asistencia>()
                .HasIndex(a => new { a.CursoId, a.AsignaturaId, a.EstudianteId, a.Fecha, a.Periodo })
                .IsUnique();

            modelBuilder.Entity<Asistencia>()
                .Property(a => a.Estado)
                .HasMaxLength(20);

            modelBuilder.Entity<Asistencia>()
                .Property(a => a.Observacion)
                .HasMaxLength(500);

            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.Curso)
                .WithMany()
                .HasForeignKey(a => a.CursoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.Asignatura)
                .WithMany()
                .HasForeignKey(a => a.AsignaturaId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.Estudiante)
                .WithMany()
                .HasForeignKey(a => a.EstudianteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.RegistradoPor)
                .WithMany(u => u.AsistenciasRegistradas)
                .HasForeignKey(a => a.RegistradoPorId)
                .OnDelete(DeleteBehavior.Restrict);

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

            modelBuilder.Entity<Comunicacion>()
                .Property(c => c.Titulo)
                .HasMaxLength(200);

            modelBuilder.Entity<Comunicacion>()
                .Property(c => c.Tipo)
                .HasMaxLength(40);

            modelBuilder.Entity<Comunicacion>()
                .HasOne(c => c.Remitente)
                .WithMany(u => u.ComunicacionesEmitidas)
                .HasForeignKey(c => c.RemitenteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comunicacion>()
                .HasOne(c => c.Curso)
                .WithMany()
                .HasForeignKey(c => c.CursoId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ComunicacionDestino>()
                .Property(cd => cd.Canal)
                .HasMaxLength(30);

            modelBuilder.Entity<ComunicacionDestino>()
                .HasOne(cd => cd.Comunicacion)
                .WithMany(c => c.Destinatarios)
                .HasForeignKey(cd => cd.ComunicacionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ComunicacionDestino>()
                .HasOne(cd => cd.Estudiante)
                .WithMany(e => e.ComunicacionesRecibidas)
                .HasForeignKey(cd => cd.EstudianteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ComunicacionDestino>()
                .HasOne(cd => cd.Tutor)
                .WithMany(u => u.ComunicacionesRecibidas)
                .HasForeignKey(cd => cd.TutorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
