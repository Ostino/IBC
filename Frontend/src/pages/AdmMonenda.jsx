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
  const [editando, setEditando] = useState(null); // null = creando, objeto = editando
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
    <div>
      <h1>Administrar Monedas</h1>
      <ul>
        {monedas.map((moneda) => (
          <li key={moneda.id}>
            {moneda.nombre} ({moneda.codigo}) - Valor en SUS: {moneda.valueInSus}
            <button onClick={() => handleEdit(moneda)}>Actualizar</button>
            <button onClick={() => handleDelete(moneda.id)}>Borrar</button>
          </li>
        ))}
      </ul>
      <button onClick={handleCreate}>Crear moneda</button>

      {formVisible && (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <h2>{editando ? "Actualizar Moneda" : "Crear Moneda"}</h2>
          <label>
            Código:
            <input
              type="text"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              required
            />
          </label>
          <br />
          <label>
            Nombre:
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </label>
          <br />
          <label>
            Valor en SUS:
            <input
              type="number"
              step="0.01"
              value={formData.valueInSus}
              onChange={(e) => setFormData({ ...formData, valueInSus: parseFloat(e.target.value) })}
              required
            />
          </label>
          <br />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setFormVisible(false)}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};

export default AdmMonedas;
