using edutrack_academy_api.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Linq;

namespace edutrack_academy_api.Services
{
    public record NotificationPayload(string Type, string Title, string Message, object? Data, DateTime Timestamp);

    public interface INotificationDispatcher
    {
        Task SendToStudentsAsync(IEnumerable<int> studentIds, NotificationPayload payload, CancellationToken cancellationToken = default);
        Task SendToTutorsAsync(IEnumerable<int> tutorIds, NotificationPayload payload, CancellationToken cancellationToken = default);
        Task SendToCoursesAsync(IEnumerable<int> courseIds, NotificationPayload payload, CancellationToken cancellationToken = default);
    }

    public class NotificationDispatcher : INotificationDispatcher
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationDispatcher(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public Task SendToStudentsAsync(IEnumerable<int> studentIds, NotificationPayload payload, CancellationToken cancellationToken = default)
        {
            var groups = studentIds
                .Where(id => id > 0)
                .Select(id => $"student-{id}")
                .Distinct()
                .ToArray();

            if (groups.Length == 0)
            {
                return Task.CompletedTask;
            }

            return _hubContext.Clients.Groups(groups).SendAsync("notification", payload, cancellationToken);
        }

        public Task SendToTutorsAsync(IEnumerable<int> tutorIds, NotificationPayload payload, CancellationToken cancellationToken = default)
        {
            var groups = tutorIds
                .Where(id => id > 0)
                .Select(id => $"tutor-{id}")
                .Distinct()
                .ToArray();

            if (groups.Length == 0)
            {
                return Task.CompletedTask;
            }

            return _hubContext.Clients.Groups(groups).SendAsync("notification", payload, cancellationToken);
        }

        public Task SendToCoursesAsync(IEnumerable<int> courseIds, NotificationPayload payload, CancellationToken cancellationToken = default)
        {
            var groups = courseIds
                .Where(id => id > 0)
                .Select(id => $"course-{id}")
                .Distinct()
                .ToArray();

            if (groups.Length == 0)
            {
                return Task.CompletedTask;
            }

            return _hubContext.Clients.Groups(groups).SendAsync("notification", payload, cancellationToken);
        }
    }
}
