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
