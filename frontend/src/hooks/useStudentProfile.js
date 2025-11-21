import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Estudiantes } from "../services/api.js";

export default function useStudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(user?.rol === "estudiante");
  const [profileError, setProfileError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user || user.rol !== "estudiante") {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    setProfileError(null);
    try {
      const res = await Estudiantes.profileByUsuario(user.id);
      setProfile(res.data);
    } catch (err) {
      setProfile(null);
      setProfileError(err.response?.data || "No se pudo cargar el perfil del estudiante");
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
