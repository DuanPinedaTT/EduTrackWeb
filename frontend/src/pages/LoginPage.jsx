import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Login from "./Login.jsx";

// Contenedor mínimo para reutilizar el formulario de login fuera del modal.
export default function LoginPage() {
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Ingreso al sistema</Card.Title>
              <Login />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
