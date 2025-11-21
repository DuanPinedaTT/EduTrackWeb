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

  // Si está logueado, no mostrar navbar
  if (user) return null;

  return (
    <BsNavbar className="app-navbar shadow-sm py-3">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="brand">
          <div className="logo-box">📚</div>
          EduTrack Academy
        </BsNavbar.Brand>

        <Button onClick={onLoginClick} className="btn-login">
          Ingresar
        </Button>
      </Container>
    </BsNavbar>
  );
}
