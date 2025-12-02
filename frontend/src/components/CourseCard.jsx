import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Tarjeta compacta para listar cursos y saltar a su vista detallada.
export default function CourseCard({ course, basePath = "/teacher" }) {
  const navigate = useNavigate();

  // Navega al detalle del curso respetando el prefijo base.
  const handleView = () => {
    navigate(`${basePath}/course/${course.id}`);
  };

  return (
    <Card className="course-card shadow-sm h-100">
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <Card.Title className="mb-2 card-title-lg">{course.nombre}</Card.Title>
          <Badge bg="secondary" className="mb-2 badge-small">
            {course.gradoNombre || course.grado || "Sin grado"}
          </Badge>
        </div>

        <Card.Text className="text-muted mb-3 card-text-sub">
          <strong>Docente:</strong> {course.docenteNombre || "Sin asignar"}
        </Card.Text>

        <div className="mt-auto">
          <Button variant="primary" size="sm" onClick={handleView} className="w-100">
            Ver estudiantes
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
