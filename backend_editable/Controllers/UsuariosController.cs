using edutrack_academy_api.Models;
using edutrack_academy_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize(Roles = "admin")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioResponseDTO>>> GetDocentes()
        {
            var lista = await _usuarioService.ListarDocentesAsync();
            return Ok(lista);
        }

        // POST: api/Usuarios
        [HttpPost]
        public async Task<IActionResult> RegistrarDocente(RegistroUsuarioDTO dto)
        {
            dto.Rol = "docente";
            var usuario = await _usuarioService.RegistrarAsync(dto);
            return Ok(new
            {
                usuario.Id,
                usuario.User,
                usuario.Nombre,
                usuario.Apellido,
                usuario.Email,
                usuario.Rol
            });
        }

        // POST: api/Usuarios/crear-admin
        [HttpPost("crear-admin")]
        public async Task<IActionResult> RegistrarAdmin(RegistroUsuarioDTO dto)
        {
            dto.Rol = "admin";
            var usuario = await _usuarioService.RegistrarAsync(dto);
            return Ok(new
            {
                usuario.Id,
                usuario.User,
                usuario.Nombre,
                usuario.Apellido,
                usuario.Email,
                usuario.Rol
            });
        }

        // PUT: api/Usuarios/5
        // Actualizar datos de un usuario (docente o admin)
        [HttpPut("{id:int}")]
        public async Task<IActionResult> ActualizarUsuario(int id, [FromBody] ActualizarUsuarioDTO dto)
        {
            if (id <= 0)
                return BadRequest("Id inválido");

            var actualizado = await _usuarioService.ActualizarAsync(id, dto);
            if (actualizado == null)
                return NotFound("Usuario no encontrado");

            return Ok(new
            {
                actualizado.Id,
                actualizado.User,
                actualizado.Nombre,
                actualizado.Apellido,
                actualizado.Email,
                actualizado.Rol
            });
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> EliminarUsuario(int id)
        {
            if (id <= 0)
                return BadRequest("Id inválido");

            var eliminado = await _usuarioService.EliminarAsync(id);
            if (!eliminado)
                return NotFound("Usuario no encontrado");

            return NoContent();
        }
    }
}
