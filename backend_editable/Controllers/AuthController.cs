using edutrack_academy_api.JWT;
using edutrack_academy_api.Models;
using edutrack_academy_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace edutrack_academy_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;
        private readonly JwtTokenGenerator _jwt;

        public AuthController(IUsuarioService usuarioService, JwtTokenGenerator jwt)
        {
            _usuarioService = usuarioService;
            _jwt = jwt;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var usuario = await _usuarioService.LoginAsync(dto.User, dto.Password);
            if (usuario == null)
                return BadRequest("Credenciales inválidas");

            var token = _jwt.GenerarToken(usuario.User, usuario.Rol, usuario.Id);

            var userDto = new UsuarioResponseDTO
            {
                Id = usuario.Id,
                User = usuario.User,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Email = usuario.Email,
                Rol = usuario.Rol
            };

            return Ok(new { token, user = userDto });
        }
    }
}
