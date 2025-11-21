import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

export default function ExportButtons({ courseId }) {
  const download = (type) => {
    const token = localStorage.getItem("token");
    // endpoint en backend: /api/Exports/course/{courseId}/{type}
    const url = `/api/Exports/course/${courseId}/${type}`;
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
