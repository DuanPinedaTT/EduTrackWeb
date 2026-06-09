(Aqui iba una imagen)

**EduTrack - DocumentaciÃ³n y Pruebas de Software**

**Grupo 01:**

Duan AndrÃ©s Pineda Corrales

JosÃ© Anibal Pinto FernÃ¡ndez

**Grupo 03:**

Beykel Jhosep Pinto FernÃ¡ndez

IngenierÃ­a de Software II

Maribel Romero Mestre

IngenierÃ­a de Sistemas

Universidad Popular del Cesar

Valledupar - Cesar

2026

**PRIMERA PARTE**

- **DESCRIPCION DEL SISTEMA**
  - IDENTIFICACION DEL PROBLEMA
  - DESCRIPCIÃ“N DETALLADA DEL SISTEMA O APLICACION
  - MODELO DE REQUERIMIENTOS
    - DescripciÃ³n Requisitos funcionales
    - DescripciÃ³n Requisitos no funcionales
  - MODELO DE CASOS DE USO
    - Diagramas de caso de uso
    - DescripciÃ³n de caso de uso
  - MODELO DE DISEÃ‘O DEL SISTEMA
    - Diagrama de clases detallado
    - Diagramas de secuencias
    - Diagrama entidad relaciÃ³n
    - Diagrama de componentes
  - PRODUCTO DEL SOFTWARE

**SEGUNDA PARTE**

- **PRUEBAS DEL SOFTWARE**
  - INTRODUCCIÃ“N
  - **PLANIFICACIÃ“N DE LAS PRUEBAS**
    - Objetivos de las pruebas
    - Alcance de las pruebas
    - Estrategias de pruebas
    - Ambiente de pruebas
  - **PRUEBAS UNITARIAS**

AnÃ¡lisis de las pruebas

DiseÃ±o de casos de pruebas

EjecuciÃ³n y evaluaciÃ³n de las pruebas

- 1. **PRUEBAS DE INTEGRACIÃ“N**
     - Estrategia de Pruebas incrementales
- DiseÃ±o casos de pruebas
- EjecuciÃ³n y evaluaciÃ³n de las pruebas de integraciÃ³n
  - 1. Estrategia de Pruebas basadas en hilos
- DiseÃ±o casos de pruebas
- EjecuciÃ³n y evaluaciÃ³n de las pruebas de integraciÃ³n
  - **PRUEBAS DE SISTEMAS**
    - Pruebas de seguridad

DiseÃ±o, ejecuciÃ³n y evaluaciÃ³n de las pruebas

- - 1. Pruebas de Rendimiento

DiseÃ±o, ejecuciÃ³n y evaluaciÃ³n de las pruebas

- - 1. Pruebas de Usabilidad

DiseÃ±o, ejecuciÃ³n y evaluaciÃ³n de las pruebas

- - 1. Pruebas de Portabilidad

DiseÃ±o, ejecuciÃ³n y evaluaciÃ³n de las pruebas

- 1. **PRUEBAS DE ACEPTACIÃ“N**
     - DiseÃ±o de caso de pruebas
     - EjecuciÃ³n y evaluaciÃ³n de la prueba
  - **CONCLUSIONES**

**PRIMERA PARTE**

# 1\. DESCRIPCIÃ“N DEL SISTEMA

## 1.1 IdentificaciÃ³n del Problema

Los colegios privados de tamaÃ±o medio que manejan entre 400 y 800 matrÃ­culas operan, en su mayorÃ­a, con herramientas desarticuladas: hojas de cÃ¡lculo aisladas, mensajerÃ­a informal (WhatsApp, correo electrÃ³nico) y reportes elaborados manualmente. Esta fragmentaciÃ³n genera inconsistencias frecuentes en los datos acadÃ©micos, duplicidad de registros, retrasos en la detecciÃ³n de bajo desempeÃ±o estudiantil y ausencia de trazabilidad sobre alertas o seguimientos.

La falta de un sistema integrado dificulta la toma de decisiones oportunas por parte de directivos y coordinadores, reduce la confianza entre los actores institucionales y obliga a los docentes a invertir tiempo valioso en tareas administrativas repetitivas en lugar de concentrarse en la labor pedagÃ³gica.

EduTrack Web surge como respuesta directa a esta problemÃ¡tica, proponiendo una plataforma centralizada que unifica la gestiÃ³n de estudiantes, matrÃ­culas, cursos, asistencia, calificaciones, comunicaciones y reportes en un Ãºnico entorno web accesible para todos los actores institucionales.

## 1.2 DescripciÃ³n del Sistema o AplicaciÃ³n

EduTrack Web es una aplicaciÃ³n web de gestiÃ³n acadÃ©mica desarrollada con arquitectura Cliente-Servidor desacoplada. El sistema centraliza y automatiza los procesos acadÃ©micos mÃ¡s crÃ­ticos de un colegio privado de tamaÃ±o medio, reemplazando los mÃ©todos manuales y dispersos por flujos validados, estandarizados y trazables.

### 1.2.1 Funcionalidades Principales

- GestiÃ³n de usuarios y roles: creaciÃ³n y administraciÃ³n de cuentas con control de acceso por rol.
- GestiÃ³n de matrÃ­culas: registro de estudiantes, asignaciÃ³n a grados y grupos con sincronizaciÃ³n automÃ¡tica.
- Registro de asistencia: marcaciÃ³n diaria con detecciÃ³n de duplicados y actualizaciÃ³n automÃ¡tica (UPSERT).
- GestiÃ³n de calificaciones: instrumentos de evaluaciÃ³n con pesos ponderados (suma 100%), cÃ¡lculo automÃ¡tico de promedios.
- Comunicaciones institucionales: mensajerÃ­a formal con registro de lectura auditado.
- Tableros de estadÃ­sticas: indicadores por grado, curso y perÃ­odo.
- Portales diferenciados: interfaz personalizada para cada perfil de usuario.
- ExportaciÃ³n de reportes: generaciÃ³n de archivos Excel y PDF (boletines).

### 1.2.2 TecnologÃ­as Utilizadas

| **Capa**      | **TecnologÃ­a**               | **DescripciÃ³n**                                           |
| ------------- | ---------------------------- | --------------------------------------------------------- |
| Backend       | ASP.NET Core 8 Web API (C#)  | API RESTful con Entity Framework Core y autenticaciÃ³n JWT |
| Frontend      | React + Vite                 | Interfaz de usuario reactiva y responsiva                 |
| Base de datos | SQL Server LocalDB           | Base de datos relacional gestionada con EF Core ORM       |
| Seguridad     | JWT (JSON Web Tokens)        | AutenticaciÃ³n basada en tokens con roles de usuario       |
| Ambiente      | Localhost (desarrollo local) | localhost:5173 (frontend) / localhost:5000 o 7000 (API)   |

### 1.2.3 MetodologÃ­a de Desarrollo

El desarrollo siguiÃ³ un enfoque iterativo e incremental, construyendo mÃ³dulo por mÃ³dulo con validaciones integradas en cada capa. La arquitectura implementa el patrÃ³n MVC en el backend, con una capa de servicios que encapsula la lÃ³gica de negocio mÃ¡s compleja.

## 1.3 Requisitos del Sistema

### 1.3.1 Requisitos Funcionales

| **Codigo** | **Nombre**                            | **Descripcion**                                                                 | **Actor Principal**      |
| ---------- | ------------------------------------- | ------------------------------------------------------------------------------- | ------------------------ |
| RF01       | Gestionar usuarios                    | Permitir crear, editar, activar, desactivar y asignar roles a los usuarios.    | Administrador            |
| RF02       | Gestionar grados, grupos y cursos     | Permitir crear y organizar grados, grupos, asignaturas y carga docente.         | Administrador / Coord.   |
| RF03       | Matricular estudiantes                | Permitir registrar estudiantes y ubicarlos en su grado y grupo correspondiente. | Administrador            |
| RF04       | Registrar asistencia diaria           | Permitir al docente marcar asistencia por fecha y curso, y corregir si se pasa. | Docente                  |
| RF05       | Configurar evaluaciones               | Permitir definir actividades y porcentajes de evaluacion por periodo.           | Docente                  |
| RF06       | Registrar y publicar notas            | Permitir ingresar notas y calcular el resultado final automaticamente.          | Docente                  |
| RF07       | Consultar rendimiento academico       | Permitir ver notas, asistencia y observaciones por estudiante y por curso.      | Directivo / Coord.       |
| RF08       | Consultar informacion por rol         | Mostrar a cada usuario solo lo que le corresponde segun su perfil.              | Todos                    |
| RF09       | Enviar comunicaciones institucionales | Permitir enviar mensajes, avisos y citaciones con registro de lectura.          | Administrador / Docente  |
| RF10       | Generar reportes y boletines          | Permitir descargar reportes academicos y boletines en formatos imprimibles.     | Administrador / Coord.   |
| RF11       | Ver portal del estudiante             | Permitir que el estudiante consulte su avance, mensajes y observaciones.         | Estudiante               |
| RF12       | Ver portal del acudiente              | Permitir que el acudiente consulte el avance del estudiante y reciba alertas.   | Tutor / Acudiente        |

### 1.3.2 Requisitos No Funcionales

| **CÃ³digo** | **CategorÃ­a**  | **DescripciÃ³n**                                                          |
| ---------- | -------------- | ------------------------------------------------------------------------ |
| RNF01      | Seguridad      | Encriptar contraseÃ±as antes de almacenarlas.                             |
| RNF02      | Rendimiento    | Responder consultas en menos de 2 segundos bajo carga normal.            |
| RNF03      | Portabilidad   | Ejecutarse en Chrome, Edge y Firefox.                                    |
| RNF04      | Usabilidad     | Interfaz sencilla y amigable para todos los perfiles.                    |
| RNF05      | Confiabilidad  | Garantizar integridad de la informaciÃ³n, evitando pÃ©rdida o duplicaciÃ³n. |
| RNF06      | Compatibilidad | Compatible con Windows, Linux y macOS en entorno web.                    |
| RNF07      | Concurrencia   | Permitir acceso simultÃ¡neo de al menos 200 usuarios.                     |

## 1.4 Modelo de Casos de Uso

### 1.4.1 Actores del Sistema

| **Actor**         | **Descripcion**                                    | **Responsabilidades Principales**                                             |
| ----------------- | -------------------------------------------------- | ----------------------------------------------------------------------------- |
| Administrador     | Persona encargada del control general del sistema. | Gestionar usuarios, estructura academica, matriculas y reportes generales.    |
| Coordinador       | Persona que supervisa el proceso academico.        | Hacer seguimiento al rendimiento, revisar reportes y apoyar a docentes.       |
| Docente           | Responsable del proceso en el aula.                | Registrar asistencia, evaluar estudiantes, publicar notas y enviar mensajes.  |
| Estudiante        | Usuario academico final.                           | Consultar notas, asistencia, observaciones y mensajes del colegio.            |
| Tutor / Acudiente | Familiar o responsable del estudiante.             | Consultar el avance del estudiante y revisar alertas o comunicaciones.        |
| Sistema           | Componente automatico de la plataforma.            | Enviar notificaciones y mantener actualizada la informacion en tiempo real.   |

### 1.4.2 Tabla de Casos de Uso

| **Codigo** | **Nombre**                     | **Actor Principal**      | **Descripcion**                                                                    |
| ---------- | ------------------------------ | ------------------------ | ---------------------------------------------------------------------------------- |
| CU01       | Gestionar usuarios             | Administrador            | Crear, editar y asignar roles a los usuarios del sistema.                         |
| CU02       | Gestionar estructura academica | Administrador            | Crear y actualizar grados, grupos, asignaturas y asignaciones docentes.           |
| CU03       | Matricular estudiante          | Administrador            | Registrar estudiante y asignarlo al grado y grupo correspondiente.                |
| CU04       | Registrar asistencia           | Docente                  | Marcar asistencia diaria por curso y dejar observaciones cuando sea necesario.    |
| CU05       | Configurar evaluaciones        | Docente                  | Definir actividades y porcentajes por periodo academico.                           |
| CU06       | Registrar notas                | Docente                  | Cargar notas por actividad y generar el resultado final automaticamente.           |
| CU07       | Enviar comunicacion            | Administrador / Docente  | Enviar mensajes o avisos y llevar control de quienes los leyeron.                 |
| CU08       | Consultar reportes academicos  | Coordinador              | Revisar indicadores por curso, grado, periodo y estudiante.                        |
| CU09       | Consultar portal estudiantil   | Estudiante               | Ver notas, asistencia, observaciones y mensajes personales.                        |
| CU10       | Consultar portal de acudiente  | Tutor / Acudiente        | Ver el avance del estudiante y revisar alertas o comunicaciones del colegio.       |
| CU11       | Generar boletines y reportes   | Administrador / Coord.   | Exportar boletines y reportes para seguimiento academico y entrega institucional.  |
| CU12       | Enviar notificaciones          | Sistema                  | Generar alertas automaticas cuando hay novedades importantes.                      |

### 1.4.3 Descripcion Detallada de Casos de Uso Relevantes

**CU01 - Gestionar usuarios**

Proposito: Mantener actualizados los usuarios para que cada persona tenga su acceso correcto.

Precondiciones: El administrador ha iniciado sesion en el modulo de administracion.

Flujo principal:

1. El administrador entra a la opcion de usuarios.
2. El sistema muestra la lista actual de usuarios.
3. El administrador crea uno nuevo o edita uno existente.
4. Asigna el rol correspondiente.
5. El sistema valida la informacion y guarda.
6. El sistema confirma el resultado.

Flujos alternos:

- Si un correo o usuario ya existe, el sistema lo informa y no permite guardar hasta corregir.
- Si faltan datos obligatorios, el sistema marca los campos pendientes.

Resultado esperado: Usuario creado o actualizado con el rol correcto.

**CU04 - Registrar asistencia**

Proposito: Llevar un control diario de presencia de los estudiantes.

Precondiciones: El docente tiene asignado el curso.

Flujo principal:

1. El docente elige curso y fecha.
2. El sistema muestra la lista de estudiantes.
3. El docente marca asistencia y agrega observaciones si hace falta.
4. El docente guarda.
5. El sistema registra la informacion o la actualiza si ese dia ya estaba cargado.
6. El sistema confirma el guardado.

Flujos alternos:

- Si no hay estudiantes matriculados en el curso, el sistema informa que no hay lista para esa fecha.
- Si ocurre un error de conexion, el sistema muestra aviso y permite reintentar.

Resultado esperado: Asistencia guardada correctamente para el curso y fecha.

**CU06 - Registrar notas**

Proposito: Guardar las notas de cada actividad y calcular el resultado final del periodo.

Precondiciones: El docente ya configuro actividades y porcentajes del periodo.

Flujo principal:

1. El docente selecciona curso, asignatura y periodo.
2. El sistema muestra actividades y estudiantes.
3. El docente ingresa o ajusta notas.
4. El sistema calcula el acumulado de forma automatica.
5. El docente publica las notas.
6. El sistema confirma la publicacion.

Flujos alternos:

- Si los porcentajes no estan completos, el sistema no deja publicar.
- Si una nota esta fuera del rango permitido, el sistema solicita correccion.

Resultado esperado: Notas registradas y visibles para consulta segun el rol.

**CU10 - Consultar portal de acudiente**

Proposito: Permitir al acudiente hacer seguimiento facil al avance del estudiante.

Precondiciones: El acudiente tiene acceso activo y esta vinculado al estudiante.

Flujo principal:

1. El acudiente inicia sesion.
2. El sistema muestra panel de resumen del estudiante.
3. El acudiente revisa notas, asistencia, observaciones y mensajes.
4. El sistema marca como leidos los mensajes consultados.

Flujos alternos:

- Si no hay informacion nueva, el sistema lo informa claramente.

Resultado esperado: Acudiente informado y con seguimiento actualizado.

### 1.4.4 Diagrama de Casos de Uso

```mermaid
flowchart LR
  A[Administrador]
  C[Coordinador]
  D[Docente]
  E[Estudiante]
  T[Tutor o Acudiente]
  S[Sistema]

  CU1((Gestionar usuarios))
  CU2((Gestionar estructura academica))
  CU3((Matricular estudiante))
  CU4((Registrar asistencia))
  CU5((Configurar evaluaciones))
  CU6((Registrar notas))
  CU7((Enviar comunicacion))
  CU8((Consultar reportes academicos))
  CU9((Consultar portal estudiantil))
  CU10((Consultar portal de acudiente))
  CU11((Generar boletines y reportes))
  CU12((Enviar notificaciones))

  A --- CU1
  A --- CU2
  A --- CU3
  A --- CU7
  A --- CU11

  C --- CU8
  C --- CU11

  D --- CU4
  D --- CU5
  D --- CU6
  D --- CU7

  E --- CU9
  T --- CU10

  S --- CU12
  CU7 -. activa .-> CU12
  CU4 -. puede activar .-> CU12
  CU6 -. puede activar .-> CU12
```

## 1.5 Modelo de Diseño del Sistema

Esta sección mantiene la unidad entre requisitos funcionales (RF01-RF12), casos de uso (CU01-CU12) y modelo de clases.

Regla de consistencia: cada requisito debe verse en al menos un caso de uso y en una o más clases del dominio.

### 1.5.1 Diagrama de Clases - Entidades Principales (alineado con requisitos y casos de uso)

El sistema EduTrack Web está estructurado por estas entidades principales:

- Usuario: credenciales, rol y datos personales.
- Docente: perfil académico asociado a Usuario.
- Estudiante: perfil estudiantil asociado a Usuario.
- Tutor: perfil acudiente asociado a Usuario.
- TutorEstudiante: tabla pivote entre Tutor y Estudiante.
- Grado: nivel académico.
- Curso: curso activo por período.
- Asignatura: materia académica.
- CursoAsignatura: vínculo entre Curso y Asignatura.
- Inscripcion: matrícula del estudiante.
- Asistencia: registro de presencia por fecha y asignatura.
- NotaConfig: instrumentos y ponderaciones de evaluación.
- Nota: calificación por estudiante.
- Comunicacion: mensaje institucional.
- ComunicacionDestino: destinatario y estado de lectura.

Relaciones clave:

- Usuario 1..1 Docente / Estudiante / Tutor.
- Tutor N..N Estudiante mediante TutorEstudiante.
- Grado 1..N Curso.
- Curso N..N Asignatura mediante CursoAsignatura.
- Estudiante 1..N Inscripcion y Curso 1..N Inscripcion.
- Estudiante 1..N Asistencia.
- Estudiante 1..N Nota y NotaConfig 1..N Nota.
- Comunicacion 1..N ComunicacionDestino.

Matriz de unidad (Requisito -> Caso de uso -> Clases):

| Requisito | Caso(s) de uso | Clases principales |
| --- | --- | --- |
| RF01 Gestionar usuarios y roles | CU01 | Usuario |
| RF02 Gestionar docentes y tutores | CU02 | Docente, Tutor, Usuario, TutorEstudiante |
| RF03 Gestionar grados, cursos y asignaturas | CU03 | Grado, Curso, Asignatura, CursoAsignatura |
| RF04 Registrar asistencia | CU04 | Asistencia, Estudiante, CursoAsignatura |
| RF05 Configurar evaluaciones y ponderaciones | CU05 | NotaConfig, CursoAsignatura |
| RF06 Registrar y actualizar notas | CU06 | Nota, NotaConfig, Estudiante |
| RF07 Publicar información académica | CU07 | Nota, Asistencia, Comunicacion |
| RF08 Enviar comunicaciones | CU08 | Comunicacion, ComunicacionDestino, Usuario |
| RF09 Consultar portal de estudiante | CU09 | Estudiante, Inscripcion, Nota, Asistencia |
| RF10 Consultar portal de acudiente | CU10 | Tutor, TutorEstudiante, Estudiante, Nota, Asistencia |
| RF11 Generar boletines y reportes | CU11 | Nota, Asistencia, Estudiante, Curso |
| RF12 Notificaciones automáticas | CU12 | Comunicacion, ComunicacionDestino |

Nota: si se crea un nuevo requisito, se debe agregar su caso de uso y su impacto en clases.

### 1.5.2 Diagrama de Secuencia (pendiente)

Objetivo: mostrar cómo colaboran actor, frontend, backend y base de datos en un flujo completo.

Caso recomendado para diagramar: CU06 Registrar y actualizar notas.

Participantes sugeridos:

- Docente.
- Frontend Web (React).
- NotasController (API).
- Servicio de Notas.
- AppDbContext / SQL Server.
- NotificationHub (opcional).

Flujo principal sugerido:

1. Docente registra notas en la interfaz.
2. Frontend valida y envía petición a API.
3. API valida permisos y reglas de negocio.
4. Servicio guarda o actualiza notas en base de datos.
5. API responde éxito o error.
6. Frontend muestra confirmación.
7. Opcional: notificación a estudiante o tutor.

Texto listo para IA (prompt):

"Genera un diagrama de secuencia UML para EduTrack Web del caso CU06 Registrar y actualizar notas. Incluye los participantes: Docente, Frontend React, NotasController ASP.NET Core, ServicioNotas, AppDbContext, SQL Server y NotificationHub opcional. Representa flujo exitoso y flujo alterno por error de validación de ponderación o permisos, usando bloques alt."

### 1.5.3 Diagrama Entidad-Relación (pendiente)

Objetivo: representar la estructura de datos y sus cardinalidades.

Entidades mínimas:

- Usuario, Docente, Estudiante, Tutor, TutorEstudiante.
- Grado, Curso, Asignatura, CursoAsignatura.
- Inscripcion, Asistencia.
- NotaConfig, Nota.
- Comunicacion, ComunicacionDestino.

Relaciones mínimas:

- Usuario con Docente/Estudiante/Tutor (1:1).
- Tutor con Estudiante (N:N por TutorEstudiante).
- Grado con Curso (1:N).
- Curso con Asignatura (N:N por CursoAsignatura).
- Estudiante con Inscripcion (1:N).
- Estudiante con Asistencia (1:N).
- Estudiante con Nota (1:N).
- NotaConfig con Nota (1:N).
- Comunicacion con ComunicacionDestino (1:N).

Texto listo para IA (prompt):

"Genera un diagrama entidad-relación para EduTrack Web con las entidades Usuario, Docente, Estudiante, Tutor, TutorEstudiante, Grado, Curso, Asignatura, CursoAsignatura, Inscripcion, Asistencia, NotaConfig, Nota, Comunicacion y ComunicacionDestino. Incluye PK, FK y cardinalidades, destacando las tablas pivote TutorEstudiante y CursoAsignatura."

### 1.5.4 Diagrama de Componentes (pendiente)

Objetivo: mostrar la arquitectura técnica y dependencias entre módulos.

Componentes mínimos:

- Frontend (React + Vite).
- API REST (ASP.NET Core).
- Controladores.
- Servicios de negocio.
- Capa de datos (EF Core + AppDbContext).
- Base de datos SQL Server.
- Módulo JWT.
- NotificationHub (SignalR).

Conexiones mínimas:

- Frontend consume API por HTTP/JSON.
- API aplica JWT para autenticación/autorización.
- Controladores delegan en servicios.
- Servicios usan AppDbContext.
- AppDbContext persiste en SQL Server.
- API y servicios publican notificaciones en NotificationHub.

Texto listo para IA (prompt):

"Genera un diagrama de componentes UML para EduTrack Web con Frontend React, API ASP.NET Core, capa de Controladores, capa de Servicios, AppDbContext EF Core, SQL Server, módulo JWT y SignalR NotificationHub. Muestra dependencias y el flujo Frontend -> API -> Servicios -> Datos -> Base de datos."

### 1.5.5 Checklist de unidad entre análisis y diseño

1. Cada RF aparece en al menos un CU.
2. Cada CU está soportado por clases del dominio.
3. Cada entidad del diagrama de clases existe en el diagrama ER o tiene justificación.
4. Los flujos críticos tienen al menos un diagrama de secuencia.
5. El diagrama de componentes coincide con la arquitectura implementada.

### 2.2.2 Alcance

El alcance del plan de pruebas cubre los modulos principales del sistema y los tipos de prueba que se aplicaran a cada uno.

| Modulo / funcionalidad | Que se valida | Tipos de prueba |
| --- | --- | --- |
| Autenticacion y usuarios | Acceso, roles, permisos y sesion | Unitarias, integracion, seguridad |
| Gestion academica (grados, cursos, asignaturas, matriculas) | Creacion, consulta y relacion entre datos | Unitarias, integracion, sistemas |
| Asistencia | Registro, actualizacion y consulta | Unitarias, integracion, sistemas |
| Calificaciones y ponderaciones | Configuracion de evaluaciones y calculo de notas | Unitarias, integracion, sistemas |
| Comunicaciones | Envio, recepcion y lectura de mensajes | Unitarias, integracion, interfaz de usuario |
| Portales de estudiante y acudiente | Visualizacion de informacion y experiencia de uso | Sistemas, interfaz de usuario, aceptacion |
| Reportes y boletines | Generacion y exportacion de documentos | Integracion, sistemas, aceptacion |

En este alcance se incluyen pruebas unitarias, de integracion, de sistemas (entorno, seguridad e interfaz de usuario) y de aceptacion, segun corresponda a cada modulo.

### 2.2.3 Estrategias de Pruebas

| Tipo de prueba | Tecnica de prueba | Modelo / estrategia / tipo | Herramientas |
| --- | --- | --- | --- |
| Unitarias | Caja negra: particion de equivalencia y valores limite | Validacion de entradas en formularios y endpoints | Postman, navegador web |
| Unitarias | Caja blanca: camino basico y complejidad ciclomatica | Analisis de flujos logicos del codigo backend | Codigo fuente C# (VS Code) |
| Integracion | Integracion incremental ascendente | Estrategia Bottom-Up entre modulos | Postman, Swagger UI |
| Integracion | Pruebas basadas en hilos | Flujos completos extremo a extremo | Postman, Swagger UI |
| Sistemas | Seguridad (DAST, caja negra) | Top 10 OWASP: SQLi, XSS y headers | OWASP ZAP |
| Sistemas | Rendimiento | Load testing y stress testing | Apache JMeter |
| Sistemas | Usabilidad | Heuristicas de Nielsen y Core Web Vitals | Google Lighthouse |
| Sistemas | Portabilidad | Cross-browser y cross-device | Chrome DevTools, BrowserStack |
| Aceptacion | Aceptacion del usuario (UAT) | Historias de usuario y flujos de negocio | Navegador web |

### 2.2.4 Ambiente de Pruebas

**ConfiguraciÃ³n base de hardware:**

| **Componente**    | **Especificaciones TÃ©cnicas** |
| ----------------- | ----------------------------- |
| Procesador        | AMD Ryzen                     |
| Memoria RAM       | 16 GB                         |
| Almacenamiento    | SSD 500 GB                    |
| Sistema Operativo | Windows 10 (64 bits)          |

**Software para el ambiente de pruebas:**

| **Software**         | **VersiÃ³n / DescripciÃ³n**                      |
| -------------------- | ---------------------------------------------- |
| Visual Studio Code   | Editor principal de desarrollo y pruebas       |
| ASP.NET Core         | VersiÃ³n 8.0 - Framework backend                |
| Node.js + Vite       | Empaquetador y servidor frontend React         |
| SQL Server LocalDB   | Motor de base de datos local (AcademiaNotasDB) |
| Postman / Swagger UI | EjecuciÃ³n y validaciÃ³n de pruebas API          |
| Apache JMeter        | Pruebas de rendimiento y estrÃ©s                |
| OWASP ZAP            | Pruebas de seguridad (DAST)                    |
| Google Lighthouse    | AuditorÃ­a de usabilidad y accesibilidad        |
| Navegador web        | Google Chrome / Microsoft Edge                 |

# 3\. PRUEBAS UNITARIAS (seguir la plantilla)

## 3.1 MÃ³dulo de GestiÃ³n AcadÃ©mica (Cursos)
(Aqui iba una imagen)
### 3.1.1 AnÃ¡lisis de Pruebas - Clases de Equivalencia

**IdentificaciÃ³n de Clases de Equivalencia:**

Campo: Nombre del Curso (longitud y obligatoriedad)

- \[CE-01\] VÃLIDA: Cadena alfanumÃ©rica entre 3 y 50 caracteres.
- \[CE-02\] INVÃLIDA: Cadena vacÃ­a o nula.
- \[CE-03\] INVÃLIDA: Cadena de 1 o 2 caracteres.
- \[CE-04\] INVÃLIDA: Cadena de mÃ¡s de 50 caracteres.

Campo: Capacidad MÃ¡xima (rango numÃ©rico)

- \[CE-05\] VÃLIDA: NÃºmero entero entre 15 y 45.
- \[CE-06\] INVÃLIDA: Valor ausente o no numÃ©rico.
- \[CE-07\] INVÃLIDA: NÃºmero entero menor a 15.
- \[CE-08\] INVÃLIDA: NÃºmero entero mayor a 45.

Campo: GradoId (identificador relacional)

- \[CE-09\] VÃLIDA: NÃºmero entero mayor a 0 y existente en el sistema.
- \[CE-10\] INVÃLIDA: Valor ausente o no numÃ©rico.
- \[CE-11\] INVÃLIDA: NÃºmero entero menor o igual a 0.
- \[CE-12\] INVÃLIDA: NÃºmero entero mayor a 0, pero inexistente en el sistema.

### Tabla de Casos de Prueba - Equivalencia

| **ID Caso** | **DescripciÃ³n del Escenario** | **Nombre**            | **Capacidad** | **GradoId** | **Clases Cubiertas** | **Resultado Esperado**          |
| ----------- | ----------------------------- | --------------------- | ------------- | ----------- | -------------------- | ------------------------------- |
| CP-EQ-01    | CreaciÃ³n de curso exitosa     | "MatemÃ¡ticas BÃ¡sicas" | 30            | 2           | CE-01, CE-05, CE-09  | Ã‰xito: Curso creado (201)       |
| CP-EQ-02    | Falla por campos nulos/vacÃ­os | \[Nulo\]              | \[Nulo\]      | \[Nulo\]    | CE-02, CE-06, CE-10  | Falla: Error validaciÃ³n (400)   |
| CP-EQ-03    | Falla por Nombre muy corto    | "Ma"                  | 25            | 3           | CE-03, CE-05, CE-09  | Falla: Longitud mÃ­nima 3        |
| CP-EQ-04    | Falla por Nombre muy largo    | 51 caracteres         | 20            | 1           | CE-04, CE-05, CE-09  | Falla: Longitud mÃ¡xima 50       |
| CP-EQ-05    | Falla por Capacidad mÃ­nima    | "FÃ­sica I"            | 10            | 4           | CE-01, CE-07, CE-09  | Falla: Capacidad mÃ­nima 15      |
| CP-EQ-06    | Falla por Capacidad mÃ¡xima    | "QuÃ­mica General"     | 60            | 2           | CE-01, CE-08, CE-09  | Falla: Capacidad mÃ¡xima 45      |
| CP-EQ-07    | Falla por GradoId negativo    | "Historia"            | 30            | \-5         | CE-01, CE-05, CE-11  | Falla: Grado invÃ¡lido           |
| CP-EQ-08    | Falla por GradoId inexistente | "BiologÃ­a"            | 35            | 9999        | CE-01, CE-05, CE-12  | Falla: El grado no existe (404) |

### 3.1.2 AnÃ¡lisis de Pruebas - Valores LÃ­mite

| **CAMPO** | **Regla de Negocio** | **Tipo de LÃ­mite**             | **Datos de Entrada** | **Escenario Evaluado**                    | **Resultado Esperado** |
| --------- | -------------------- | ------------------------------ | -------------------- | ----------------------------------------- | ---------------------- |
| Nombre    | Longitud (3 a 50)    | LÃ­mite Inferior - 1 (InvÃ¡lido) | "Ab" (2 chars)       | Falla justo debajo del mÃ­nimo             | Rechazo (400)          |
| Nombre    | Longitud (3 a 50)    | LÃ­mite Inferior (VÃ¡lido)       | "Alm" (3 chars)      | AceptaciÃ³n en el mÃ­nimo estricto          | Aceptado               |
| Nombre    | Longitud (3 a 50)    | LÃ­mite Inferior + 1 (VÃ¡lido)   | "Arte" (4 chars)     | AceptaciÃ³n justo encima del mÃ­nimo        | Aceptado               |
| Nombre    | Longitud (3 a 50)    | LÃ­mite Superior - 1 (VÃ¡lido)   | Cadena 49 chars      | AceptaciÃ³n justo debajo del mÃ¡ximo        | Aceptado               |
| Nombre    | Longitud (3 a 50)    | LÃ­mite Superior (VÃ¡lido)       | Cadena 50 chars      | AceptaciÃ³n en el mÃ¡ximo estricto          | Aceptado               |
| Nombre    | Longitud (3 a 50)    | LÃ­mite Superior + 1 (InvÃ¡lido) | Cadena 51 chars      | Falla por encima del mÃ¡ximo               | Rechazo (400)          |
| Capacidad | Valor (15 a 45)      | LÃ­mite Inferior - 1 (InvÃ¡lido) | 14                   | Falla por un estudiante menos del mÃ­nimo  | Rechazo (400)          |
| Capacidad | Valor (15 a 45)      | LÃ­mite Inferior (VÃ¡lido)       | 15                   | AceptaciÃ³n con capacidad mÃ­nima exacta    | Aceptado               |
| Capacidad | Valor (15 a 45)      | LÃ­mite Inferior + 1 (VÃ¡lido)   | 16                   | AceptaciÃ³n con capacidad mÃ­nima + 1       | Aceptado               |
| Capacidad | Valor (15 a 45)      | LÃ­mite Superior - 1 (VÃ¡lido)   | 44                   | AceptaciÃ³n con capacidad mÃ¡xima - 1       | Aceptado               |
| Capacidad | Valor (15 a 45)      | LÃ­mite Superior (VÃ¡lido)       | 45                   | AceptaciÃ³n con capacidad mÃ¡xima exacta    | Aceptado               |
| Capacidad | Valor (15 a 45)      | LÃ­mite Superior + 1 (InvÃ¡lido) | 46                   | Falla por un estudiante mÃ¡s del permitido | Rechazo (400)          |

### 3.1.3 Pruebas del Camino BÃ¡sico

**Caso de Uso a validar: CU02 / POST /api/Cursos - Crear curso.**
(Aqui iba una imagen)
(Aqui iba una imagen)
**Caminos independientes identificados:**

- Camino 1: 1â†’2â†’4â†’8 - Falla: El grado indicado no existe en la base de datos.
- Camino 2: 1â†’2â†’3â†’4â†’8 - Falla: El grado existe, pero el nombre del curso viola las reglas de longitud.
- Camino 3: 1â†’2â†’3â†’5â†’6â†’8 - Rechazo: Conflicto, ya existe un curso con ese nombre en el grado.
- Camino 4: 1â†’2â†’3â†’5â†’7â†’8 - Ã‰xito: Datos vÃ¡lidos, sin duplicados, se guarda en DB y retorna 201 Created.

| **CAMINO** | **DATOS ENTRADA 1** | **DATOS ENTRADA 2** | **ESTADO PREVIO**        | **RESULTADO / ESCENARIO**                  |
| ---------- | ------------------- | ------------------- | ------------------------ | ------------------------------------------ |
| CP-CB-01   | Id: 99 (No existe)  | Id: 5 (Existe)      | No aplica                | Falla en N1. InvÃ¡lido (400 Bad Request)    |
| CP-CB-02   | Id: 1 (Existe)      | Id: 88 (No existe)  | No aplica                | Falla en N2. InvÃ¡lido (400 Bad Request)    |
| CP-CB-03   | Id: 1 (Existe)      | Id: 5 (Existe)      | Registro previo C1-E5    | Falla en N4. InvÃ¡lido (409 Conflict)       |
| CP-CB-04   | Id: 2 (Existe)      | Id: 6 (Existe)      | No existe registro C2-E6 | Pasa por N8. VÃ¡lido (201 Created y guarda) |

### 3.1.4 DiseÃ±o de Casos de Prueba

**CP-GA-CU-01**

| **Campo**          | **Detalle**                                                                       |
| ------------------ | --------------------------------------------------------------------------------- |
| DescripciÃ³n        | Crear un curso con valores en el LÃ­mite Inferior VÃ¡lido (nombre de 3 caracteres). |
| Precondiciones     | Token JWT con permisos de Administrador configurado en el Header.                 |
| Datos de entrada   | JSON: Nombre: "A10", GradoId: 1.                                                  |
| Pasos de ejecuciÃ³n | 1) Inyectar Token en Auth. 2) POST /api/Cursos. 3) Enviar DTO.                    |
| Resultado esperado | HTTP 201 Created. Registro guardado en la Base de Datos.                          |
| Resultado obtenido | HTTP 201 Created. La BD asignÃ³ un ID autoincremental al nuevo curso.              |
| Estado             | Exitoso âœ…                                                                        |
(Aqui iba una imagen)
**EjecuciÃ³n y EvaluaciÃ³n de las Pruebas:**

**DescripciÃ³n**: Crear un curso utilizando valores en el LÃ­mite Inferior VÃ¡lido (nombre de 3 caracteres).

**Precondiciones**: Poseer un Token JWT con permisos de Administrador configurado en el Header.

**Datos de entrada:** JSON con Nombre: "A10", GradoId: 1.

**Pasos de ejecuciÃ³n**: 1) Inyectar Token en Auth. 2) POST /api/Cursos. 3) Enviar DTO.

**Resultado esperado**: CÃ³digo HTTP 201 Created. Registro guardado en la Base de Datos.

**Resultado obtenido**: CÃ³digo HTTP 201 Created. La base de datos asignÃ³ un ID autoincremental al nuevo curso.

**Estado**: Exitoso âœ…

**CP-GA-CU-02**

| **Campo**          | **Detalle**                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------- |
| DescripciÃ³n        | Crear un curso con nombre demasiado corto (Bug inicial descubierto).                        |
| Precondiciones     | Token JWT vÃ¡lido.                                                                           |
| Datos de entrada   | JSON: Nombre: "A", GradoId: -1.                                                             |
| Pasos de ejecuciÃ³n | 1) POST /api/Cursos. 2) Enviar body JSON invÃ¡lido.                                          |
| Resultado esperado | HTTP 400 Bad Request con errores de validaciÃ³n en longitud y GradoId.                       |
| Resultado obtenido | Inicialmente HTTP 500. Tras parche en CursosController, retornÃ³ HTTP 400 con mensaje claro. |
| Estado             | Exitoso âœ… (Tras aplicar parche TDD)                                                        |
(Aqui iba una imagen)
**EjecuciÃ³n y EvaluaciÃ³n de las Pruebas:**

**DescripciÃ³n**: Crear un curso utilizando un nombre demasiado corto o vacÃ­o (Bug inicial descubierto).

**Precondiciones**: Poseer un Token JWT vÃ¡lido.

**Datos** **de** **entrada**: JSON con Nombre: "A", GradoId: -1.

**Pasos** **de** **ejecuciÃ³n**: 1) POST /api/Cursos. 2) Enviar body JSON invÃ¡lido.

**Resultado** **esperado**: CÃ³digo HTTP 400 Bad Request informando errores de validaciÃ³n en la longitud y el ID de grado.

**Resultado** **obtenido**: Inicialmente arrojÃ³ HTTP 500 (ExcepciÃ³n de SQL). Tras arreglar el cÃ³digo C# (CursosController), retornÃ³ de forma esperada el HTTP 400 Bad Request con mensaje de error claro.

**Estado**: Exitoso âœ… (Tras aplicar parche de cÃ³digo en TDD)

## 3.2 MÃ³dulo de EvaluaciÃ³n y Seguimiento (Notas)
(Aqui iba una imagen)
### 3.2.1 AnÃ¡lisis de Pruebas - Clases de Equivalencia

**IdentificaciÃ³n de Clases de Equivalencia:**

Campo: Valor de la Nota (Rango NumÃ©rico 0.0 - 10.0)

- \[CE-01\] VÃLIDA: NÃºmero decimal en el rango de 0.0 a 10.0 inclusive.
- \[CE-02\] INVÃLIDA: NÃºmero decimal negativo (< 0.0).
- \[CE-03\] INVÃLIDA: NÃºmero decimal mayor al mÃ¡ximo permitido (> 10.0).
- \[CE-04\] INVÃLIDA: Ausencia de valor o tipo de dato incorrecto (letras, null).

Campo: Comentario (Longitud Opcional 0 - 200)

- \[CE-05\] VÃLIDA: Cadena de texto vacÃ­a, nula o con longitud de 1 a 200 caracteres.
- \[CE-06\] INVÃLIDA: Cadena de texto con longitud mayor a 200 caracteres.

Campo: EstudianteId (Clave ForÃ¡nea)

- \[CE-07\] VÃLIDA: NÃºmero entero > 0 que referencia a un estudiante existente.
- \[CE-08\] INVÃLIDA: NÃºmero entero > 0 que NO existe en la base de datos.
- \[CE-09\] INVÃLIDA: Cero, nÃºmeros negativos o tipos de datos incorrectos.

### Tabla de Casos de Prueba - Equivalencia

| **ID Caso** | **DescripciÃ³n**                       | **Valor** | **Comentario**   | **EstudianteId** | **Clases Cubiertas** | **Resultado Esperado**            |
| ----------- | ------------------------------------- | --------- | ---------------- | ---------------- | -------------------- | --------------------------------- |
| CP-EQ-01    | Registro de nota exitoso              | 7.5       | "Buen desempeÃ±o" | 5                | CE-01, CE-05, CE-07  | Ã‰xito: Nota guardada (201)        |
| CP-EQ-02    | Registro exitoso sin comentario       | 10.0      | \[VacÃ­o\]        | 12               | CE-01, CE-05, CE-07  | Ã‰xito: Nota guardada (201)        |
| CP-EQ-03    | Falla por nota negativa               | \-1.5     | "Mala conducta"  | 3                | CE-02, CE-05, CE-07  | Falla: Nota mÃ­nima 0.0 (400)      |
| CP-EQ-04    | Falla por nota superior al mÃ¡ximo     | 11.0      | "Excelente"      | 8                | CE-03, CE-05, CE-07  | Falla: Nota mÃ¡xima 10.0 (400)     |
| CP-EQ-05    | Falla por dato no numÃ©rico            | "Ocho"    | "Falta texto"    | 9                | CE-04, CE-05, CE-07  | Falla: Error de formato (400)     |
| CP-EQ-06    | Falla por exceder longitud comentario | 5.0       | Cadena 201 chars | 1                | CE-01, CE-06, CE-07  | Falla: MÃ¡ximo 200 caracteres      |
| CP-EQ-07    | Falla por Estudiante inexistente      | 8.0       | "Buen trabajo"   | 9999             | CE-01, CE-05, CE-08  | Falla: Estudiante no existe (404) |
| CP-EQ-08    | Falla por EstudianteId invÃ¡lido       | 4.5       | "Reprobado"      | \-2              | CE-01, CE-05, CE-09  | Falla: ID invÃ¡lido (400)          |

### 3.2.2 AnÃ¡lisis de Pruebas - Valores LÃ­mite

| **CAMPO**  | **Regla de Negocio** | **Tipo de LÃ­mite**             | **Datos de Entrada** | **Escenario Evaluado**                  | **Resultado Esperado** |
| ---------- | -------------------- | ------------------------------ | -------------------- | --------------------------------------- | ---------------------- |
| Valor      | Rango (0.0 a 10.0)   | LÃ­mite Inferior - 1 (InvÃ¡lido) | \-0.1                | Falla justo por debajo del cero         | Rechazo (400)          |
| Valor      | Rango (0.0 a 10.0)   | LÃ­mite Inferior (VÃ¡lido)       | 0.0                  | AceptaciÃ³n con nota mÃ­nima posible      | Aceptado               |
| Valor      | Rango (0.0 a 10.0)   | LÃ­mite Inferior + 1 (VÃ¡lido)   | 0.1                  | AceptaciÃ³n de la nota mÃ­nima no nula    | Aceptado               |
| Valor      | Rango (0.0 a 10.0)   | LÃ­mite Superior - 1 (VÃ¡lido)   | 9.9                  | AceptaciÃ³n al borde de la nota perfecta | Aceptado               |
| Valor      | Rango (0.0 a 10.0)   | LÃ­mite Superior (VÃ¡lido)       | 10.0                 | AceptaciÃ³n con nota mÃ¡xima exacta       | Aceptado               |
| Valor      | Rango (0.0 a 10.0)   | LÃ­mite Superior + 1 (InvÃ¡lido) | 10.1                 | Falla justo por encima del mÃ¡ximo       | Rechazo (400)          |
| Comentario | Longitud (0 a 200)   | LÃ­mite Inferior (VÃ¡lido)       | "" (0 chars)         | AceptaciÃ³n de string vacÃ­o              | Aceptado               |
| Comentario | Longitud (0 a 200)   | LÃ­mite Inferior + 1 (VÃ¡lido)   | "A" (1 char)         | AceptaciÃ³n de string de 1 caracter      | Aceptado               |
| Comentario | Longitud (0 a 200)   | LÃ­mite Superior - 1 (VÃ¡lido)   | Cadena 199 chars     | AceptaciÃ³n justo debajo del lÃ­mite      | Aceptado               |
| Comentario | Longitud (0 a 200)   | LÃ­mite Superior (VÃ¡lido)       | Cadena 200 chars     | AceptaciÃ³n en el lÃ­mite exacto          | Aceptado               |
| Comentario | Longitud (0 a 200)   | LÃ­mite Superior + 1 (InvÃ¡lido) | Cadena 201 chars     | Falla provocando desbordamiento         | Rechazo (400)          |

### 3.2.3 Pruebas del Camino BÃ¡sico

**Caso de Uso a validar: CU04 / PUT /api/Notas - Registrar/actualizar calificaciÃ³n.**
(Aqui iba una imagen)
(Aqui iba una imagen)
**Caminos independientes identificados:**

- Camino 1: 1â†’2â†’3â†’12 - Falla: La configuraciÃ³n de nota no existe en BD.
- Camino 2: 1â†’2â†’4â†’5â†’6â†’12 - Falla: El Estudiante enviado no existe en BD.
- Camino 3: 1â†’2â†’4â†’5â†’7â†’8â†’9â†’11â†’12 - Ã‰xito - InserciÃ³n: Se CREA la nota nueva.
- Camino 4: 1â†’2â†’4â†’5â†’7â†’8â†’10â†’11â†’12 - Ã‰xito - ActualizaciÃ³n: Se MODIFICA el valor existente.

| **CAMINO** | **DATOS ENTRADA 1** | **DATOS ENTRADA 2** | **ESTADO PREVIO**       | **RESULTADO / ESCENARIO**                                              |
| ---------- | ------------------- | ------------------- | ----------------------- | ---------------------------------------------------------------------- |
| CP-CB-01   | Id: 99 (No existe)  | Id: 5 (Existe)      | N/A                     | InvÃ¡lido: Falla en notaConfig. Retorna 404 Not Found.                  |
| CP-CB-02   | Id: 2 (Existe)      | Id: 88 (No existe)  | N/A                     | InvÃ¡lido: Falla en estudiante. Retorna 404 Not Found.                  |
| CP-CB-03   | Id: 3 (Existe)      | Id: 6 (Existe)      | NULL (VacÃ­o)            | VÃ¡lido: existing == null. Se agrega nueva calificaciÃ³n (Inserta).      |
| CP-CB-04   | Id: 4 (Existe)      | Id: 7 (Existe)      | Registro con Valor: 5.0 | VÃ¡lido: existing != null. Se sobreescribe la calificaciÃ³n (Actualiza). |

### 3.2.4 DiseÃ±o de Casos de Prueba

**CP-ES-CN-01**

| **Campo**          | **Detalle**                                                                        |
| ------------------ | ---------------------------------------------------------------------------------- |
| DescripciÃ³n        | Registrar o actualizar una calificaciÃ³n en el LÃ­mite Superior exacto de la escala. |
| Precondiciones     | EstudianteId y NotaConfigId deben existir. Token vÃ¡lido.                           |
| Datos de entrada   | JSON: Valor: 5.0, EstudianteId: 172, NotaConfigId: 428.                            |
| Pasos de ejecuciÃ³n | 1) Configurar PUT /api/Notas. 2) Enviar el body en JSON con el valor 5.0.          |
| Resultado esperado | HTTP 200 OK informando la actualizaciÃ³n exitosa.                                   |
| Resultado obtenido | CÃ³digo 200 OK. La nota se guardÃ³ correctamente con el valor mÃ¡ximo.                |
| Estado             | Exitoso âœ…                                                                         |
(Aqui iba una imagen)
**EjecuciÃ³n y EvaluaciÃ³n de las Pruebas**

**DescripciÃ³n**: Registrar o actualizar una calificaciÃ³n en el LÃ­mite Superior exacto de la escala.

**Precondiciones**: EstudianteId y NotaConfigId deben existir. Token vÃ¡lido asignado.

**Datos de entrada**: JSON con Valor: 5.0, EstudianteId: 172, NotaConfigId: 428.

**Pasos de ejecuciÃ³n**: 1) Configurar PUT /api/Notas. 2) Enviar el body en JSON con el valor 5.0.

**Resultado esperado**: CÃ³digo HTTP 200 OK informando la actualizaciÃ³n exitosa.

**Resultado obtenido**: CÃ³digo 200 OK. La nota se guardÃ³ correctamente con el valor mÃ¡ximo.

**Estado**: Exitoso âœ…

**CP-ES-CN-02**

| **Campo**          | **Detalle**                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| DescripciÃ³n        | Rechazo de calificaciÃ³n con valor negativo fuera de la escala.                                        |
| Precondiciones     | PKs vÃ¡lidas en DB. Token activo.                                                                      |
| Datos de entrada   | JSON: Valor: -1.5, EstudianteId: 172, NotaConfigId: 428.                                              |
| Pasos de ejecuciÃ³n | 1) Configurar PUT /api/Notas. 2) Enviar body con valor de nota negativo.                              |
| Resultado esperado | HTTP 400 Bad Request por violaciÃ³n de regla de negocio.                                               |
| Resultado obtenido | Inicialmente arrojÃ³ 200 OK (Falso positivo/Bug). Tras parche en NotasController.cs, retornÃ³ HTTP 400. |
| Estado             | Exitoso âœ… (Tras aplicar parche TDD)                                                                  |
(Aqui iba una imagen)
**EjecuciÃ³n y EvaluaciÃ³n de las Pruebas**

**DescripciÃ³n**: Rechazo de calificaciÃ³n con valor negativo fuera de la escala (Fuera del LÃ­mite Inferior).

**Precondiciones**: PKs vÃ¡lidas en DB. Token activo.

**Datos de entrada**: JSON con Valor: -1.5, EstudianteId: 172, NotaConfigId: 428.

**Pasos de ejecuciÃ³n**: 1) Configurar PUT /api/Notas. 2) Enviar body con valor de nota negativo.

**Resultado esperado**: CÃ³digo HTTP 400 Bad Request por violaciÃ³n de regla de negocio (Nota debe ser entre 0.0 y 5.0).

**Resultado obtenido**: Inicialmente arrojÃ³ 200 OK (Falso positivo/Bug). Tras aplicar el parche en NotasController.cs, la prueba retornÃ³ correctamente el HTTP 400 Bad Request.

**Estado**: Exitoso âœ… (Tras aplicar parche de cÃ³digo en TDD)

## 3.3 MÃ³dulo de Seguridad y Usuarios (AutenticaciÃ³n)
(Aqui iba una imagen)
### 3.3.1 AnÃ¡lisis de Pruebas - Clases de Equivalencia

Campo: Correo ElectrÃ³nico (Email)

- \[CE-01\] VÃLIDA: Cadena de 5 a 50 caracteres, formato de correo vÃ¡lido, y existe en BD.
- \[CE-02\] INVÃLIDA: Cadena vacÃ­a o nula.
- \[CE-03\] INVÃLIDA: Formato de correo incorrecto (sin @, sin dominio).
- \[CE-04\] INVÃLIDA: Correo con formato vÃ¡lido pero NO registrado en el sistema.

Campo: ContraseÃ±a (Password)

- \[CE-05\] VÃLIDA: Cadena de 8 a 20 caracteres que coincide con el Email provisto.
- \[CE-06\] INVÃLIDA: Cadena vacÃ­a o nula.
- \[CE-07\] INVÃLIDA: Cadena menor a 8 caracteres.
- \[CE-08\] INVÃLIDA: Cadena mayor a 20 caracteres.
- \[CE-09\] INVÃLIDA: Cadena de longitud vÃ¡lida pero incorrecta para el Email provisto.

| **ID Caso** | **DescripciÃ³n**                 | **Email**            | **Password**     | **Clases Cubiertas** | **Resultado Esperado**                |
| ----------- | ------------------------------- | -------------------- | ---------------- | -------------------- | ------------------------------------- |
| CP-AU-EQ-01 | Inicio de sesiÃ³n exitoso        | <admin@edutrack.com> | Abc12345         | CE-01, CE-05         | Ã‰xito: Retorna Token JWT (200 OK)     |
| CP-AU-EQ-02 | Falla por campos vacÃ­os         | \[VacÃ­o\]            | \[VacÃ­o\]        | CE-02, CE-06         | Falla: Campos requeridos (400)        |
| CP-AU-EQ-03 | Falla por formato de correo     | admin_edutrack.com   | Abc12345         | CE-03, CE-05         | Falla: Email invÃ¡lido (400)           |
| CP-AU-EQ-04 | Falla por usuario no registrado | <fake@edutrack.com>  | Abc12345         | CE-04, CE-05         | Falla: Credenciales incorrectas (401) |
| CP-AU-EQ-05 | Falla por password muy corto    | <admin@edutrack.com> | 12345            | CE-01, CE-07         | Falla: MÃ­nimo 8 caracteres (400)      |
| CP-AU-EQ-06 | Falla por password muy largo    | <admin@edutrack.com> | A x 21 chars     | CE-01, CE-08         | Falla: MÃ¡ximo 20 caracteres (400)     |
| CP-AU-EQ-07 | Falla por password incorrecto   | <admin@edutrack.com> | ClaveEquivocada1 | CE-01, CE-09         | Falla: Credenciales incorrectas (401) |

### 3.3.2 AnÃ¡lisis de Pruebas - Valores LÃ­mite

| **CAMPO** | **Regla de Negocio** | **Tipo de LÃ­mite**             | **Datos de Entrada**    | **Escenario Evaluado**                 | **Resultado Esperado** |
| --------- | -------------------- | ------------------------------ | ----------------------- | -------------------------------------- | ---------------------- |
| Email     | Longitud (5 a 50)    | LÃ­mite Inferior - 1 (InvÃ¡lido) | a@b. (4 chars)          | Falla justo debajo del mÃ­nimo          | Rechazo (400)          |
| Email     | Longitud (5 a 50)    | LÃ­mite Inferior (VÃ¡lido)       | <a@b.c> (5 chars)       | AceptaciÃ³n en el mÃ­nimo estricto       | Aceptado               |
| Email     | Longitud (5 a 50)    | LÃ­mite Inferior + 1 (VÃ¡lido)   | <ab@b.c> (6 chars)      | AceptaciÃ³n justo por encima del mÃ­nimo | Aceptado               |
| Email     | Longitud (5 a 50)    | LÃ­mite Superior - 1 (VÃ¡lido)   | Cadena 49 chars (email) | AceptaciÃ³n justo por debajo del lÃ­mite | Aceptado               |
| Email     | Longitud (5 a 50)    | LÃ­mite Superior (VÃ¡lido)       | Cadena 50 chars (email) | AceptaciÃ³n en el lÃ­mite exacto         | Aceptado               |
| Email     | Longitud (5 a 50)    | LÃ­mite Superior + 1 (InvÃ¡lido) | Cadena 51 chars (email) | Falla por exceder el mÃ¡ximo            | Rechazo (400)          |
| Password  | Longitud (8 a 20)    | LÃ­mite Inferior - 1 (InvÃ¡lido) | Cadena 7 chars          | Falla por un caracter menos del mÃ­nimo | Rechazo (400)          |
| Password  | Longitud (8 a 20)    | LÃ­mite Inferior (VÃ¡lido)       | Cadena 8 chars          | AceptaciÃ³n con longitud mÃ­nima exacta  | Aceptado               |
| Password  | Longitud (8 a 20)    | LÃ­mite Inferior + 1 (VÃ¡lido)   | Cadena 9 chars          | AceptaciÃ³n con longitud mÃ­nima + 1     | Aceptado               |
| Password  | Longitud (8 a 20)    | LÃ­mite Superior - 1 (VÃ¡lido)   | Cadena 19 chars         | AceptaciÃ³n con longitud mÃ¡xima - 1     | Aceptado               |
| Password  | Longitud (8 a 20)    | LÃ­mite Superior (VÃ¡lido)       | Cadena 20 chars         | AceptaciÃ³n con longitud mÃ¡xima exacta  | Aceptado               |
| Password  | Longitud (8 a 20)    | LÃ­mite Superior + 1 (InvÃ¡lido) | Cadena 21 chars         | Falla al traspasar el lÃ­mite superior  | Rechazo (400)          |

### 3.3.3 Pruebas del Camino BÃ¡sico

**Caso de Uso a validar: CU01 / POST /api/Auth/login - Inicio de sesiÃ³n.**
(Aqui iba una imagen)
(Aqui iba una imagen)
**Caminos independientes identificados:**

- Camino 1: N1â†’N2â†’N3â†’N9 - Falla por usuario inexistente en la base de datos.
- Camino 2: N1â†’N2â†’N4â†’N5â†’N6â†’N9 - Falla por contraseÃ±a incorrecta, el usuario sÃ­ existÃ­a.
- Camino 3: N1â†’N2â†’N4â†’N5â†’N7â†’N8â†’N9 - Inicio de sesiÃ³n exitoso.

| **CAMINO**  | **DATOS ENTRADA 1** | **DATOS ENTRADA 2** | **ESTADO PREVIO**           | **RESULTADO / ESCENARIO**                                                                 |
| ----------- | ------------------- | ------------------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| CP-AU-CB-01 | usuarioFantasma     | CualquierClave      | No existe registro          | InvÃ¡lido: Falla en persona == null. Retorna 400 "Credenciales invÃ¡lidas".                 |
| CP-AU-CB-02 | admin_real          | ClaveEquivocada     | Existe con Hash distinto    | InvÃ¡lido: Supera N2 pero falla en N5 (Verify Hash). Retorna 400 "Credenciales invÃ¡lidas". |
| CP-AU-CB-03 | docente_juan        | Docente1234         | Existe con Hash coincidente | VÃ¡lido: Pasa todas las validaciones. Genera JWT y retorna 200 OK con Token.               |
(Aqui iba una imagen)
**EjecuciÃ³n y EvaluaciÃ³n de las Pruebas**

**DescripciÃ³n**: Validar el inicio de sesiÃ³n (Happy Path) con credenciales autorizadas.

**Precondiciones**: El usuario debe existir en la base de datos y la API debe estar en ejecuciÃ³n.

**Datos de entrada**: JSON con Correo vÃ¡lido y Password correcta.

**Pasos de ejecuciÃ³n**: 1) Configurar Endpoint POST /api/Auth/login. 2) Agregar body en crudo (JSON). 3) Enviar peticiÃ³n. 4) Ejecutar aserciones de Postman.

**Resultado esperado**: CÃ³digo HTTP 200 OK y retorno de un Token JWT estructuralmente vÃ¡lido.

**Resultado obtenido**: CÃ³digo HTTP 200 OK. Token devuelto y asignado exitosamente a la variable de entorno {{token}}.

**Estado**: Exitoso âœ…

### 3.3.4 DiseÃ±o de Casos de Prueba

**CP-AU-LO-01**

| **Campo**          | **Detalle**                                                                   |
| ------------------ | ----------------------------------------------------------------------------- |
| DescripciÃ³n        | Validar el inicio de sesiÃ³n (Happy Path) con credenciales autorizadas.        |
| Precondiciones     | El usuario debe existir en la base de datos y la API debe estar en ejecuciÃ³n. |
| Datos de entrada   | JSON con Correo vÃ¡lido y Password correcta.                                   |
| Pasos de ejecuciÃ³n | 1) Configurar POST /api/Auth/login. 2) Agregar body JSON. 3) Enviar peticiÃ³n. |
| Resultado esperado | HTTP 200 OK y retorno de un Token JWT estructuralmente vÃ¡lido.                |
| Resultado obtenido | HTTP 200 OK. Token devuelto y asignado exitosamente a la variable {{token}}.  |
| Estado             | Exitoso âœ…                                                                    |
(Aqui iba una imagen)
**EjecuciÃ³n y EvaluaciÃ³n de las Pruebas**

**DescripciÃ³n**: Validar denegaciÃ³n de acceso con contraseÃ±a incorrecta (Clase de Equivalencia InvÃ¡lida).

**Precondiciones**: La API debe estar en ejecuciÃ³n.

**Datos de entrada**: JSON con Correo vÃ¡lido y Password con un error tipogrÃ¡fico.

**Pasos de ejecuciÃ³n**: 1) Configurar Endpoint POST /api/Auth/login. 2) Enviar credenciales errÃ³neas. 3) Validar el cÃ³digo de error.

**Resultado esperado**: CÃ³digo HTTP 401 Unauthorized o 400 Bad Request indicando credenciales invÃ¡lidas.

**Resultado obtenido**: CÃ³digo HTTP 400/401 devuelto correctamente por el backend, bloqueando el acceso.

**Estado**: Exitoso âœ…

## 3.4 MÃ³dulo de Portales de Usuario (Portal Estudiante)
(Aqui iba una imagen)
### 3.4.1 AnÃ¡lisis de Pruebas - Clases de Equivalencia

Campo: EstudianteId

- \[CE-01\] VÃLIDA: NÃºmero entero positivo (> 0) que existe en el sistema.
- \[CE-02\] INVÃLIDA: NÃºmero entero positivo que NO existe en la base de datos.
- \[CE-03\] INVÃLIDA: Cero o nÃºmero entero negativo (<= 0).
- \[CE-04\] INVÃLIDA: Ausencia de valor o tipo de dato incorrecto.

Campo: Periodo AcadÃ©mico

- \[CE-05\] VÃLIDA: NÃºmero entero en el rango de 1 a 4 inclusive.
- \[CE-06\] INVÃLIDA: NÃºmero entero menor a 1.
- \[CE-07\] INVÃLIDA: NÃºmero entero mayor a 4.
- \[CE-08\] INVÃLIDA: Ausencia de valor o tipo de dato no entero.

| **ID Caso** | **DescripciÃ³n**                     | **EstudianteId** | **Periodo** | **Clases Cubiertas** | **Resultado Esperado**                    |
| ----------- | ----------------------------------- | ---------------- | ----------- | -------------------- | ----------------------------------------- |
| CP-PT-EQ-01 | Consulta exitosa del boletÃ­n        | 15               | 2           | CE-01, CE-05         | Ã‰xito: Retorna JSON con notas (200 OK)    |
| CP-PT-EQ-02 | Falla por periodo debajo del rango  | 10               | 0           | CE-01, CE-06         | Falla: Periodo debe ser entre 1 y 4 (400) |
| CP-PT-EQ-03 | Falla por periodo encima del rango  | 8                | 5           | CE-01, CE-07         | Falla: Periodo no vÃ¡lido (400)            |
| CP-PT-EQ-04 | Falla por estudiante inexistente    | 999              | 1           | CE-02, CE-05         | Falla: Estudiante no encontrado (404)     |
| CP-PT-EQ-05 | Falla por ID de estudiante negativo | \-5              | 3           | CE-03, CE-05         | Falla: ID de estudiante invÃ¡lido (400)    |
| CP-PT-EQ-06 | Falla por tipo de dato incorrecto   | "A"              | "B"         | CE-04, CE-08         | Falla: Error de formato (400)             |

### 3.4.2 AnÃ¡lisis de Pruebas - Valores LÃ­mite

| **CAMPO**    | **Regla de Negocio** | **Tipo de LÃ­mite**             | **Datos de Entrada** | **Escenario Evaluado**                  | **Resultado Esperado** |
| ------------ | -------------------- | ------------------------------ | -------------------- | --------------------------------------- | ---------------------- |
| EstudianteId | Valor Positivo (> 0) | LÃ­mite Inferior - 1 (InvÃ¡lido) | 0                    | Falla al enviar el cero absoluto        | Rechazo (400)          |
| EstudianteId | Valor Positivo (> 0) | LÃ­mite Inferior (VÃ¡lido)       | 1                    | AceptaciÃ³n del primer registro posible  | Aceptado               |
| EstudianteId | Valor Positivo (> 0) | LÃ­mite Inferior + 1 (VÃ¡lido)   | 2                    | AceptaciÃ³n del segundo registro de BD   | Aceptado               |
| Periodo      | Rango (1 a 4)        | LÃ­mite Inferior - 1 (InvÃ¡lido) | 0                    | Falla justo debajo del primer periodo   | Rechazo (400)          |
| Periodo      | Rango (1 a 4)        | LÃ­mite Inferior (VÃ¡lido)       | 1                    | AceptaciÃ³n del mÃ­nimo estricto          | Aceptado               |
| Periodo      | Rango (1 a 4)        | LÃ­mite Inferior + 1 (VÃ¡lido)   | 2                    | AceptaciÃ³n por encima del mÃ­nimo        | Aceptado               |
| Periodo      | Rango (1 a 4)        | LÃ­mite Superior - 1 (VÃ¡lido)   | 3                    | AceptaciÃ³n por debajo del cierre anual  | Aceptado               |
| Periodo      | Rango (1 a 4)        | LÃ­mite Superior (VÃ¡lido)       | 4                    | AceptaciÃ³n en el lÃ­mite mÃ¡ximo          | Aceptado               |
| Periodo      | Rango (1 a 4)        | LÃ­mite Superior + 1 (InvÃ¡lido) | 5                    | Falla por exceder el mÃ¡ximo de periodos | Rechazo (400)          |

### 3.4.3 Pruebas del Camino BÃ¡sico

**Caso de Uso a validar: CU05 / GET /api/PortalEstudiante/resumen.**
(Aqui iba una imagen)
(Aqui iba una imagen)
**Caminos independientes identificados:**

- Camino 1: N1â†’N2â†’N3â†’N10 - Falla: El ID del Token no corresponde a ningÃºn estudiante.
- Camino 2: N1â†’N2â†’N4â†’N5â†’N9â†’N10 - Parcial: Estudiante existe pero sin inscripciones, retorna Dashboard vacÃ­o.
- Camino 3: N1â†’N2â†’N4â†’N5â†’N6â†’N7â†’N9â†’N10 - Parcial: Inscrito en curso pero sin notas registradas.
- Camino 4: N1â†’N2â†’N4â†’N5â†’N6â†’N7â†’N8â†’N9â†’N10 - Ã‰xito: Estudiante vÃ¡lido, inscrito, con notas. Calcula promedio.

### 3.4.4 DiseÃ±o de Casos de Prueba

**CP-PE-RE-01**

| **Campo**          | **Detalle**                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| DescripciÃ³n        | Validar acceso no autorizado al Dashboard si el rol del usuario no coincide.                      |
| Precondiciones     | Token JWT vÃ¡lido pero de un Rol distinto a "estudiante" (Ej: Administrador).                      |
| Datos de entrada   | Solicitud GET sin Body. Token adjunto en el Header.                                               |
| Pasos de ejecuciÃ³n | 1) Configurar GET /api/PortalEstudiante/resumen. 2) Enviar solicitud con sesiÃ³n de Administrador. |
| Resultado esperado | HTTP 403 Forbidden por no contar con la directiva \[Authorize(Roles = "estudiante")\].            |
| Resultado obtenido | HTTP 403 Forbidden. El servidor denegÃ³ el acceso protegiendo el panel del estudiante.             |
| Estado             | Exitoso âœ…                                                                                        |
(Aqui iba una imagen)
**EjecuciÃ³n y EvaluaciÃ³n de las Pruebas**

**DescripciÃ³n**: Validar acceso no autorizado al Dashboard si el rol del usuario no coincide.

**Precondiciones**: Tener un token JWT vÃ¡lido pero que pertenezca a un Rol distinto a "estudiante" (Ej: Administrador).

**Datos de entrada**: Solicitud GET sin Body. Token adjunto en el Header.

**Pasos de ejecuciÃ³n**: 1) Configurar GET /api/PortalEstudiante/resumen. 2) Enviar solicitud con la sesiÃ³n del Administrador.

**Resultado esperado**: CÃ³digo HTTP 403 Forbidden por no contar con la directiva \[Authorize(Roles = "estudiante")\].

**Resultado obtenido**: CÃ³digo HTTP 403 Forbidden. El servidor denegÃ³ el acceso protegiendo el panel del estudiante.

**Estado**: Exitoso âœ…

## 3.5 MÃ³dulo de Comunicaciones y Notificaciones
(Aqui iba una imagen)
### 3.5.1 AnÃ¡lisis de Pruebas - Clases de Equivalencia

Campo: TÃ­tulo del Mensaje

- \[CE-01\] VÃLIDA: Cadena de texto de longitud entre 5 y 100 caracteres.
- \[CE-02\] INVÃLIDA: Cadena vacÃ­a o nula.
- \[CE-03\] INVÃLIDA: Cadena con longitud entre 1 y 4 caracteres.
- \[CE-04\] INVÃLIDA: Cadena de mÃ¡s de 100 caracteres.

Campo: Cuerpo del Mensaje

- \[CE-05\] VÃLIDA: Cadena de texto de longitud entre 10 y 1000 caracteres.
- \[CE-06\] INVÃLIDA: Cadena vacÃ­a, nula o muy corta (menos de 10 caracteres).
- \[CE-07\] INVÃLIDA: Cadena excediendo el mÃ¡ximo de 1000 caracteres.

Campo: Tipo de NotificaciÃ³n

- \[CE-08\] VÃLIDA: String que coincida exactamente con "Informativo", "Alerta" o "Urgente".
- \[CE-09\] INVÃLIDA: Cualquier otro texto, nÃºmero, nulo o vacÃ­o.

Campo: Destinatario (EstudianteId)

- \[CE-10\] VÃLIDA: NÃºmero entero > 0 que existe en la BD.
- \[CE-11\] INVÃLIDA: Cero, negativo o tipo de dato incorrecto (texto).

| **ID Caso** | **DescripciÃ³n**                   | **TÃ­tulo**         | **Mensaje**           | **Tipo**      | **DestinatarioId** | **Clases Cubiertas**       |
| ----------- | --------------------------------- | ------------------ | --------------------- | ------------- | ------------------ | -------------------------- |
| CP-CN-EQ-01 | EnvÃ­o exitoso de comunicado       | "Aviso de reuniÃ³n" | "Estimados padres..." | "Informativo" | 12                 | CE-01, CE-05, CE-08, CE-10 |
| CP-CN-EQ-02 | Falla por campos vacÃ­os           | \[VacÃ­o\]          | \[VacÃ­o\]             | "Alerta"      | 5                  | CE-02, CE-06, CE-08, CE-10 |
| CP-CN-EQ-03 | Falla por TÃ­tulo y Mensaje cortos | "Hola"             | "Prueba 1"            | "Urgente"     | 8                  | CE-03, CE-06, CE-08, CE-10 |
| CP-CN-EQ-04 | Falla por TÃ­tulo excedido         | \> 100 chars       | "Contenido base"      | "Informativo" | 1                  | CE-04, CE-05, CE-08, CE-10 |
| CP-CN-EQ-05 | Falla por Tipo no permitido       | "Cambio Horario"   | "Las clases..."       | "Aviso"       | 20                 | CE-01, CE-05, CE-09, CE-10 |
| CP-CN-EQ-06 | Falla por Destinatario ilegal     | "CitaciÃ³n"         | "Acercarse..."        | "Urgente"     | \-5                | CE-01, CE-05, CE-08, CE-11 |

### 3.5.2 AnÃ¡lisis de Pruebas - Valores LÃ­mite

| **CAMPO** | **Regla de Negocio** | **Tipo de LÃ­mite**             | **Datos de Entrada**    | **Escenario Evaluado**                   | **Resultado Esperado** |
| --------- | -------------------- | ------------------------------ | ----------------------- | ---------------------------------------- | ---------------------- |
| TÃ­tulo    | Longitud (5 a 100)   | LÃ­mite Inferior - 1 (InvÃ¡lido) | "Hola" (4 chars)        | Falla justo debajo del mÃ­nimo del tÃ­tulo | Rechazo (400)          |
| TÃ­tulo    | Longitud (5 a 100)   | LÃ­mite Inferior (VÃ¡lido)       | "Falta" (5 chars)       | AceptaciÃ³n en el tamaÃ±o mÃ­nimo           | Aceptado               |
| TÃ­tulo    | Longitud (5 a 100)   | LÃ­mite Inferior + 1 (VÃ¡lido)   | "Avisos" (6 chars)      | AceptaciÃ³n justo por encima del mÃ­nimo   | Aceptado               |
| TÃ­tulo    | Longitud (5 a 100)   | LÃ­mite Superior - 1 (VÃ¡lido)   | Cadena 99 chars         | AceptaciÃ³n acercÃ¡ndose al borde mÃ¡ximo   | Aceptado               |
| TÃ­tulo    | Longitud (5 a 100)   | LÃ­mite Superior (VÃ¡lido)       | Cadena 100 chars        | AceptaciÃ³n en el tamaÃ±o mÃ¡ximo exacto    | Aceptado               |
| TÃ­tulo    | Longitud (5 a 100)   | LÃ­mite Superior + 1 (InvÃ¡lido) | Cadena 101 chars        | Falla en el lÃ­mite configurado           | Rechazo (400)          |
| Mensaje   | Longitud (10 a 1000) | LÃ­mite Inferior - 1 (InvÃ¡lido) | "Cualquier" (9 chars)   | Falla por debajo del contenido mÃ­nimo    | Rechazo (400)          |
| Mensaje   | Longitud (10 a 1000) | LÃ­mite Inferior (VÃ¡lido)       | "Sin clases" (10 chars) | AceptaciÃ³n con longitud mÃ­nima           | Aceptado               |
| Mensaje   | Longitud (10 a 1000) | LÃ­mite Superior - 1 (VÃ¡lido)   | Cadena 999 chars        | AceptaciÃ³n cerca del desbordamiento      | Aceptado               |
| Mensaje   | Longitud (10 a 1000) | LÃ­mite Superior (VÃ¡lido)       | Cadena 1000 chars       | AceptaciÃ³n del lÃ­mite exacto             | Aceptado               |
| Mensaje   | Longitud (10 a 1000) | LÃ­mite Superior + 1 (InvÃ¡lido) | Cadena 1001 chars       | Falla preventiva del servidor            | Rechazo (400)          |

### 3.5.3 Pruebas del Camino BÃ¡sico

**Caso de Uso a validar: CU06 / POST /api/Comunicaciones - Enviar comunicado.**
(Aqui iba una imagen)
(Aqui iba una imagen)
**Caminos independientes identificados:**

- Camino 1: N1â†’N2â†’N3â†’N9 - Falla: EstudianteId no existe en el sistema.
- Camino 2: N1â†’N2â†’N4â†’N5â†’N9 - Falla: Estudiante existe pero el tÃ­tulo viola las reglas de longitud.
- Camino 3: N1â†’N2â†’N4â†’N6â†’N7â†’N9 - Falla: El Tipo de mensaje no corresponde a las opciones estandarizadas.
- Camino 4: N1â†’N2â†’N4â†’N6â†’N8â†’N9 - Ã‰xito: El payload sortea todas las validaciones y el sistema notifica.

| **CAMINO**  | **DATOS ENTRADA 1**   | **DATOS ENTRADA 2**         | **ESTADO PREVIO**        | **RESULTADO / ESCENARIO**                                          |
| ----------- | --------------------- | --------------------------- | ------------------------ | ------------------------------------------------------------------ |
| CP-CN-CB-01 | Id: 999 (Inexistente) | "Aviso importante" (VÃ¡lido) | "Informativo" (VÃ¡lido)   | InvÃ¡lido: Falla en estudiante == null. Retorna 404.                |
| CP-CN-CB-02 | Id: 10 (Existe)       | "A" (Solo 1 char)           | "Alerta" (VÃ¡lido)        | InvÃ¡lido: Pasa N2 pero falla lÃ­mites en N4. Retorna 400.           |
| CP-CN-CB-03 | Id: 10 (Existe)       | "ReuniÃ³n General" (VÃ¡lido)  | "Familiar" (Inexistente) | InvÃ¡lido: Pasa N2 y N4. Falla en N6. Retorna 400.                  |
| CP-CN-CB-04 | Id: 10 (Existe)       | "ReuniÃ³n General" (VÃ¡lido)  | "Urgente" (VÃ¡lido)       | VÃ¡lido: Pasa todas las compuertas. Crea registro y retorna 200 OK. |

### 3.5.4 DiseÃ±o de Casos de Prueba

**CP-CO-EN-01**

| **Campo**          | **Detalle**                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| DescripciÃ³n        | EnvÃ­o de una comunicaciÃ³n a todos los estudiantes de un curso vÃ¡lido.                                |
| Precondiciones     | Token JWT activo. El curso especificado debe tener entidades previas.                                |
| Datos de entrada   | JSON con Titulo, Mensaje y CursoId vÃ¡lido numÃ©rico. EstudianteIds vacÃ­o.                             |
| Pasos de ejecuciÃ³n | 1) Configurar POST /api/Comunicaciones. 2) Enviar el payload con la estructura CrearComunicacionDTO. |
| Resultado esperado | HTTP 200/201. ComunicaciÃ³n creada y enrutada hacia la lista de asignados.                            |
| Resultado obtenido | CÃ³digo 200 OK tras corregir el mapeo ("Asunto" -> "Titulo"). NotificaciÃ³n registrada.                |
| Estado             | Exitoso âœ…                                                                                           |
(Aqui iba una imagen)
**EjecuciÃ³n y EvaluaciÃ³n de las Pruebas**

**DescripciÃ³n**: EnvÃ­o de una comunicaciÃ³n a todos los estudiantes de un curso vÃ¡lido.

**Precondiciones**: Token JWT activo. El curso especificado debe tener entidades previas.

**Datos de entrada**: JSON con Titulo, Mensaje, y un CursoId vÃ¡lido numÃ©rico. EstudianteIds vacÃ­o.

**Pasos de ejecuciÃ³n**: 1) Configurar POST /api/Comunicaciones. 2) Enviar el payload con la estructura CrearComunicacionDTO.

**Resultado esperado**: CÃ³digo HTTP 200/201. CreaciÃ³n de la comunicaciÃ³n y enrutamiento hacia la lista de asignados.

**Resultado obtenido**: CÃ³digo 200 OK tras corregir el mapeo de la propiedad ("Asunto" -> "Titulo"). NotificaciÃ³n registrada.

**Estado**: Exitoso âœ…

# 4\. PRUEBAS DE INTEGRACIÃ“N

## 4.1 Estrategia de Pruebas Incrementales

### 4.1.1 AnÃ¡lisis de las Pruebas

**Esquema de integraciÃ³n de los componentes de la aplicaciÃ³n:**

El sistema EduTrack Web se integra siguiendo una arquitectura modular donde el mÃ³dulo de AutenticaciÃ³n (A) actÃºa como componente raÃ­z, alimentando a los mÃ³dulos de GestiÃ³n AcadÃ©mica (B), EvaluaciÃ³n (C), Comunicaciones (D), Portales (E) y Notificaciones (F), que a su vez se conectan con sus respectivos sub-componentes de datos y servicios.
(Aqui iba una imagen)
### IntegraciÃ³n Incremental Ascendente (Bottom-Up)

- Nivel 0 (Componentes hoja): G, H, J, K, L, M, N, O, P, Q, R - sub-mÃ³dulos de datos individuales.
- Nivel 1: (I - O), (I - P), (I - Q), (I - R) - integraciÃ³n del mÃ³dulo de inscripciones con sub-datos.
- Nivel 2: (B - G), (B - H), (C - I), (C - J), (C - K), (D - L), (E - M), (F - N).
- Nivel 3 (RaÃ­z): (A - B), (A - C), (A - D), (A - E), (A - F) - integraciÃ³n con AutenticaciÃ³n.

### IntegraciÃ³n Incremental Descendente (Top-Down) - Anchura

- A
- (A - B), (A - C), (A - D), (A - E), (A - F)
- (B - G), (B - H), (C - I), (C - J), (C - K), (D - L), (E - M), (F - N)
- (I - O), (I - P), (I - Q), (I - R)

### IntegraciÃ³n Incremental Descendente - Profundidad

- A â†’ (A - B) â†’ (B - G), (B - H)
- A â†’ (A - C) â†’ (C - I) â†’ (I - O), (I - P), (I - Q), (I - R) â†’ (C - J), (C - K)
- A â†’ (A - D) â†’ (D - L)
- A â†’ (A - E) â†’ (E - M)
- A â†’ (A - F) â†’ (F - N)

### 4.1.2 DiseÃ±o de Casos de Prueba - IntegraciÃ³n Incremental

| **ID** | **MÃ³dulos Integrados**             | **Datos de Entrada**                                         | **Resultado Esperado**                                                       | **Resultado Obtenido**                                          | **Estado** |
| ------ | ---------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------- |
| CPI-01 | AutenticaciÃ³n + Usuarios y Roles   | Credenciales correctas de Admin (POST /api/Auth/login).      | El sistema verifica el rol y genera un Token JWT vÃ¡lido.                     | Token JWT generado correctamente con Payload de rol "Admin".    | Exitoso âœ… |
| CPI-02 | AutenticaciÃ³n + GestiÃ³n AcadÃ©mica  | Token JWT de Estudiante en Header. POST /api/Cursos.         | El mÃ³dulo AcadÃ©mico detecta el rol "Estudiante" y bloquea la creaciÃ³n.       | HTTP 403 Forbidden. El sistema deniega el acceso correctamente. | Exitoso âœ… |
| CPI-03 | AutenticaciÃ³n + EvaluaciÃ³n         | PUT /api/Notas sin Token (Header vacÃ­o).                     | El mÃ³dulo de EvaluaciÃ³n rechaza la solicitud por falta de credenciales.      | HTTP 401 Unauthorized. Bloqueo de Endpoint exitoso.             | Exitoso âœ… |
| CPI-04 | GestiÃ³n AcadÃ©mica + EvaluaciÃ³n     | PUT /api/Notas con EstudianteId inexistente.                 | EvaluaciÃ³n cruza el ID con GestiÃ³n AcadÃ©mica. Al no existir, rechaza.        | HTTP 404 Not Found "Estudiante no encontrado".                  | Exitoso âœ… |
| CPI-05 | AutenticaciÃ³n + Portales           | Token JWT de rol "Tutor". GET /api/PortalEstudiante/resumen. | Portales pide validaciÃ³n, detecta discordancia de roles y bloquea.           | HTTP 403 Forbidden. El Portal del Estudiante estÃ¡ blindado.     | Exitoso âœ… |
| CPI-06 | GestiÃ³n AcadÃ©mica + Portales       | GET /api/PortalEstudiante/resumen de alumno vÃ¡lido.          | Portales consulta a AcadÃ©mico el curso e inscripciones del alumno.           | HTTP 200 OK. Devuelve JSON con Grado y Curso asignado.          | Exitoso âœ… |
| CPI-07 | EvaluaciÃ³n + Portales              | GET /api/PortalEstudiante/resumen de alumno con 3 notas.     | Portales recupera las notas, opera la suma/divisiÃ³n y empaqueta el promedio. | HTTP 200 OK. JSON incluye el promedio matemÃ¡tico exacto.        | Exitoso âœ… |
| CPI-08 | AutenticaciÃ³n + Comunicaciones     | POST /api/Comunicaciones con Token JWT de Admin.             | El mÃ³dulo extrae el ID del remitente del contexto del Token.                 | HTTP 200 OK. Permite pasar al controlador de envÃ­o.             | Exitoso âœ… |
| CPI-09 | GestiÃ³n AcadÃ©mica + Comunicaciones | POST /api/Comunicaciones apuntando al CursoId: 15.           | Comunicaciones consulta a AcadÃ©mico la lista de inscritos.                   | Mensaje enrutado y registro guardado exitosamente.              | Exitoso âœ… |

### 4.1.3 EjecuciÃ³n y EvaluaciÃ³n de las Pruebas de IntegraciÃ³n (faltÃ³ la evaluacion)
(Aqui iba una imagen)
## 4.2 Pruebas Basadas en Hilos (corregir que el diagerasma de secuencia visualize las clases que van a ainteractuar)

### 4.2.1 Hilo 1 - Flujo de Registro y CalificaciÃ³n

**Caso de Uso: Docente inicia sesiÃ³n â†’ Consulta lista de alumnos â†’ Registra nota.**
(Aqui iba una imagen)
| **ID**   | **Hilo de EjecuciÃ³n**              | **Datos de Entrada (Secuencia)**                                                          | **Resultado Esperado**                                                                   | **Resultado Obtenido**                                                     | **Estado** |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- |
| CP-H1-01 | Hilo Completo Exitoso              | 1) Credenciales vÃ¡lidas. 2) GET limpio. 3) JSON de nota con alumno matriculado (Ej: 5.0). | El flujo atraviesa los 3 mÃ³dulos secuencialmente. Finaliza con la nota persistida en BD. | El tutor logra iniciar sesiÃ³n, ver alumnos y asentar la nota exitosamente. | Exitoso âœ… |
| CP-H1-02 | Ruptura de Hilo en M1 (Auth)       | 1) Credenciales INVÃLIDAS.                                                                | M1 bloquea el hilo inmediatamente. No se obtiene Token.                                  | Retorna HTTP 400/401 en el primer paso. El hilo se corta de forma segura.  | Exitoso âœ… |
| CP-H1-03 | Ruptura de Hilo en M3 (EvaluaciÃ³n) | 1) Credenciales vÃ¡lidas. 2) GET limpio. 3) Nota con EstudianteId: 99999.                  | El flujo sobrevive a M1 y M2, pero M3 detecta la anomalÃ­a y corta el hilo (HTTP 404).    | Retorna HTTP 404. El hilo es interceptado por la integridad relacional.    | Exitoso âœ… |

### 4.2.2 Hilo 2 - Flujo de Consulta del Estudiante
(Aqui iba una imagen)
| **ID**   | **Hilo de EjecuciÃ³n**            | **Datos de Entrada (Secuencia)**                           | **Resultado Esperado**                                                         | **Resultado Obtenido**                                                          | **Estado** |
| -------- | -------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ---------- |
| CP-H2-01 | Hilo Completo de Lectura         | 1) Credenciales Alumno. 2) GET /resumen.                   | El sistema orquesta la extracciÃ³n en M2 y M3 y calcula el promedio general.    | HTTP 200 OK. El Dashboard integrÃ³ dependencias y respondiÃ³ con datos vivos.     | Exitoso âœ… |
| CP-H2-02 | Ruptura por Falta de Datos en M3 | 1) Credenciales Alumno nuevo (sin notas). 2) GET /resumen. | M4 orquesta la solicitud, pero al no recibir notas asigna promedio = null o 0. | HTTP 200 OK sin excepciones. Manejo correcto de nulos.                          | Exitoso âœ… |
| CP-H2-03 | Ruptura de Hilo por AutorizaciÃ³n | 1) Credenciales de Tutor. 2) GET /resumen.                 | M4 rechaza al Tutor antes de consultar a M2 o M3.                              | HTTP 403 Forbidden. El hilo se corta para proteger la privacidad del dashboard. | Exitoso âœ… |

### 4.2.3 Hilo 3 - Flujo de Comunicaciones Masivas
(Aqui iba una imagen)
| **ID**   | **Hilo de EjecuciÃ³n**              | **Datos de Entrada (Secuencia)**                                                        | **Resultado Esperado**                                                                       | **Resultado Obtenido**                                        | **Estado** |
| -------- | ---------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------- |
| CP-H3-01 | Hilo Completo Exitoso              | 1) JWT de Admin. 2) POST a /Comunicaciones con CursoId vÃ¡lido con alumnos matriculados. | El hilo recorre M4, extrae los alumnos de M2 y guarda los mensajes.                          | HTTP 200 OK. BD registra notificaciones con IDs correctos.    | Exitoso âœ… |
| CP-H3-02 | Ruptura en Capa de Negocio (M4)    | 1) JWT de Admin. 2) POST con CursoId = null y EstudianteIds = \[\].                     | M4 detiene el viaje por detectar carga Ãºtil sin destinatarios.                               | HTTP 400 Bad Request: "Debes especificar un curso o lista".   | Exitoso âœ… |
| CP-H3-03 | TerminaciÃ³n Limpia por Curso VacÃ­o | 1) JWT de Admin. 2) POST con CursoId reciÃ©n creado (sin alumnos).                       | M4 consulta a M2, recibe lista vacÃ­a. Guarda log pero no genera notificaciones individuales. | HTTP 200 OK sin excepciones. No se generaron envÃ­os fantasma. | Exitoso âœ… |

### 4.2.4 EjecuciÃ³n y EvaluaciÃ³n de las Pruebas Basadas en Hilos

(Aqui iba una imagen)

# 5\. PRUEBAS DE SISTEMAS

## 5.1 Pruebas de Rendimiento

**Objetivo: Evaluar la capacidad de respuesta, el rendimiento (Throughput) y la estabilidad del servidor backend cuando es sometido a diferentes volÃºmenes de trÃ¡fico concurrente.**

Alcance: MÃ³dulo crÃ­tico - AutenticaciÃ³n (POST /api/Auth/login). Este endpoint es el mÃ¡s demandante a nivel computacional, ya que requiere validaciÃ³n cruzada en BD y la generaciÃ³n criptogrÃ¡fica de Tokens JWT.

**Herramienta: Apache JMeter v5.x**

**Estrategias:**

- Load Testing: 50 usuarios virtuales, ramp-up de 5 segundos.
- Stress Testing: 1,000 usuarios virtuales, ramp-up de 2 segundos (500 req/s).
- Endurance Testing: 100 usuarios constantes en loop continuo durante 1 minuto.

| **ID** | **Tipo de Prueba**                | **Escenario**                                                         | **Usuarios Concurrentes** | **Ramp-up**   | **Resultado Esperado**                               | **Resultado Obtenido**                                                                            | **Estado** |
| ------ | --------------------------------- | --------------------------------------------------------------------- | ------------------------- | ------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------- |
| CPR-01 | Prueba de Carga (Load Testing)    | Inicio de sesiÃ³n simultÃ¡neo. POST /api/Auth/login.                    | 50 Usuarios               | 5 segundos    | Error < 1%. Latencia < 1000ms.                       | Tasa de error: 0.00%. El servidor gestionÃ³ todas las peticiones exitosamente.                     | Exitoso âœ… |
| CPR-02 | Prueba de EstrÃ©s (Stress Testing) | Bombeo crÃ­tico - inicio de sesiÃ³n masivo al inicio del ciclo escolar. | 1,000 Usuarios            | 2 segundos    | Identificar punto de quiebre de EF y Kestrel.        | Tasa de error: 0.00%. Rendimiento sobresaliente. BD y JWT mantuvieron estabilidad total.          | Exitoso âœ… |
| CPR-03 | Prueba de Resistencia (Endurance) | PeticiÃ³n continua GET /api/PortalEstudiante/resumen.                  | 100 Usuarios              | Loop 1 minuto | Sin fugas de memoria. Tiempos de respuesta estables. | Tasa de error: 0.00%. Tiempos estables indicando liberaciÃ³n correcta del Garbage Collector de C#. | Exitoso âœ… |
(Aqui iba una imagen)
## 5.2 Pruebas de Seguridad

**Objetivo: Asegurar que la API de EduTrackWeb proteja los datos sensibles, prevenga accesos no autorizados y filtre inyecciones maliciosas.**

**Herramientas: OWASP ZAP (DAST automatizado) + Postman (validaciones manuales IDOR).**

| **ID** | **Tipo de Prueba**         | **Vector de Ataque**                                                                            | **Resultado Esperado**                                                | **Resultado Obtenido**                                                                   | **Estado**   |
| ------ | -------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------ |
| CPS-01 | InyecciÃ³n SQL (SQLi)       | ZAP inyectÃ³ sentencias SQL (' OR 1=1--) en parÃ¡metros de Usuarios, Cursos y Notas.              | EF Core parametriza la consulta. HTTP 400.                            | Ninguna vulnerabilidad SQLi. El servidor rechazÃ³ los payloads maliciosos.                | Exitoso âœ…   |
| CPS-02 | Cross-Site Scripting (XSS) | ZAP inyectÃ³ scripts de Javascript (&lt;script&gt;alert(1)&lt;/script&gt;) en entradas de texto. | La API sanitiza el input y lo trata como texto plano.                 | Cero vulnerabilidades XSS reportadas en los endpoints analizados.                        | Exitoso âœ…   |
| CPS-03 | Fugas de InformaciÃ³n       | ZAP escaneÃ³ respuestas en bÃºsqueda de contraseÃ±as en bruto o Stack Traces de C#.                | Datos sensibles no expuestos y errores 500 no muestran cÃ³digo fuente. | Peticiones de autenticaciÃ³n tratadas de forma segura. Sin fugas.                         | Exitoso âœ…   |
| CPS-04 | Cabeceras HTTP (Headers)   | RevisiÃ³n pasiva de cabeceras HTTP buscando directivas de seguridad.                             | La API debe retornar X-Content-Type-Options y X-Frame-Options.        | Alerta: "Falta encabezado X-Content-Type-Options". Riesgo bajo. Corregido en Program.cs. | Corregido âš ï¸ |
(Aqui iba una imagen)
ConclusiÃ³n: La auditorÃ­a demostrÃ³ que la API posee una arquitectura altamente robusta. El sistema mitigÃ³ con Ã©xito todos los ataques crÃ­ticos (SQLi y XSS) gracias a las protecciones nativas de ASP.NET y Entity Framework. La Ãºnica alerta preventiva detectada fue mitigada inyectando el filtro X-Content-Type-Options: nosniff en el cÃ³digo fuente.

## 5.3 Pruebas de Usabilidad

**Objetivo: Asegurar que la interfaz grÃ¡fica sea intuitiva, eficiente, accesible y fÃ¡cil de aprender para todos los actores del sistema.**

**Herramientas: Google Lighthouse (accesibilidad y Core Web Vitals) + HeurÃ­sticas de Nielsen.**

| **ID** | **Perfil de Usuario**     | **Escenario a Evaluar**                                     | **Criterio de AceptaciÃ³n**                                                          | **Resultado Obtenido**                                                                        | **Estado** |
| ------ | ------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------- |
| CPU-01 | Estudiante                | Localizar su promedio general en el Dashboard.              | Visualizar el promedio en menos de 5 segundos. JerarquÃ­a visual clara.              | El Dashboard muestra el promedio en una tarjeta principal destacada (Above the fold).         | Exitoso âœ… |
| CPU-02 | Docente                   | Ingresar una nota invÃ¡lida (Ej. "hola" o "-2").             | El formulario debe bloquear en tiempo real las letras o valores errÃ³neos.           | Input validado vÃ­a HTML/JS. El frontend muestra mensaje amigable antes de enviar al servidor. | Exitoso âœ… |
| CPU-03 | Administrador             | Enviar un comunicado general y recibir confirmaciÃ³n visual. | Al dar clic en "Enviar", debe aparecer Spinner y luego Toast verde de confirmaciÃ³n. | El sistema muestra Loader y confirma con NotificaciÃ³n de Ã‰xito.                               | Exitoso âœ… |
| CPU-04 | Todos                     | Iniciar sesiÃ³n desde telÃ©fono inteligente (360px de ancho). | DiseÃ±o no roto, texto legible sin zoom, botones mÃ­nimo 44x44px.                     | Interfaz colapsada a 1 columna. NavegaciÃ³n tipo "Hamburguesa" funcional.                      | Exitoso âœ… |
| CPU-05 | Automatizado (Lighthouse) | AuditorÃ­a de Accesibilidad (A11y) en la pÃ¡gina principal.   | Ãndice de accesibilidad superior a 90/100.                                          | PuntuaciÃ³n Lighthouse: 95/100. Contraste verificado para personas con debilidad visual.       | Exitoso âœ… |
(Aqui iba una imagen)
## 5.4 Pruebas de Portabilidad

**Objetivo: Asegurar que EduTrackWeb funcione de manera consistente en mÃºltiples navegadores, dispositivos y sistemas operativos.**

**Herramientas: Chrome DevTools Device Toolbar (emulador) + BrowserStack (referencia teÃ³rica).**

| **ID** | **Entorno (OS / Navegador)**       | **Dispositivo / ResoluciÃ³n**   | **Resultado Esperado**                                                                    | **Resultado Obtenido**                                                     | **Estado** |
| ------ | ---------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- |
| CPP-01 | Windows 11 / Google Chrome (v120+) | Desktop (1920x1080)            | Tablas, grÃ¡ficas y paneles encajan al 100% sin scroll horizontal.                         | Renderizado completo y tablas alineadas con grid CSS nativo.               | Exitoso âœ… |
| CPP-02 | macOS / Apple Safari               | MacBook                        | Estilos CSS con WebKit (desenfoques, sombras) se renderizan igual que en Chromium.        | Renderizado preciso. WebKit interpreta correctamente los estilos globales. | Exitoso âœ… |
| CPP-03 | iOS 16 / Mobile Safari             | iPhone 12 Pro (390x844)        | MenÃº oculto activa Hamburguesa. Tablas con scroll tÃ¡ctil lateral. Botones touch-friendly. | DiseÃ±o 100% responsivo. Componentes escalan y menÃº colapsa correctamente.  | Exitoso âœ… |
| CPP-04 | Android 13 / Chrome Mobile         | Samsung Galaxy S22 (Landscape) | Al rotar el dispositivo, los elementos se ajustan proporcionalmente.                      | Reflow estructural exitoso. Las vistas adaptan columnas dinÃ¡micamente.     | Exitoso âœ… |
(Aqui iba una imagen)
# 6\. PRUEBAS DE ACEPTACIÃ“N

Las Pruebas de AceptaciÃ³n tienen como objetivo validar que el sistema EduTrackWeb cumple con los requerimientos de negocio establecidos por la instituciÃ³n educativa, garantizando que los flujos de trabajo reales puedan ser ejecutados por los usuarios finales de manera satisfactoria antes de su liberaciÃ³n a producciÃ³n.

## 6.1 DiseÃ±o de Casos de Prueba

| **ID** | **Actor**       | **Historia de Usuario / Requisito**                                                                                                                                       | **Criterios de AceptaciÃ³n**                                                                                                                                                                     |
| ------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPA-01 | Docente / Tutor | GestiÃ³n de Calificaciones: Como docente, quiero poder ingresar la nota final de un estudiante en mi asignatura, para que el sistema calcule automÃ¡ticamente su desempeÃ±o. | 1\. El usuario debe poder buscar a su estudiante fÃ¡cilmente. 2. El sistema debe impedir notas mayores a 5.0 o menores a 0.0. 3. El sistema debe confirmar visualmente que la nota fue guardada. |
| CPA-02 | Estudiante      | Consulta de Progreso: Como estudiante, quiero acceder a mi portal personal para ver mis calificaciones y mi promedio general actualizado.                                 | 1\. El estudiante solo debe poder ver sus propias notas (privacidad). 2. El panel debe mostrar un promedio matemÃ¡tico exacto. 3. La interfaz debe cargar rÃ¡pidamente.                           |
| CPA-03 | Administrador   | Comunicados Institucionales: Como administrador, quiero enviar un mensaje masivo a todos los estudiantes de un curso y a sus padres.                                      | 1\. El usuario debe poder redactar un tÃ­tulo y cuerpo del mensaje. 2. MÃºltiples usuarios (alumnos y padres) deben recibir la alerta en sus bandejas de entrada.                                 |

## 6.2 EjecuciÃ³n y EvaluaciÃ³n de las Pruebas de AceptaciÃ³n (debe ser con una herramienta)

| **ID** | **Pasos ejecutados por el Usuario Final**                                                                                         | **Resultado Observado**                                                                                                        | **EvaluaciÃ³n y SatisfacciÃ³n**                                                                                                    | **Estado Final** |
| ------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| CPA-01 | El docente iniciÃ³ sesiÃ³n, buscÃ³ al alumno con ID especÃ­fico e intentÃ³ ingresar nota de "5.0". Luego intentÃ³ equivocarse con "-1". | El sistema guardÃ³ correctamente el 5.0. Al intentar el "-1", emitiÃ³ una alerta clara indicando el rango permitido.             | Plena SatisfacciÃ³n. El usuario valora que el sistema sea estricto con la escala de calificaciÃ³n porque previene errores humanos. | Aprobado âœ…      |
| CPA-02 | El estudiante entrÃ³ desde el navegador de su celular, ingresÃ³ sus credenciales y verificÃ³ su Dashboard.                           | El estudiante visualizÃ³ su nombre, grado y un promedio exacto calculado al instante. Nadie mÃ¡s tuvo acceso a esa vista.        | Plena SatisfacciÃ³n. Interfaz valorada por ser intuitiva y adaptarse a telÃ©fonos mÃ³viles (Mobile First).                          | Aprobado âœ…      |
| CPA-03 | El perfil administrativo redactÃ³ un comunicado de "Jornada PedagÃ³gica" y seleccionÃ³ el Curso "15" incluyendo tutores.             | El sistema despachÃ³ la informaciÃ³n con un solo clic. Al revisar las cuentas de tutores y alumnos, el evento estaba registrado. | Plena SatisfacciÃ³n. El requerimiento de comunicaciÃ³n vertical entre el colegio y las familias se cumple a cabalidad.             | Aprobado âœ…      |

**ConclusiÃ³n de las Pruebas de AceptaciÃ³n:**

Tras la ejecuciÃ³n de los escenarios crÃ­ticos de negocio, los distintos perfiles de usuario confirman que la plataforma EduTrackWeb resuelve las necesidades operativas de la instituciÃ³n. El sistema es robusto, protege los datos sensibles, previene errores de digitaciÃ³n y ofrece una experiencia de uso fluida. Por lo tanto, el software supera las Pruebas de AceptaciÃ³n y se dictamina como APROBADO (Go-Live) para su despliegue en producciÃ³n.

# 7\. CONCLUSIONES

## Pruebas Unitarias

Las pruebas unitarias de caja negra (particiÃ³n de equivalencia y valores lÃ­mite) y caja blanca (camino bÃ¡sico) aplicadas a los cinco mÃ³dulos del sistema EduTrack Web permitieron identificar y corregir errores de validaciÃ³n en etapas tempranas del proceso. La tÃ©cnica de TDD demostrÃ³ ser efectiva para detectar comportamientos inesperados como falsos positivos HTTP 200 en casos de datos invÃ¡lidos, los cuales fueron subsanados antes de avanzar a las fases de integraciÃ³n.

## Pruebas de IntegraciÃ³n

Las pruebas de integraciÃ³n incremental ascendente y basadas en hilos confirmaron que los mÃ³dulos del sistema interactÃºan de forma coherente y segura. La arquitectura basada en roles JWT garantiza que ningÃºn mÃ³dulo pueda ser accedido por perfiles no autorizados, y la integridad referencial de Entity Framework Core previene la creaciÃ³n de registros huÃ©rfanos en todos los flujos probados.

## Pruebas de Sistemas

Las pruebas de sistemas demostraron que EduTrack Web cumple con los requisitos no funcionales crÃ­ticos: la plataforma soportÃ³ cargas de hasta 1,000 usuarios concurrentes sin errores (JMeter), mitigÃ³ todos los ataques de seguridad estÃ¡ndar OWASP probados (ZAP), obtuvo una puntuaciÃ³n de accesibilidad de 95/100 (Lighthouse) y funcionÃ³ correctamente en los principales navegadores y dispositivos del mercado.

## Pruebas de AceptaciÃ³n

Las pruebas de aceptaciÃ³n con usuarios representativos (docentes, estudiantes y administradores) confirmaron que el sistema satisface las necesidades operativas reales de la instituciÃ³n educativa. Los tres flujos de negocio crÃ­ticos evaluados - gestiÃ³n de calificaciones, consulta de progreso estudiantil y comunicaciones institucionales - fueron aprobados sin observaciones. El sistema se dictamina como APTO para su despliegue en un entorno de producciÃ³n real.





