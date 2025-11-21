import axios from "axios";

const api = axios.create({
  baseURL: "/api"
});

// Interceptor para agregar token automáticamente a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// Helpers específicos para recursos usados en el frontend
export const Grados = {
  list: () => api.get('/Grados'),
  get: (id) => api.get(`/Grados/${id}`),
  create: (data) => api.post('/Grados', data),
  update: (id, data) => api.put(`/Grados/${id}`, data),
  remove: (id) => api.delete(`/Grados/${id}`)
};

export const Asignaturas = {
  list: () => api.get('/Asignaturas'),
  get: (id) => api.get(`/Asignaturas/${id}`),
  create: (data) => api.post('/Asignaturas', data),
  update: (id, data) => api.put(`/Asignaturas/${id}`, data),
  remove: (id) => api.delete(`/Asignaturas/${id}`)
};

export const CursoAsignaturas = {
  list: (params) => api.get('/CursoAsignaturas', { params }),
  get: (id) => api.get(`/CursoAsignaturas/${id}`),
  create: (data) => api.post('/CursoAsignaturas', data),
  update: (id, data) => api.put(`/CursoAsignaturas/${id}`, data),
  remove: (id) => api.delete(`/CursoAsignaturas/${id}`)
};

export const Cursos = {
  list: () => api.get('/cursos'),
  get: (id) => api.get(`/cursos/${id}`),
  create: (data) => api.post('/cursos', data),
  update: (id, data) => api.put(`/cursos/${id}`, data),
  remove: (id) => api.delete(`/cursos/${id}`),
  students: (id) => api.get(`/cursos/${id}/students`)
};

export const Estudiantes = {
  list: () => api.get('/Estudiantes'),
  get: (id) => api.get(`/Estudiantes/${id}`),
  create: (data) => api.post('/Estudiantes', data),
  update: (id, data) => api.put(`/Estudiantes/${id}`, data),
  remove: (id) => api.delete(`/Estudiantes/${id}`),
  profileByUsuario: (usuarioId) => api.get(`/Estudiantes/usuario/${usuarioId}`)
};

export const Periodos = {
  list: () => api.get('/Periodos'),
  activate: (id) => api.post(`/Periodos/${id}/activar`)
};

export const Notas = {
  listByCurso: (cursoId) => api.get(`/Notas/curso/${cursoId}`),
  configByCurso: (cursoId) => api.get(`/Notas/curso/${cursoId}/config`),
  createConfig: (cursoId, data) => api.post(`/Notas/curso/${cursoId}/config`, data),
  updateConfig: (configId, data) => api.put(`/Notas/config/${configId}`, data),
  deleteConfig: (configId) => api.delete(`/Notas/config/${configId}`),
  updateValor: (payload) => api.put('/Notas', payload)
};

export const Inscripciones = {
  list: (params) => api.get('/Inscripciones', { params })
};

export const Asistencias = {
  list: (params) => api.get('/Asistencias', { params }),
  create: (data) => api.post('/Asistencias', data),
  update: (id, data) => api.put(`/Asistencias/${id}`, data),
  remove: (id) => api.delete(`/Asistencias/${id}`)
};

export const Notificaciones = {
  list: (params) => api.get('/Notificaciones', { params }),
  create: (data) => api.post('/Notificaciones', data),
  update: (id, data) => api.put(`/Notificaciones/${id}`, data),
  markAsRead: (id) => api.put(`/Notificaciones/${id}/leer`),
  remove: (id) => api.delete(`/Notificaciones/${id}`)
};

export const Observaciones = {
  list: (params) => api.get('/Observaciones', { params }),
  create: (data) => api.post('/Observaciones', data),
  remove: (id) => api.delete(`/Observaciones/${id}`)
};

export const Profesores = {
  profileByUsuario: (usuarioId) => api.get(`/Profesores/perfil-usuario/${usuarioId}`),
  courses: (profesorId) => api.get(`/Profesores/${profesorId}/cursos`)
};
