import '../styles/Despensa.css';
import { useState, useEffect } from 'react';

export function Despensa() {
  const [ingredientes, setIngredientes] = useState([]);
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIngredientes();
  }, []);

  const loadIngredientes = async () => {
    try {
      const response = await fetch('http://localhost/TFG/NutreTFinal/NutreT/Despensa/getIngredientes');
      const data = await response.json();
      setIngredientes(data.ingredientes || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleAddIngrediente = async (e) => {
    e.preventDefault();
    
    if (!nuevoIngrediente || !cantidad || !stock) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost/TFG/NutreTFinal/NutreT/Despensa/addIngrediente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nuevoIngrediente,
          cantidad: cantidad,
          stock: stock
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setNuevoIngrediente('');
        setCantidad('');
        setStock('');
        loadIngredientes(); // Recargar lista
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al añadir ingrediente');
    }
  };

  const handleDeleteIngrediente = async (id) => {
    try {
      const response = await fetch('http://localhost/TFG/NutreTFinal/NutreT/Despensa/deleteIngrediente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
      });

      const data = await response.json();
      
      if (data.success) {
        loadIngredientes(); // Recargar lista
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar ingrediente');
    }
  };

  if (loading) {
    return (
      <div id="loader" className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <main className="principal">
      <section>
        <h3 className="titulos">Mi Despensa</h3>

        <form onSubmit={handleAddIngrediente} className="productosNuevos">
          <table className="tablasDespensa">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Stock</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr className="filaAnadir">
                <td>
                  <input
                    type="text"
                    value={nuevoIngrediente}
                    onChange={(e) => setNuevoIngrediente(e.target.value)}
                    placeholder="Nombre del ingrediente"
                    className="inputsDespensa"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="Cantidad"
                    className="inputsDespensa"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Stock"
                    className="inputsDespensa"
                  />
                </td>
                <td>
                  <button type="submit">Añadir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        <table className="tablasDespensa">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Stock</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody className="filaDespensa">
            {ingredientes.map((ing, idx) => (
              <tr key={idx}>
                <td>{ing.nombre}</td>
                <td>{ing.cantidad}</td>
                <td>{ing.stock}</td>
                <td>
                  <button 
                    onClick={() => handleDeleteIngrediente(ing.id)}
                    style={{ backgroundColor: '#d9534f', color: 'white' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
