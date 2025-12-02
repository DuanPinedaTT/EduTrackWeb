import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Maneja sesión, token y persistencia en localStorage para todo el frontend.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Cada vez que cambia el token, sincronizamos el objeto usuario desde storage.
  useEffect(() => {
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setUser(storedUser);
    } else {
      setUser(null);
    }
  }, [token]);

  // Normaliza el rol, persiste token/usuario y actualiza el contexto.
  const login = (data) => {
    const normalizedUser = {
      ...data.user,
      rol: data.user.rol?.toLowerCase()
    };
    setToken(data.token);
    setUser(normalizedUser);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Permite modificar datos del usuario sin tocar el token guardado.
  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
