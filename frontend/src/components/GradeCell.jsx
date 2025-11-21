import React from "react";
import { Form } from "react-bootstrap";

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
        onChange={(e) => onChangeNota(studentId, notaIndex, e.target.value === '' ? null : parseFloat(e.target.value))}
        style={{ width: '85px' }}
      />
    </td>
  );
}
