import React, { useState, useEffect } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";

/**
 * SearchInput replica la experiencia del componente Buscador del proyecto EduTrak.
 * Expone un input controlado que notifica los cambios inmediatamente y permite limpiar.
 */
export default function SearchInput({ placeholder = "Buscar...", onSearch, defaultValue = "", className = "" }) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onSearch?.(nextValue);
  };

  const clear = () => {
    setValue("");
    onSearch?.("");
  };

  return (
    <InputGroup className={className}>
      <InputGroup.Text>
        <FaSearch />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <Button variant="outline-secondary" onClick={clear} title="Limpiar búsqueda">
          <FaTimes />
        </Button>
      )}
    </InputGroup>
  );
}
