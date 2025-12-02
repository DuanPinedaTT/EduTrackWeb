import React from "react";
import { Table, Form } from "react-bootstrap";
import GradeCell from "./GradeCell.jsx";

// Renderiza planillas de notas usando el esquema de columnas configuradas.
export default function StudentsTable({ students, config, valoresPorEstudiante, onChangeNota }) {
  return (
    <div className="table-responsive">
      <Table striped hover responsive className="mb-0 align-middle">
        <thead>
          <tr>
            <th>Estudiante</th>
            {config.nombres.map((nombre, idx) => (
              <th key={idx} style={{ minWidth: 120 }}>
                {nombre} ({config.porcentajes[idx]}%)
              </th>
            ))}
            <th>Definitiva</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td style={{ minWidth: 200 }}>
                <Form.Control defaultValue={s.nombre} readOnly size="sm" />
              </td>
              {config.nombres.map((nombre, idx) => (
                <GradeCell
                  key={idx}
                  studentId={s.id}
                  notaIndex={idx}
                  value={valoresPorEstudiante[s.id]?.valores?.[idx]?.valor ?? ""}
                  onChangeNota={onChangeNota}
                />
              ))}
              <td>{valoresPorEstudiante[s.id]?.definitiva ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
