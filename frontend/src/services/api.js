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
  list: () => api.get('/CursoAsignaturas'),
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

export const PortalEstudiante = {
  resumen: () => api.get('/PortalEstudiante/resumen'),
  notas: (periodo, cursoId) => {
    const params = {};
    if (periodo != null) params.periodo = periodo;
    if (cursoId != null) params.cursoId = cursoId;
    const config = Object.keys(params).length > 0 ? { params } : undefined;
    return api.get('/PortalEstudiante/notas', config);
  },
  asistencias: (params = {}) => api.get('/PortalEstudiante/asistencias', { params }),
  comunicaciones: () => api.get('/PortalEstudiante/comunicaciones'),
  marcarComunicacionLeida: (destinoId) => api.post(`/PortalEstudiante/comunicaciones/${destinoId}/leido`)
};

export const PortalTutor = {
  hijos: () => api.get('/PortalTutor/hijos'),
  notas: (estudianteId, periodo, cursoId) => {
    const params = {};
    if (periodo != null) params.periodo = periodo;
    if (cursoId != null) params.cursoId = cursoId;
    const config = Object.keys(params).length > 0 ? { params } : undefined;
    return api.get(`/PortalTutor/notas/${estudianteId}`, config);
  },
  asistencias: (estudianteId, params = {}) => api.get(`/PortalTutor/asistencias/${estudianteId}`, { params }),
  comunicaciones: () => api.get('/PortalTutor/comunicaciones'),
  marcarComunicacionLeida: (destinoId) => api.post(`/PortalTutor/comunicaciones/${destinoId}/leido`)
};

export const Comunicaciones = {
  crear: (payload) => api.post('/Comunicaciones', payload),
  emitidas: () => api.get('/Comunicaciones/emitidas')
};
