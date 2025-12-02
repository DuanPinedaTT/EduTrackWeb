import React from "react";
import { Spinner } from "react-bootstrap";

// Placeholder estándar mientras se cargan datos.
export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="text-muted mt-3">{message}</p>
    </div>
  );
}
