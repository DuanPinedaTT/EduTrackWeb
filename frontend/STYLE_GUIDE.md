# Guía de Estilo — EduTrack Academy (Combinado)

Resumen rápido de tokens y decisiones de diseño para combinar `edutrack` + `navigable-prototype`:

- **Paleta principal**: se mantienen los colores del proyecto actual (`--primary-color: #4c6fff`, `--secondary-color: #8f94fb`, `--accent-color: #b3c0ff`).
- **Tokens de espacio y radio**: usamos `--border-radius` y `--border-radius-lg` definidos en `src/styles/variables.css`.
- **Sombras y elevación**: `--shadow-sm`, `--shadow-md`, `--shadow-lg` del proyecto se mantienen.
- **Tipografía**: conservar la stack actual (system-ui / Segoe UI / Roboto) para simplicidad.
- **Diseño**: incorporar patrones de `navigable-prototype` — variables temáticas, tamaños de tarjeta y un sidebar más limpio — pero sin introducir Tailwind ni Next-specific code.

Clases nuevas principales (en `src/styles/combined.css`):

- `.app-navbar`: navbar principal con gradiente y paddings.
- `.dashboard-header`: header sticky usado dentro del layout.
- `.sidebar-panel`: estilo del sidebar con fondo suave y bordes redondeados.
- `.card-surface`: tarjetas con fondo blanco, border-radius y sombra.
- `.primary-btn`: botón primario consistente con `--primary-color`.
- `.course-card`: tarjeta de curso con borde superior en `--primary-color` y micro-interacciones.

Cómo usar

- Importar `variables.css` (ya existe) y luego `combined.css` (se añadió e importó en `src/main.jsx`).
- Reemplazar estilos inline por clases cuando sea posible; si necesitas un cambio puntual sigue usando estilos inline.

Decisiones de compatibilidad

- No se agrega Tailwind ni dependencias de `navigable-prototype` (Next/Tailwind). Se copiaron ideas de tokens y clases, manteniendo la base de `react-bootstrap`.
- Si quieres, puedo continuar reemplazando más estilos inline en otros componentes (por ejemplo páginas y tarjetas) siguiendo este patrón.

---
Generado automáticamente por el asistente. Si quieres que aplique este estilo a todas las páginas, dime y procedo.
