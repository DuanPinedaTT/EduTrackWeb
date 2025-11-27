using System.Collections.Generic;
using System.Security.Claims;
using edutrack_academy_api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        private readonly AppDbContext _context;

        public NotificationHub(AppDbContext context)
        {
            _context = context;
        }

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
