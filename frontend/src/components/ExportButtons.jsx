import React, { useMemo } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";

// Botonera para descargar planillas del curso en Excel o PDF.
export default function ExportButtons({ courseId, cursoAsignaturaId = null }) {
  const { user } = useAuth();

  const docenteLabel = useMemo(() => {
    if (!user) return "";
    const fullName = [user.nombre, user.apellido].filter(Boolean).join(" ").trim();
    if (fullName) return fullName;
    return user.user || user.username || "";
  }, [user]);

  // Construye la URL de export con token y abre la descarga.
  const download = (type) => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    if (cursoAsignaturaId != null) {
      params.set("cursoAsignaturaId", String(cursoAsignaturaId));
    }
    if (docenteLabel) {
      params.set("docente", docenteLabel);
    }
    const query = params.toString();
    const url = `/api/Exports/course/${courseId}/${type}${query ? `?${query}` : ""}`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `planilla_${courseId}.${type === "pdf" ? "pdf" : "xlsx"}`;
        link.click();
      });
  };

  return (
    <ButtonGroup className="mb-3">
      <Button className="primary-btn" onClick={() => download("xlsx")}>Exportar Excel</Button>
      <Button variant="outline-secondary" onClick={() => download("pdf")}>Exportar PDF</Button>
    </ButtonGroup>
  );
}
