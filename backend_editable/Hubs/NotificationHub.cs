using System.Collections.Generic;
using System.Security.Claims;
using edutrack_academy_api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Hubs
{
    [Authorize]
    // Centraliza las conexiones SignalR y asigna a cada cliente los grupos necesarios para notificaciones dirigidas.
    public class NotificationHub : Hub
    {
        private readonly AppDbContext _context;

        public NotificationHub(AppDbContext context)
        {
            _context = context;
        }

        // Cada vez que un cliente se conecta se le agrega a grupos como user-*, student-* o course-* según su rol.
        public override async Task OnConnectedAsync()
        {
            var userIdClaim = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = Context.User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

            if (!int.TryParse(userIdClaim, out var userId))
            {
                await base.OnConnectedAsync();
                return;
            }

            var groupTasks = new List<Task>
            {
                Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}")
            };

            if (string.Equals(role, "estudiante", StringComparison.OrdinalIgnoreCase))
            {
                // Los estudiantes reciben notificaciones por usuario, por estudiante y por cada curso relacionado.
                var data = await _context.Estudiantes
                    .Where(e => e.UsuarioId == userId)
                    .Select(e => new
                    {
                        e.Id,
                        Cursos = e.Inscripciones.Select(i => i.CursoId)
                    })
                    .FirstOrDefaultAsync();

                if (data != null)
                {
                    groupTasks.Add(Groups.AddToGroupAsync(Context.ConnectionId, $"student-{data.Id}"));
                    foreach (var cursoId in data.Cursos.Distinct())
                    {
                        groupTasks.Add(Groups.AddToGroupAsync(Context.ConnectionId, $"course-{cursoId}"));
                    }
                }
            }

            if (string.Equals(role, "tutor", StringComparison.OrdinalIgnoreCase))
            {
                // Los tutores quedan suscritos a eventos de sus estudiantes y cursos para replicar avisos.
                groupTasks.Add(Groups.AddToGroupAsync(Context.ConnectionId, $"tutor-{userId}"));

                var cursoIds = await _context.TutorEstudiantes
                    .Where(te => te.TutorId == userId)
                    .SelectMany(te => te.Estudiante.Inscripciones.Select(i => i.CursoId))
                    .Distinct()
                    .ToListAsync();

                foreach (var cursoId in cursoIds)
                {
                    groupTasks.Add(Groups.AddToGroupAsync(Context.ConnectionId, $"course-{cursoId}"));
                }
            }

            await Task.WhenAll(groupTasks);
            await base.OnConnectedAsync();
        }
    }
}
