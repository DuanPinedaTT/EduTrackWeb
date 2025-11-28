using System.Globalization;
using System.Linq;
using System.Text;
using edutrack_academy_api.Data;
using edutrack_academy_api.Models;
using Microsoft.EntityFrameworkCore;

namespace edutrack_academy_api.Services
{
	public class DemoDataSeeder
	{
		private readonly AppDbContext _context;
		private readonly ILogger<DemoDataSeeder> _logger;
		private readonly Random _random = new(11282025);
		private readonly Dictionary<string, int> _docUserCounters = new(StringComparer.OrdinalIgnoreCase);
		private readonly Dictionary<string, int> _studentUserCounters = new(StringComparer.OrdinalIgnoreCase);
		private readonly Dictionary<string, int> _tutorUserCounters = new(StringComparer.OrdinalIgnoreCase);
		private int _documentSequence = 10200000;
		private StudentBundle? _lowMathTarget;
		private StudentBundle? _highlightStudent;

		private static readonly GradeSpec[] GradeSpecs =
		{
			new("SEXTO", "6", new[] { "A", "B", "C" }),
			new("SEPTIMO", "7", new[] { "A", "B", "C" }),
			new("OCTAVO", "8", new[] { "A", "B" }),
			new("NOVENO", "9", new[] { "A", "B" }),
			new("DECIMO", "10", new[] { "A", "B" }),
			new("UNDECIMO", "11", new[] { "A", "B" })
		};

		private static readonly SubjectSpec[] SubjectSpecs =
		{
			new("Matemáticas", "MAT"),
			new("Español", "ESP"),
			new("Inglés", "ING"),
			new("Sociales", "SOC")
		};

		private static readonly DocenteBlueprint[] DocenteBlueprints =
		{
			new("Lucia", "Rios", "MAT", "lower"),
			new("Jorge", "Salazar", "MAT", "upper"),
			new("Paula", "Gonzalez", "ESP", "lower"),
			new("Luis", "Camacho", "ESP", "upper"),
			new("Sofia", "Renteria", "ING", "lower"),
			new("Miguel", "Herrera", "ING", "upper"),
			new("Daniela", "Lopez", "SOC", "lower"),
			new("Andres", "Vargas", "SOC", "upper")
		};

		private readonly string[] _studentFirstNames =
		{
			"Juan", "Valeria", "Mateo", "Sara", "Leonardo", "Juliana", "Santiago", "Paula", "Samuel", "Laura",
			"Camila", "Andres", "Isabela", "Felipe", "Gabriela", "Martin", "Daniel", "Ana", "Jose", "Luciana"
		};

		private readonly string[] _studentLastNames =
		{
			"Gómez", "Rodríguez", "Martínez", "López", "Hernández", "Ramírez", "Torres", "Castaño", "Vargas", "Mora",
			"Pineda", "Serrano", "Rojas", "Figueroa", "Sandoval"
		};

		public DemoDataSeeder(AppDbContext context, ILogger<DemoDataSeeder> logger)
		{
			_context = context;
			_logger = logger;
		}

		public async Task SeedAsync(bool force = false, CancellationToken ct = default)
		{
			if (!force && await _context.Cursos.AnyAsync(ct))
			{
				_logger.LogInformation("Ya existen cursos registrados, se omite el seed demo.");
				return;
			}

			var adminUser = await _context.Usuarios.FirstOrDefaultAsync(u => u.Rol == "admin", ct);
			var adminIds = adminUser != null ? new[] { adminUser.Id } : Array.Empty<int>();

			await ClearExistingDataAsync(adminIds, ct);

			var asignaturas = await CreateAsignaturasAsync(ct);
			var gradoBundles = await CreateGradosAndCursosAsync(ct);
			var docentes = await CreateDocentesAsync(asignaturas, ct);
			var courseBundles = await AssignSubjectsAsync(gradoBundles, asignaturas, docentes, ct);
			await CreateStudentsAndTutorsAsync(courseBundles, ct);
			await CreateNotaConfigsAndNotasAsync(courseBundles, ct);
			await CreateAsistenciasAsync(courseBundles, docentes, ct);
			await CreateComunicacionesAsync(adminUser ?? docentes.All.First().Usuario, docentes, courseBundles, ct);

			_logger.LogInformation("Datos demo generados correctamente.");
		}

		private async Task ClearExistingDataAsync(IEnumerable<int> adminIds, CancellationToken ct)
		{
			_context.ComunicacionDestinos.RemoveRange(_context.ComunicacionDestinos);
			_context.Comunicaciones.RemoveRange(_context.Comunicaciones);
			_context.Asistencias.RemoveRange(_context.Asistencias);
			_context.Notas.RemoveRange(_context.Notas);
			_context.NotaConfigs.RemoveRange(_context.NotaConfigs);
			_context.Inscripciones.RemoveRange(_context.Inscripciones);
			_context.TutorEstudiantes.RemoveRange(_context.TutorEstudiantes);
			_context.CursoAsignaturas.RemoveRange(_context.CursoAsignaturas);
			_context.DocenteAsignaturas.RemoveRange(_context.DocenteAsignaturas);
			_context.DocenteGradoGrupos.RemoveRange(_context.DocenteGradoGrupos);
			_context.Estudiantes.RemoveRange(_context.Estudiantes);
			_context.Cursos.RemoveRange(_context.Cursos);
			_context.Grados.RemoveRange(_context.Grados);
			_context.Asignaturas.RemoveRange(_context.Asignaturas);
			await _context.SaveChangesAsync(ct);

			var adminSet = new HashSet<int>(adminIds);
			var nonAdminUsers = await _context.Usuarios
				.Where(u => !adminSet.Contains(u.Id))
				.ToListAsync(ct);
			_context.Usuarios.RemoveRange(nonAdminUsers);
			await _context.SaveChangesAsync(ct);
		}

		private async Task<Dictionary<string, Asignatura>> CreateAsignaturasAsync(CancellationToken ct)
		{
			var map = new Dictionary<string, Asignatura>(StringComparer.OrdinalIgnoreCase);
			foreach (var spec in SubjectSpecs)
			{
				var asignatura = new Asignatura
				{
					Nombre = spec.Nombre,
					Codigo = spec.Codigo
				};
				_context.Asignaturas.Add(asignatura);
				map[spec.Codigo] = asignatura;
			}

			await _context.SaveChangesAsync(ct);
			return map;
		}

		private async Task<List<GradoBundle>> CreateGradosAndCursosAsync(CancellationToken ct)
		{
			var result = new List<GradoBundle>();

			foreach (var spec in GradeSpecs)
			{
				var grado = new Grado
				{
					Nombre = spec.Nombre,
					Codigo = spec.Codigo,
					Grupos = string.Join(',', spec.Grupos)
				};
				_context.Grados.Add(grado);
				await _context.SaveChangesAsync(ct);

				var cursos = new List<Curso>();
				foreach (var grupo in spec.Grupos)
				{
					var curso = new Curso
					{
						Nombre = $"{ToTitle(spec.Nombre)} {grupo}",
						Grupo = grupo,
						GradoId = grado.Id
					};
					cursos.Add(curso);
					_context.Cursos.Add(curso);
				}

				await _context.SaveChangesAsync(ct);
				result.Add(new GradoBundle(grado, cursos));
			}

			return result;
		}

		private async Task<DocenteSeedResult> CreateDocentesAsync(Dictionary<string, Asignatura> asignaturas, CancellationToken ct)
		{
			var records = new List<DocenteRecord>();
			foreach (var blueprint in DocenteBlueprints)
			{
				var username = GenerateUsername("doc.", blueprint.FirstName, _docUserCounters);
				var password = $"{blueprint.FirstName}123";
				var usuario = new Usuario
				{
					User = username,
					PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
					Nombre = blueprint.FirstName,
					Apellido = blueprint.LastName,
					Email = $"{username}@edutrack.com",
					Rol = "docente"
				};
				_context.Usuarios.Add(usuario);
				records.Add(new DocenteRecord(blueprint, usuario, asignaturas[blueprint.SubjectCode]));
			}

			await _context.SaveChangesAsync(ct);

			foreach (var record in records)
			{
				_context.DocenteAsignaturas.Add(new DocenteAsignatura
				{
					DocenteId = record.Usuario.Id,
					AsignaturaId = record.Asignatura.Id
				});
			}

			await _context.SaveChangesAsync(ct);

			var map = new Dictionary<string, DocenteRecord>(StringComparer.OrdinalIgnoreCase);
			foreach (var record in records)
			{
				map[BuildDocenteKey(record.Asignatura.Codigo, record.Blueprint.Tier)] = record;
			}

			return new DocenteSeedResult(map, records);
		}

		private async Task<List<CourseBundle>> AssignSubjectsAsync(
			List<GradoBundle> grados,
			Dictionary<string, Asignatura> asignaturas,
			DocenteSeedResult docentes,
			CancellationToken ct)
		{
			var bundles = new List<CourseBundle>();

			foreach (var grado in grados)
			{
				var tier = GetTier(grado.Grado.Nombre);
				foreach (var curso in grado.Cursos)
				{
					var dict = new Dictionary<string, CursoAsignatura>(StringComparer.OrdinalIgnoreCase);
					foreach (var subject in asignaturas.Values)
					{
						var docente = docentes.Get(subject.Codigo, tier);
						var cursoAsignatura = new CursoAsignatura
						{
							CursoId = curso.Id,
							AsignaturaId = subject.Id,
							DocenteId = docente.Usuario.Id
						};
						dict[subject.Codigo] = cursoAsignatura;
						_context.CursoAsignaturas.Add(cursoAsignatura);
					}

					curso.DocenteId = dict["ESP"].DocenteId;
					bundles.Add(new CourseBundle(curso, grado.Grado, dict));
				}
			}

			await _context.SaveChangesAsync(ct);
			return bundles;
		}

		private async Task CreateStudentsAndTutorsAsync(List<CourseBundle> bundles, CancellationToken ct)
		{
			foreach (var bundle in bundles)
			{
				var targetCount = _random.Next(10, 16);
				for (var i = 0; i < targetCount; i++)
				{
					var firstName = _studentFirstNames[_random.Next(_studentFirstNames.Length)];
					var lastName = _studentLastNames[_random.Next(_studentLastNames.Length)];

					var studentUsername = GenerateUsername("est.", firstName, _studentUserCounters);
					var studentUser = new Usuario
					{
						User = studentUsername,
						PasswordHash = BCrypt.Net.BCrypt.HashPassword($"{firstName}123"),
						Nombre = firstName,
						Apellido = lastName,
						Email = $"{studentUsername}@edutrack.com",
						Rol = "estudiante"
					};
					_context.Usuarios.Add(studentUser);

					var estudiante = new Estudiante
					{
						Nombre = $"{firstName} {lastName}",
						Documento = GenerateDocument(),
						GradoId = bundle.Grado.Id,
						Grupo = bundle.Curso.Grupo,
						Usuario = studentUser
					};
					_context.Estudiantes.Add(estudiante);

					_context.Inscripciones.Add(new Inscripcion
					{
						CursoId = bundle.Curso.Id,
						Estudiante = estudiante
					});

					var tutorUsername = GenerateUsername("ac.", firstName, _tutorUserCounters);
					var tutorUser = new Usuario
					{
						User = tutorUsername,
						PasswordHash = BCrypt.Net.BCrypt.HashPassword($"{firstName}Fam123"),
						Nombre = $"Acudiente de {firstName}",
						Apellido = lastName,
						Email = $"{tutorUsername}@edutrack.com",
						Rol = "tutor"
					};
					_context.Usuarios.Add(tutorUser);

					_context.TutorEstudiantes.Add(new TutorEstudiante
					{
						Tutor = tutorUser,
						Estudiante = estudiante,
						Relacion = "Acudiente",
						EsPrincipal = true
					});

					var studentBundle = new StudentBundle(estudiante, studentUser, tutorUser, bundle.Curso, bundle.Grado, firstName);
					bundle.Students.Add(studentBundle);

					_lowMathTarget ??= studentBundle;
					if (_highlightStudent == null && string.Equals(bundle.Grado.Nombre, "UNDECIMO", StringComparison.OrdinalIgnoreCase))
					{
						_highlightStudent = studentBundle;
					}
				}
			}

			await _context.SaveChangesAsync(ct);
		}

		private async Task CreateNotaConfigsAndNotasAsync(List<CourseBundle> bundles, CancellationToken ct)
		{
			var configs = new List<NotaConfig>();
			foreach (var bundle in bundles)
			{
				foreach (var (subjectCode, cursoAsignatura) in bundle.Asignaturas)
				{
					var isMath = subjectCode.Equals("MAT", StringComparison.OrdinalIgnoreCase);
					for (var periodo = 1; periodo <= 4; periodo++)
					{
						var order = periodo * 10;
						foreach (var column in BuildColumnSpecs(isMath))
						{
							var config = new NotaConfig
							{
								CursoId = bundle.Curso.Id,
								CursoAsignaturaId = cursoAsignatura.Id,
								Nombre = $"{column.Name} P{periodo}",
								Orden = order++,
								Peso = column.Weight,
								Periodo = periodo
							};
							configs.Add(config);
							_context.NotaConfigs.Add(config);
						}
					}
				}
			}

			await _context.SaveChangesAsync(ct);

			foreach (var bundle in bundles)
			{
				foreach (var (subjectCode, cursoAsignatura) in bundle.Asignaturas)
				{
					var configsPerSubject = configs.Where(c => c.CursoAsignaturaId == cursoAsignatura.Id).ToList();
					foreach (var config in configsPerSubject)
					{
						foreach (var student in bundle.Students)
						{
							var value = GenerateScore(subjectCode, student, config.Periodo);
							_context.Notas.Add(new Nota
							{
								EstudianteId = student.Estudiante.Id,
								NotaConfigId = config.Id,
								CursoAsignaturaId = cursoAsignatura.Id,
								Valor = value
							});
						}
					}
				}
			}

			await _context.SaveChangesAsync(ct);
		}

		private async Task CreateAsistenciasAsync(List<CourseBundle> bundles, DocenteSeedResult docentes, CancellationToken ct)
		{
			var today = DateTime.UtcNow.Date;

			foreach (var bundle in bundles)
			{
				var tier = GetTier(bundle.Grado.Nombre);
				foreach (var (subjectCode, cursoAsignatura) in bundle.Asignaturas)
				{
					var docente = docentes.Get(subjectCode, tier).Usuario;
					for (var session = 0; session < 2; session++)
					{
						var fecha = today.AddDays(-_random.Next(5, 35));
						var periodo = (session % 4) + 1;
						foreach (var student in bundle.Students)
						{
							var absenceChance = subjectCode.Equals("MAT", StringComparison.OrdinalIgnoreCase) ? 0.15 : 0.08;
							var isAbsent = _random.NextDouble() < absenceChance;

							_context.Asistencias.Add(new Asistencia
							{
								CursoId = bundle.Curso.Id,
								EstudianteId = student.Estudiante.Id,
								AsignaturaId = cursoAsignatura.AsignaturaId,
								Fecha = fecha,
								Periodo = periodo,
								Estado = isAbsent ? "Ausente" : "Presente",
								Observacion = isAbsent ? "Generada por control académico." : null,
								RegistradoPorId = docente.Id,
								CreadoEn = fecha.AddHours(8)
							});
						}
					}
				}
			}

			await _context.SaveChangesAsync(ct);
		}

		private async Task CreateComunicacionesAsync(Usuario remitenteBase, DocenteSeedResult docentes, List<CourseBundle> bundles, CancellationToken ct)
		{
			var allStudents = bundles.SelectMany(b => b.Students).ToList();

			var general = new Comunicacion
			{
				Titulo = "Felices fiestas",
				Mensaje = "Feliz navidad a toda la comunidad EduTrack. Gracias por acompañarnos este año escolar.",
				Tipo = "general",
				CreadaEn = DateTime.UtcNow.AddDays(-10),
				RemitenteId = remitenteBase.Id
			};

			foreach (var student in allStudents)
			{
				general.Destinatarios.Add(new ComunicacionDestino { EstudianteId = student.Estudiante.Id });
				general.Destinatarios.Add(new ComunicacionDestino { TutorId = student.Tutor.Id });
			}

			_context.Comunicaciones.Add(general);

			if (_lowMathTarget != null)
			{
				var tier = GetTier(_lowMathTarget.Grado.Nombre);
				var mathDoc = docentes.Get("MAT", tier).Usuario;

				var citacion = new Comunicacion
				{
					Titulo = "Citación académica - Matemáticas",
					Mensaje = $"{_lowMathTarget.Estudiante.Nombre} presenta bajo rendimiento en matemáticas. Los esperamos mañana a las 7:00 a.m. para revisión.",
					Tipo = "seguimiento",
					CreadaEn = DateTime.UtcNow.AddDays(-2),
					RemitenteId = mathDoc.Id,
					CursoId = _lowMathTarget.Curso.Id
				};

				citacion.Destinatarios.Add(new ComunicacionDestino { EstudianteId = _lowMathTarget.Estudiante.Id });
				citacion.Destinatarios.Add(new ComunicacionDestino { TutorId = _lowMathTarget.Tutor.Id });
				_context.Comunicaciones.Add(citacion);
			}

			if (_highlightStudent != null)
			{
				var espDoc = docentes.Get("ESP", "upper").Usuario;
				var reconocimiento = new Comunicacion
				{
					Titulo = "Reconocimiento a la excelencia",
					Mensaje = $"Felicitaciones {_highlightStudent.Estudiante.Nombre} por tu liderazgo en los talleres de literatura. Sigue así.",
					Tipo = "reconocimiento",
					CreadaEn = DateTime.UtcNow.AddDays(-5),
					RemitenteId = espDoc.Id,
					CursoId = _highlightStudent.Curso.Id
				};
				reconocimiento.Destinatarios.Add(new ComunicacionDestino { EstudianteId = _highlightStudent.Estudiante.Id });
				_context.Comunicaciones.Add(reconocimiento);
			}

			var socialesDoc = docentes.Get("SOC", "lower").Usuario;
			var salida = new Comunicacion
			{
				Titulo = "Salida pedagógica de Sociales",
				Mensaje = "Recordamos a sexto y séptimo que mañana visitaremos el museo de la ciudad. Traer autorización firmada.",
				Tipo = "general",
				CreadaEn = DateTime.UtcNow.AddDays(-1),
				RemitenteId = socialesDoc.Id
			};

			foreach (var bundle in bundles.Where(b => string.Equals(b.Grado.Nombre, "SEXTO", StringComparison.OrdinalIgnoreCase)
													   || string.Equals(b.Grado.Nombre, "SEPTIMO", StringComparison.OrdinalIgnoreCase)))
			{
				foreach (var student in bundle.Students)
				{
					salida.Destinatarios.Add(new ComunicacionDestino { EstudianteId = student.Estudiante.Id });
				}
			}

			_context.Comunicaciones.Add(salida);
			await _context.SaveChangesAsync(ct);
		}

		private IEnumerable<ColumnSpec> BuildColumnSpecs(bool isMath)
		{
			if (isMath)
			{
				return new[]
				{
					new ColumnSpec("Quiz", 25m),
					new ColumnSpec("Taller", 35m),
					new ColumnSpec("Expo", 40m)
				};
			}

			if (_random.Next(0, 2) == 0)
			{
				return new[] { new ColumnSpec("Taller", 100m) };
			}

			var split = _random.Next(40, 71);
			return new[]
			{
				new ColumnSpec("Quiz", split),
				new ColumnSpec("Expo", 100 - split)
			};
		}

		private decimal GenerateScore(string subjectCode, StudentBundle student, int periodo)
		{
			var isMath = subjectCode.Equals("MAT", StringComparison.OrdinalIgnoreCase);
			var isLow = _lowMathTarget != null && student.Estudiante.Id == _lowMathTarget.Estudiante.Id && isMath;

			double min = isMath ? 2.8 : 3.2;
			double max = 5.0;

			if (isLow)
			{
				min = 1.8;
				max = 2.9;
			}
			else if (periodo == 4 && !isMath)
			{
				min = 3.5;
			}

			var value = min + _random.NextDouble() * (max - min);
			return Math.Round((decimal)value, 2);
		}

		private static string GetTier(string gradoNombre)
		{
			var normalized = gradoNombre?.ToUpperInvariant() ?? string.Empty;
			return normalized is "SEXTO" or "SEPTIMO" or "OCTAVO" ? "lower" : "upper";
		}

		private string GenerateDocument()
		{
			_documentSequence++;
			return _documentSequence.ToString(CultureInfo.InvariantCulture);
		}

		private static string ToTitle(string value)
		{
			var lower = value.ToLowerInvariant();
			return CultureInfo.CurrentCulture.TextInfo.ToTitleCase(lower);
		}

		private string GenerateUsername(string prefix, string baseValue, Dictionary<string, int> counters)
		{
			var slug = RemoveDiacritics(baseValue).ToLowerInvariant();
			slug = new string(slug.Where(char.IsLetterOrDigit).ToArray());
			if (string.IsNullOrWhiteSpace(slug)) slug = "user";

			if (!counters.TryAdd(slug, 1))
			{
				counters[slug]++;
				slug = $"{slug}{counters[slug]}";
			}

			return $"{prefix}{slug}";
		}

		private static string RemoveDiacritics(string value)
		{
			var normalized = value.Normalize(NormalizationForm.FormD);
			Span<char> buffer = stackalloc char[normalized.Length];
			var idx = 0;
			foreach (var c in normalized)
			{
				var cat = CharUnicodeInfo.GetUnicodeCategory(c);
				if (cat != UnicodeCategory.NonSpacingMark)
				{
					buffer[idx++] = c;
				}
			}

			return new string(buffer[..idx]).Normalize(NormalizationForm.FormC);
		}

		private static string BuildDocenteKey(string subjectCode, string tier) => $"{subjectCode.ToUpperInvariant()}|{tier.ToLowerInvariant()}";

		private sealed record GradeSpec(string Nombre, string Codigo, string[] Grupos);
		private sealed record SubjectSpec(string Nombre, string Codigo);
		private sealed record DocenteBlueprint(string FirstName, string LastName, string SubjectCode, string Tier);
		private sealed record DocenteRecord(DocenteBlueprint Blueprint, Usuario Usuario, Asignatura Asignatura);
		private sealed record ColumnSpec(string Name, decimal Weight);

		private sealed class DocenteSeedResult
		{
			private readonly Dictionary<string, DocenteRecord> _map;

			public DocenteSeedResult(Dictionary<string, DocenteRecord> map, List<DocenteRecord> all)
			{
				_map = map;
				All = all;
			}

			public IReadOnlyList<DocenteRecord> All { get; }

			public DocenteRecord Get(string subjectCode, string tier)
			{
				var key = BuildDocenteKey(subjectCode, tier);
				return _map[key];
			}
		}

		private sealed class GradoBundle
		{
			public GradoBundle(Grado grado, List<Curso> cursos)
			{
				Grado = grado;
				Cursos = cursos;
			}

			public Grado Grado { get; }
			public List<Curso> Cursos { get; }
		}

		private sealed class CourseBundle
		{
			public CourseBundle(Curso curso, Grado grado, Dictionary<string, CursoAsignatura> asignaturas)
			{
				Curso = curso;
				Grado = grado;
				Asignaturas = asignaturas;
			}

			public Curso Curso { get; }
			public Grado Grado { get; }
			public Dictionary<string, CursoAsignatura> Asignaturas { get; }
			public List<StudentBundle> Students { get; } = new();
		}

		private sealed class StudentBundle
		{
			public StudentBundle(Estudiante estudiante, Usuario account, Usuario tutor, Curso curso, Grado grado, string firstName)
			{
				Estudiante = estudiante;
				Account = account;
				Tutor = tutor;
				Curso = curso;
				Grado = grado;
				FirstName = firstName;
			}

			public Estudiante Estudiante { get; }
			public Usuario Account { get; }
			public Usuario Tutor { get; }
			public Curso Curso { get; }
			public Grado Grado { get; }
			public string FirstName { get; }
		}
	}
}
