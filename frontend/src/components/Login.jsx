import '../styles/Login.css';
import { useState } from 'react';

export function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const response = await fetch('http://localhost/TFG/NutreTFinal/NutreT/Principal/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: usuario,
          passwd: password,
          recordar: recordar ? 'on' : 'off'
        })
      });

      const data = await response.json();

      if (data.result === 'Correct' && data.logged) {
        // Login exitoso, redirigir
        window.location.href = data.url + '/Principal';
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="principal-login">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Usuario"
          required
        />
        <br />
        <br />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <br />
        <br />

        <label htmlFor="recordar">
          <input
            type="checkbox"
            name="recordar"
            id="recordar"
            checked={recordar}
            onChange={(e) => setRecordar(e.target.checked)}
          />
          ¿Quieres recordar la contraseña?
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Accediendo...' : 'Acceder'}
        </button>

        {error && <p style={{ color: 'red' }}>El usuario o la contraseña son incorrectos</p>}
      </form>
    </main>
  );
}
