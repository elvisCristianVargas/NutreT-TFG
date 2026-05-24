import { useState, useEffect } from 'react';
import './styles/Global.css';
import { Principal } from './components/Principal';
import { Login } from './components/Login';
import { Despensa } from './components/Despensa';

function App() {
  const [currentPage, setCurrentPage] = useState('Principal');

  useEffect(() => {
    // Escuchar cambios en el hash (#/Principal, #/Login, etc.)
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').split('/')[0];
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('Principal');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Ejecutar al cargar

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'Principal':
        return <Principal />;
      case 'Login':
        return <Login />;
      case 'Despensa':
        return <Despensa />;
      case 'Recetas':
        return <div style={{ marginTop: '10vh', textAlign: 'center' }}><h1>Recetas (en desarrollo)</h1></div>;
      case 'Generar':
        return <div style={{ marginTop: '10vh', textAlign: 'center' }}><h1>Generar Recetas (en desarrollo)</h1></div>;
      default:
        return <Principal />;
    }
  };

  return (
    <div id="app">
      {renderPage()}
    </div>
  );
}

export default App;
