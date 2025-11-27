# Documento de ingenieria de software v2 - EduTrack Web

## 1. Modelo de negocio

### 1.1 Problematicas, contexto y actores
EduTrack Web opera en colegios privados que manejan entre cuatrocientas y ochocientas matriculas distribuidas en grados y grupos. Estas organizaciones dependen de hojas de calculo aisladas, mensajeria informal y reportes manuales para coordinar matriculas, asistencia, calificaciones y comunicaciones con las familias, lo que genera inconsistencias frecuentes. La plataforma atiende a la direccion academica y a los coordinadores, quienes necesitan consolidar informacion para tomar decisiones oportunas.

El ecosistema tambien incluye a los docentes, responsables de registrar asistencias y calificaciones, a los estudiantes que consultan su progreso y a los tutores que dan seguimiento a los compromisos escolares. La falta de un sistema integrado provoca duplicidad de datos, retrasos al detectar bajo desempeno y ausencia de trazabilidad sobre alertas o seguimientos, lo que dificulta reaccionar a tiempo y reduce la confianza entre los actores.

### 1.2 Justificacion e impacto del software
Las instituciones enfrentan tres problemas principales: registros dispersos que consumen tiempo, errores recurrentes al consolidar pesos o pertenencias de grupos, y comunicaciones sin historial verificable. EduTrack Web ataca estos puntos al centralizar toda la operacion academica, automatizar la generacion de credenciales, sincronizar cursos por grado y mantener historiales auditables. Con ello se reducen los minutos invertidos en transcribir datos, disminuyen los errores de digitacion y se mejora la organizacion institucional.

El impacto se distribuye por actor. Los directivos obtienen tableros confiables para evaluar riesgos y respaldar auditorias. Los docentes cuentan con una interfaz unificada para registrar asistencia, notas y comunicaciones sin duplicar trabajo. Los estudiantes acceden a indicadores actualizados que refuerzan su motivacion, mientras que los tutores reciben alertas oportunas y pueden verificar que sus consultas quedaron registradas. La estandarizacion promovida por el sistema evita depender de documentos dispersos o conversaciones informales y fortalece el cumplimiento normativo.

## 2. Necesidades y requerimientos

Los requerimientos de EduTrack Web definen las capacidades que el sistema debe ofrecer y las condiciones de calidad que debe respetar. Los requerimientos funcionales describen las acciones observables que respaldan la gestion academica, mientras que los no funcionales establecen criterios de seguridad, rendimiento, disponibilidad y usabilidad que aseguran un funcionamiento sostenible.

A continuacion se presentan los requerimientos funcionales organizados para reflejar los procesos criticos del ciclo academico. Cada item mantiene el formato RF-0X para facilitar su trazabilidad durante el desarrollo y la verificacion.

- RF-01: El sistema debe permitir la gestion completa de usuarios, roles y credenciales institucionales.
- RF-02: El sistema debe registrar estudiantes, asociarlos a grados y sincronizar sus grupos mediante reglas validadas.
- RF-03: El sistema debe administrar grados, cursos y asignaturas, incluyendo la asignacion de docentes responsables.
- RF-04: El sistema debe registrar asistencias por curso, estudiante y fecha, almacenando estado, observaciones y responsable.
- RF-05: El sistema debe permitir configurar instrumentos de evaluacion por periodo con pesos controlados.
- RF-06: El sistema debe almacenar calificaciones ponderadas por estudiante y recalcular promedios en tiempo real.
- RF-07: El sistema debe ofrecer tableros de estadisticas con filtros por grado, curso, periodo y estudiante.
- RF-08: El sistema debe proporcionar portales diferenciados para administradores, docentes, estudiantes y tutores.
- RF-09: El sistema debe emitir comunicaciones segmentadas y registrar la lectura por destinatario.
- RF-10: El sistema debe enviar notificaciones inmediatas a los actores afectados por cambios en asistencias, calificaciones o comunicaciones.

De igual forma, los requerimientos no funcionales se introducen para enfatizar que la plataforma no solo debe ejecutar funciones, sino tambien mantener un nivel de servicio acorde con las expectativas institucionales. Los codigos RNF-0X facilitan el seguimiento de estos compromisos transversales.

- RNF-01: El sistema debe autenticar mediante tokens firmados y controlar el acceso por rol.
- RNF-02: El sistema debe responder consultas operativas en menos de tres segundos con hasta doscientas sesiones concurrentes.
- RNF-03: El sistema debe cifrar las comunicaciones externas mediante HTTPS.
- RNF-04: El sistema debe registrar auditorias de operaciones sensibles conservando los datos por cinco anos.
- RNF-05: El sistema debe presentar una interfaz responsiva compatible con navegadores moviles y de escritorio.
- RNF-06: El sistema debe garantizar una disponibilidad minima de 99.5 por ciento mediante despliegues redundantes.
- RNF-07: El sistema debe separar responsabilidades entre frontend, servicios de dominio y base de datos para facilitar el mantenimiento.

## 3. Casos de uso

### Tabla de resumen
| Codigo | Nombre | Actor principal | Breve proposito |
| --- | --- | --- | --- |
| CU01 | Gestionar usuarios institucionales | Administrador academico | Mantener cuentas y permisos consistentes |
| CU02 | Administrar estudiantes y matriculas | Administrador academico | Registrar estudiantes y sincronizar sus cursos |
| CU03 | Registrar asistencia diaria | Docente | Controlar la asistencia por curso y fecha |
| CU04 | Publicar calificaciones por periodo | Docente | Configurar instrumentos y calcular promedios |
| CU05 | Consultar progreso individual | Estudiante / Tutor | Visualizar indicadores academicos personales |
| CU06 | Emitir comunicacion dirigida | Docente / Administrador academico | Compartir avisos y auditar la lectura |

### CU01 Gestionar usuarios institucionales
Este caso de uso asegura que los administradores academicos mantengan actualizado el inventario de cuentas, evitando accesos indebidos y garantizando que cada rol cuente con los permisos adecuados. Resulta critico para preservar la seguridad del sistema y para preparar a los docentes o tutores antes de cada periodo academico.
- **Actores**: Administrador academico.
- **Proposito**: Mantener el inventario de usuarios y asignar permisos acorde con las funciones institucionales.
- **Precondiciones**: El administrador cuenta con credenciales vigentes y se encuentra dentro del portal de administracion.
- **Flujo basico**:
  1. El administrador selecciona la opcion de gestion de usuarios.
  2. El sistema muestra la lista filtrable de usuarios existentes.
  3. El administrador crea o edita un registro, define datos personales y asigna roles.
  4. El sistema valida unicidad de usuario y consistencia de datos requeridos.
  5. El sistema guarda los cambios y notifica el resultado.
- **Flujos alternativos**:
  - FA1: Si el usuario ya existe, el sistema informa la colision y solicita un identificador diferente.
  - FA2: Si faltan datos obligatorios, el sistema resalta los campos pendientes y bloquea el guardado.

### CU02 Administrar estudiantes y matriculas
El administrador registra estudiantes y garantiza su ubicacion correcta en grados y grupos, lo que dispara la generacion de credenciales y la sincronizacion de cursos. Este caso de uso es la base para que docentes y tutores encuentren listas confiables y para que los tableros estadisticos reflejen la realidad de matriculas.
- **Actores**: Administrador academico.
- **Proposito**: Registrar estudiantes, asociarlos a grados y garantizar la inscripcion en cursos correspondientes.
- **Precondiciones**: Los grados y grupos se encuentran configurados y el administrador posee permisos de edicion.
- **Flujo basico**:
  1. El administrador accede al modulo de estudiantes.
  2. El sistema presenta la lista ordenable con opciones de busqueda.
  3. El administrador crea un nuevo estudiante indicando datos personales, grado y grupo.
  4. El sistema valida la existencia del grado y la pertenencia del grupo.
  5. El sistema almacena el estudiante, genera sus credenciales y sincroniza las inscripciones.
- **Flujos alternativos**:
  - FA1: Si el grado no existe, el sistema deniega la creacion y sugiere revisar el catalogo.
  - FA2: Si el grupo no pertenece al grado, el sistema muestra un mensaje de error y solicita una correccion.

### CU03 Registrar asistencia diaria
El registro de asistencia permite a cada docente documentar la presencia de los estudiantes por curso y fecha, lo que alimenta alertas tempranas y reportes oficiales. Este caso respalda la comunicacion con tutores y el calculo de indicadores de permanencia.
- **Actores**: Docente.
- **Proposito**: Registrar la asistencia de cada estudiante en un curso y fecha determinados.
- **Precondiciones**: El docente tiene asignado el curso y se encuentra dentro del horario autorizado.
- **Flujo basico**:
  1. El docente abre el curso y selecciona la fecha correspondiente.
  2. El sistema lista a los estudiantes inscritos en ese curso.
  3. El docente marca el estado de cada estudiante y agrega observaciones cuando aplica.
  4. El docente confirma el registro.
  5. El sistema guarda los datos, calcula indicadores y confirma la operacion.
- **Flujos alternativos**:
  - FA1: Si el docente no tiene permisos sobre el curso, el sistema muestra un mensaje de acceso restringido.
  - FA2: Si se pierde la conexion, el sistema mantiene los cambios en memoria y permite reintentar el envio.

### CU04 Publicar calificaciones por periodo
Este caso de uso articula la planeacion y la ejecucion de las evaluaciones, asegurando que cada instrumento posea pesos validados y que los promedios se retransmitan a estudiantes y tutores. Su correcta operacion evita incongruencias en boletines y soporta las decisiones de acompanamiento.
- **Actores**: Docente.
- **Proposito**: Configurar instrumentos de evaluacion, ingresar calificaciones y comunicar los promedios resultantes.
- **Precondiciones**: El curso posee un plan de evaluacion aprobado y los estudiantes se encuentran inscritos.
- **Flujo basico**:
  1. El docente define o selecciona los instrumentos del periodo.
  2. El sistema muestra los pesos registrados y valida que la suma alcance el cien por ciento.
  3. El docente ingresa las calificaciones de cada estudiante.
  4. El sistema recalcula promedios ponderados y aplica las reglas de aprobacion.
  5. El sistema publica los resultados para estudiantes y tutores.
- **Flujos alternativos**:
  - FA1: Si los pesos no suman el cien por ciento, el sistema impide continuar y alerta la inconsistencia.
  - FA2: Si un estudiante carece de inscripcion vigente, el sistema bloquea la captura y solicita al administrador revisar la matricula.

### CU05 Consultar progreso individual
La consulta de progreso permite que estudiantes y tutores monitoreen calificaciones, asistencias y comunicaciones desde un portal personalizado. Este caso de uso mantiene informados a los actores y refuerza la transparencia sobre el avance academico.
- **Actores**: Estudiante, Tutor.
- **Proposito**: Visualizar el rendimiento acumulado, la asistencia y las comunicaciones pendientes.
- **Precondiciones**: Existen calificaciones y asistencias registradas, y el actor posee credenciales personales.
- **Flujo basico**:
  1. El actor inicia sesion en su portal.
  2. El sistema recupera los indicadores asociados a sus cursos activos.
  3. El sistema muestra tarjetas con promedios, asistencias y mensajes recientes.
  4. El actor profundiza en un periodo o curso especifico para revisar detalles.
  5. El sistema registra la consulta para fines de auditoria.
- **Flujos alternativos**:
  - FA1: Si la sesion expira, el sistema solicita volver a autenticarse antes de revelar los datos.
  - FA2: Si no existen registros para el periodo filtrado, el sistema indica la ausencia de informacion sin generar alertas.

### CU06 Emitir comunicacion dirigida
El envio de comunicaciones formales garantiza que los avisos institucionales lleguen a los destinatarios correctos y que cada lectura quede auditada. Este caso integra la gestion de cursos, estudiantes y tutores con la capa de notificaciones en tiempo real.
- **Actores**: Docente, Administrador academico.
- **Proposito**: Compartir anuncios o alertas con cursos especificos, estudiantes o tutores y auditar la lectura.
- **Precondiciones**: Los destinatarios se encuentran registrados y el actor posee permisos de comunicacion.
- **Flujo basico**:
  1. El actor redacta el mensaje, selecciona tipo y canal.
  2. El sistema presenta filtros para elegir curso, estudiante o tutor.
  3. El actor confirma los destinatarios y publica la comunicacion.
  4. El sistema almacena el mensaje y genera notificaciones inmediatas.
  5. El sistema marca el seguimiento de lectura cuando los destinatarios acceden al contenido.
- **Flujos alternativos**:
  - FA1: Si el actor intenta enviar sin destinatarios, el sistema bloquea la accion y exige definir al menos uno.
  - FA2: Si se produce un fallo en el envio asincronico, el sistema registra el evento y programa un reintento controlado.

## 4. UML (texto base)

### 4.1 Diagrama de clases
El modelo de datos agrupa las entidades de usuarios y roles, la estructura academica y los mecanismos de comunicacion. Los usuarios representan a administradores, docentes y tutores; concentran las credenciales y los permisos que habilitan el acceso a los módulos del sistema. Cada usuario puede vincularse con autores de registros de asistencia, responsables de cursos o tutores de estudiantes, lo que refleja la polivalencia del personal en el colegio.

La dimension academica parte de los grados, que coordinan cursos y grupos, y se extiende a las inscripciones que unen a los estudiantes con los cursos donde reciben clases. Las asignaturas se enlazan con los cursos mediante una entidad de asignacion docente, lo que permite administrar cargas por materia y mantener consistencia en los planeadores. Las notas se modelan como resultados asociados a configuraciones de instrumentos, garantizando que cada valor conserve el contexto de periodo y peso utilizado para el calculo del promedio.

Un tercer conjunto de clases aborda la comunicacion y el seguimiento. Las comunicaciones representan mensajes emitidos por docentes o administradores, mientras que los destinatarios almacenan la trazabilidad de lectura y el canal utilizado. El vinculo entre tutores y estudiantes se modela de forma explicita para soportar notificaciones dirigidas y delegar responsabilidades en los contactos principales. La combinacion de estos elementos ofrece una vista completa de la relacion entre personas, cursos y eventos academicos.

### 4.2 Diagramas de secuencia
Los diagramas de secuencia muestran la dinamica entre la interfaz web, los servicios de negocio y la base de datos en momentos clave. Funcionan como evidencia de que los procesos no solo dependen de formularios aislados, sino de una cadena coordinada que valida permisos, persiste datos y comunica resultados.

En la secuencia Registrar asistencia diaria, el docente interactua con la interfaz web mediante una llamada sincrona para solicitar el modulo correspondiente. La interfaz invoca al servicio de gestion para validar permisos y obtener la lista de estudiantes a traves del repositorio y la base de datos, tambien mediante mensajes sincronos. Tras ingresar los estados, la interfaz envia la informacion al servicio, que persiste los registros y remite la confirmacion. Finalmente, el servicio emite un mensaje asincrono al subsistema de notificaciones para alertar a tutores y estudiantes sobre los cambios realizados.

En la secuencia Publicar calificaciones por periodo, el docente utiliza la interfaz para definir configuraciones de evaluacion; la interfaz comunica esta accion al servicio de evaluaciones mediante una llamada sincrona. El servicio valida los pesos consultando la base de datos y devuelve el resultado. Una vez ingresadas las calificaciones, la interfaz envia los nuevos valores, el servicio recalcula promedios y actualiza los datos de forma sincrona, y luego emite notificaciones asincronas hacia el subsistema encargado de avisar a estudiantes y tutores. Como paso final, la interfaz estudiantil solicita los nuevos promedios mediante una llamada sincrona para refrescar los tableros.

### 4.3 Diagrama de despliegue
El diagrama de despliegue describe la arquitectura fisica que sostiene EduTrack Web y explica como se separan las responsabilidades para garantizar seguridad y escalabilidad. Un nodo cliente ejecuta la aplicacion React en el navegador y descarga recursos desde un servidor web o CDN. Este servidor se comunica mediante HTTPS con la capa de aplicacion construida en ASP.NET Core, donde residen los controladores, los servicios de dominio y el concentrador de notificaciones en tiempo real. A su vez, la capa de aplicacion mantiene una conexion protegida con la base de datos SQL Server ubicada en un nodo interno y se integra, cuando es necesario, con servicios externos de correo o almacenamiento a traves de canales seguros. Esta configuracion protege la informacion sensible y facilita el crecimiento horizontal del backend.
