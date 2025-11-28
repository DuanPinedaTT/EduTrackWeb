import React from "react";
import {
  Navbar as BsNavbar,
  Container,
  Button
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Navbar({ onLoginClick }) {
  const { user } = useAuth();

  if (user) return null;

  return (
    <BsNavbar className="app-navbar" expand="md" sticky="top">
      <Container className="d-flex justify-content-between align-items-center">
        <BsNavbar.Brand as={Link} to="/" className="brand">
          <img
            src="/logo-relleno-azul.png"
            alt="EduTrack Academy"
            className="logo-hero"
          />
          <div className="d-flex flex-column">
            <span className="brand-title">
              <span className="brand-title-primary">Edu</span>
              <span className="brand-title-highlight">Track</span>
              <span className="brand-title-primary"> Academy</span>
            </span>
            <small className="text-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}>
              Gestión académica integral
            </small>
          </div>
        </BsNavbar.Brand>

        <Button onClick={onLoginClick} className="btn-login">
          Ingresar ahora
        </Button>
      </Container>
    </BsNavbar>
  );
}
