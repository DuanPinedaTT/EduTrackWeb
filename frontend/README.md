# EduTrack Web Frontend

SPA construida con React 19 + Vite que replica la plataforma EduTrak, conectándose al backend ASP.NET Core (`backend_editable`). Incluye paneles diferenciados por rol (admin, docente y estudiante), consumo de APIs reales y vistas responsivas basadas en Bootstrap 5.

## Requisitos

- Node.js 20+
- Backend .NET 8 levantado aparte (el proyecto se sincroniza copiando los archivos de `backend_editable/` hacia tu solución principal en Visual Studio 2022, tal como se acordó)
- Variables locales: no se requiere `.env`; las peticiones usan el proxy relativo `/api` definido en Vite.

## Scripts disponibles

```bash
npm install       # instala dependencias
npm run dev       # levanta el frontend en http://localhost:5173
npm run build     # genera artefacto de producción
npm run preview   # sirve la build generada
npm run lint      # ejecuta eslint sobre src/
```

> El backend **no se ejecuta desde aquí**. Levántalo con Visual Studio 2022 (o `dotnet run`) apuntando a la copia oficial del proyecto. Solo usamos `backend_editable/` como staging para los cambios antes de que los pegues en la solución ejecutable.

## Características principales

- **Autenticación JWT** contra `/api/Auth/login` con rutas privadas segmentadas por rol.
- **Panel administrador** completo: gestión de docentes, estudiantes, cursos, asignaciones, periodos, reportes avanzados (promedios, asistencia) y centro de notificaciones.
- **Panel docente**: calificaciones (configuración + captura), asistencias, notificaciones y observaciones enlazadas a los endpoints reales.
- **Panel estudiante**: dashboard con KPIs, calificaciones, asistencias, notificaciones y seguimiento de observaciones.
- **Reportes**: gráficos (Recharts), exportación CSV y descarga de planillas XLSX vía `/api/Exports/course/{id}/xlsx`.

## Flujo de despliegue

1. Aplica los cambios deseados dentro de `backend_editable/` y `frontend/`.
2. Copia el contenido de `backend_editable/` hacia la carpeta del backend que tienes abierta en Visual Studio 2022.
3. Ejecuta el backend con VS (o `dotnet run`) y luego `npm run dev` en `frontend/`.
4. Cuando todo esté validado, corre `npm run build` para generar la versión productiva y los tests/lints que necesites.

## Próximos pasos sugeridos

- Ejecutar pruebas funcionales completas cuando el backend y frontend estén integrados.
- Documentar credenciales de prueba y endpoints adicionales si se agregan nuevos módulos.
- Automatizar la copia de `backend_editable/` hacia la solución oficial si el flujo se mantiene.
