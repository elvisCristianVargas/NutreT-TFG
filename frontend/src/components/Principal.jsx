import '../styles/Principal.css';
import { useState, useEffect } from 'react';

export function Principal() {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const response = await fetch('http://localhost/TFG/NutreTFinal/NutreT/Principal/logged');
      const data = await response.json();
      setLogged(data.result);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
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
    <>
      <header>
        <nav className="nav">
          <div className="divnav">
            <a className="enlaces" href="#/Despensa">Despensa</a>
            <a className="enlaces" href="#/Recetas">Recetas</a>
            <a className="enlaces" href="#/Generar">Generar</a>
          </div>
          <div className="divnav" id="divnavUser">
            {logged ? (
              <a href="#/Perfil" className="enlaces">
                <img className="iconoPerfil" src="/public/img/LucideUser.png" alt="Perfil" />
              </a>
            ) : (
              <>
                <a className="enlaces" href="#/Login">Inicio Sesión</a>
                <a className="enlaces" id="registro" href="#/Registro">Registrarse</a>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="principal">
        <section>
          <div className="controladorTexto">
            <h3 className="titulos">¿Quiénes somos?</h3>
            <p className="textos">
              Somos un equipo apasionado por la cocina y la tecnología que quiere ayudarte a aprovechar al máximo los ingredientes que ya tienes en casa. Nuestra misión es reducir el desperdicio alimentario y hacer que decidir qué cocinar sea más fácil, rápido y divertido.
              Con nuestra aplicación puedes gestionar tu despensa, descubrir recetas basadas en lo que tienes disponible y generar nuevas ideas en segundos.
            </p>
          </div>
          <img src="https://www.cnature.es/wp-content/uploads/2021/12/hamburguesa-con-guacamole.jpg" alt="Comida" />
        </section>

        <section className="como-funciona">
          <h3 className="titulos">¿Cómo funciona?</h3>
          
          <div className="tarjeta">
            <p className="textos"><strong>Añade ingredientes</strong></p>
            <p className="textos">-Ve a Despensa</p>
            <p className="textos">-Añade los ingredientes</p>
          </div>

          <div className="tarjeta">
            <p className="textos"><strong>Genera recetas</strong></p>
            <p className="textos">-Haz clic en generar</p>
          </div>

          <div className="tarjeta">
            <p className="textos"><strong>Explora recetas</strong></p>
            <p className="textos">-La app te muestra 4 recetas</p>
            <p className="textos">-Elige la que más te gusta</p>
            <p className="textos">-Guárdala en favoritos</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="divFooter">
          <h3>Información</h3>
          <a className="enlacesFooter" href="#">Sobre nosotros</a>
          <a className="enlacesFooter" href="#">Contacto</a>
        </div>
      </footer>
    </>
  );
}
