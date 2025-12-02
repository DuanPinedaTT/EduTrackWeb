import React from "react";
import { Form } from "react-bootstrap";

// Celda editable para notas individuales dentro de tablas de calificaciones.
export default function GradeCell({ studentId, notaIndex, value, onChangeNota }) {
  return (
    <td>
      <Form.Control
        type="number"
        min="0"
        max="5"
        step="0.1"
        size="sm"
        value={value}
        // Normaliza el valor ingresado y notifica al contenedor.
        onChange={(e) => onChangeNota(studentId, notaIndex, e.target.value === '' ? null : parseFloat(e.target.value))}
        style={{ width: '85px' }}
      />
    </td>
  );
}
