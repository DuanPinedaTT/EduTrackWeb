using System;
using System.Collections.Generic;

namespace edutrack_academy_api.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string User { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Rol { get; set; } = null!; // "admin" | "docente"
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        public ICollection<Curso> CursosAsignados { get; set; } = new List<Curso>();
        public ICollection<DocenteAsignatura> DocenteAsignaturas { get; set; } = new List<DocenteAsignatura>();
        public ICollection<DocenteGradoGrupo> DocenteGradoGrupos { get; set; } = new List<DocenteGradoGrupo>();
    }

    public class RegistroUsuarioDTO
    {
        public string User { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Rol { get; set; } = "docente"; // por defecto docente
        public List<int> Asignaturas { get; set; } = new();
        public List<DocenteGrupoRequestDTO> Asignaciones { get; set; } = new();
    }

    public class LoginDTO
    {
        public string User { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class UsuarioResponseDTO
    {
        public int Id { get; set; }
        public string User { get; set; } = null!;
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Rol { get; set; } = null!;
        public IEnumerable<DocenteAsignaturaResponseDTO> Asignaturas { get; set; } = new List<DocenteAsignaturaResponseDTO>();
        public IEnumerable<DocenteGrupoResponseDTO> Asignaciones { get; set; } = new List<DocenteGrupoResponseDTO>();
    }
}
