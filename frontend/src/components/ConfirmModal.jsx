import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";

/**
 * Modal reutilizable para confirmaciones sencillas.
 */
export default function ConfirmModal({
  show,
  title = "Confirmar acción",
  message = "¿Seguro que deseas continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "danger",
  onConfirm,
  onClose
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaExclamationTriangle className="text-warning me-2" />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
