import React, { useEffect, useState } from "react";
import {
  getAllMonedas,
  crearMoneda,
  actualizarMoneda,
  eliminarMoneda,
} from "../services/monedaService";

const AdmMonedas = () => {
  const [monedas, setMonedas] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ codigo: "", nombre: "", valueInSus: "" });

  const token = sessionStorage.getItem("token");

  const cargarMonedas = () => {
    getAllMonedas(token)
      .then(setMonedas)
      .catch((err) => console.error("Error al obtener monedas", err));
  };

  useEffect(() => {
    cargarMonedas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await eliminarMoneda(id, token);
      cargarMonedas();
    } catch (error) {
      console.error("Error al borrar moneda", error);
      alert("No se pudo borrar la moneda");
    }
  };

  const handleEdit = (moneda) => {
    setEditando(moneda);
    setFormData({
      codigo: moneda.codigo,
      nombre: moneda.nombre,
      valueInSus: moneda.valueInSus,
    });
    setFormVisible(true);
  };

  const handleCreate = () => {
    setEditando(null);
    setFormData({ codigo: "", nombre: "", valueInSus: "" });
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await actualizarMoneda(editando.id, formData, token);
      } else {
        await crearMoneda(formData, token);
      }
      cargarMonedas();
      setFormVisible(false);
      setEditando(null);
    } catch (error) {
      console.error("Error al guardar moneda", error);
      alert("No se pudo guardar la moneda");
    }
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "3rem auto",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        Administrar Monedas
      </h1>

      <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem" }}>
        {monedas.map((moneda) => (
          <li
            key={moneda.id}
            style={{
              backgroundColor: "#fff",
              padding: "1rem 1.5rem",
              marginBottom: "0.75rem",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ color: "#222", fontWeight: "600" }}>
              {moneda.nombre} ({moneda.codigo}) - Valor en SUS:{" "}
              <span style={{ fontWeight: "700", color: "#3182ce" }}>
                {moneda.valueInSus}
              </span>
            </div>
            <div>
              <button
                onClick={() => handleEdit(moneda)}
                style={{
                  backgroundColor: "#3182ce",
                  border: "none",
                  color: "white",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "0.5rem",
                  fontWeight: "600",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2c5282")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3182ce")}
              >
                Actualizar
              </button>
              <button
                onClick={() => handleDelete(moneda.id)}
                style={{
                  backgroundColor: "#e53e3e",
                  border: "none",
                  color: "white",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#9b2c2c")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e53e3e")}
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleCreate}
        style={{
          backgroundColor: "#38a169",
          border: "none",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
          transition: "background-color 0.3s",
          display: "block",
          margin: "0 auto",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#276749")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#38a169")}
      >
        Crear moneda
      </button>

      {formVisible && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "2rem",
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "1rem", color: "#333" }}>
            {editando ? "Actualizar Moneda" : "Crear Moneda"}
          </h2>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#555" }}>
            Código:
            <input
              type="text"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "0.5rem", color: "#555" }}>
            Nombre:
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "1rem", color: "#555" }}>
            Valor en SUS:
            <input
              type="number"
              step="0.01"
              value={formData.valueInSus}
              onChange={(e) =>
                setFormData({ ...formData, valueInSus: parseFloat(e.target.value) })
              }
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#3182ce",
                border: "none",
                color: "white",
                padding: "0.6rem 1.2rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2c5282")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3182ce")}
            >
              Guardar
            </button>

            <button
              type="button"
              onClick={() => setFormVisible(false)}
              style={{
                backgroundColor: "#a0aec0",
                border: "none",
                color: "white",
                padding: "0.6rem 1.2rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#718096")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#a0aec0")}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdmMonedas;
