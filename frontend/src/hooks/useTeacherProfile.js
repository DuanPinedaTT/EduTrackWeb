import { useCallback, useEffect, useState } from "react";
import api from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function useTeacherProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(user?.rol === "docente");
  const [profileError, setProfileError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user || user.rol !== "docente") return;

    setLoadingProfile(true);
    setProfileError(null);
    try {
      const res = await api.get(`/Profesores/perfil-usuario/${user.id}`);
      setProfile(res.data);
    } catch (err) {
      setProfileError(err.response?.data || "No se pudo cargar el perfil docente");
    } finally {
      setLoadingProfile(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loadingProfile,
    profileError,
    reloadProfile: fetchProfile
  };
}
