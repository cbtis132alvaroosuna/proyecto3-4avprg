import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estados para autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ nombre: '', email: '', password: '' });
  const [showLogin, setShowLogin] = useState(true);
  const [authError, setAuthError] = useState('');

  // Estados para artículos de cocina
  const [articuloCocina, setArticuloCocina] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [errorApi, setErrorApi] = useState('');
  const [articulosGuardados, setArticulosGuardados] = useState([]);

  // API Key para Unsplash
  const UNSPLASH_ACCESS_KEY = 'LHJnDOytKFmcJzifc8u_ojVLp9PLnUiDnZ1G66x30rE';

  // Obtener artículo random de cocina
  const obtenerArticuloCocina = async () => {
    setCargando(true);
    setErrorApi('');
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=kitchen-appliance,cooking-tool,gourmet&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setArticuloCocina({
        id: data.id,
        imagen: data.urls.regular,
        titulo: data.description || "Artículo premium de cocina",
        descripcion: data.alt_description || "Herramienta culinaria de alta calidad",
        color: data.color || "#d4a373"
      });
    } catch (error) {
      setErrorApi('Error al cargar el artículo de cocina');
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  // Guardar artículo
  const guardarArticulo = () => {
    if (articuloCocina && !articulosGuardados.some(item => item.id === articuloCocina.id)) {
      setArticulosGuardados([...articulosGuardados, articuloCocina]);
    }
  };

  // Eliminar artículo guardado
  const eliminarArticulo = (id) => {
    setArticulosGuardados(articulosGuardados.filter(item => item.id !== id));
  };

  // Manejar login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setAuthError('Por favor completa todos los campos');
      return;
    }
    setIsLoggedIn(true);
    setUser({ email: loginForm.email });
    setAuthError('');
  };

  // Manejar registro
  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerForm.nombre || !registerForm.email || !registerForm.password) {
      setAuthError('Por favor completa todos los campos');
      return;
    }
    setIsLoggedIn(true);
    setUser({ nombre: registerForm.nombre, email: registerForm.email });
    setAuthError('');
  };

  // Cerrar sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setArticuloCocina(null);
    setArticulosGuardados([]);
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <div className="auth-container">
          <div className="auth-card">
            <h2>{showLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>

            {authError && <div className="error-message">{authError}</div>}

            {showLogin ? (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Contraseña:</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="auth-button">Ingresar</button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    value={registerForm.nombre}
                    onChange={(e) => setRegisterForm({...registerForm, nombre: e.target.value})}
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Contraseña:</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="auth-button">Registrarse</button>
              </form>
            )}

            <p className="auth-toggle">
              {showLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <span onClick={() => setShowLogin(!showLogin)}>
                {showLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <header className="dashboard-header">
            <h1>Bienvenid@ {user?.nombre || user?.email}</h1>
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
          </header>

          <main className="cocina-section">
            <section className="descubrir-section">
              <h2>Descubre Artículos de Cocina Premium</h2>
              <button
                onClick={obtenerArticuloCocina}
                className="cocina-button"
                disabled={cargando}
              >
                {cargando ? 'Cargando...' : 'Mostrar Artículo Exclusivo'}
              </button>

              {errorApi && <div className="error-message">{errorApi}</div>}

              {articuloCocina && (
                <div className="articulo-container" style={{ borderColor: articuloCocina.color }}>
                  <div className="imagen-premium-container">
                    <img 
                      src={articuloCocina.imagen} 
                      alt={articuloCocina.descripcion} 
                      className="imagen-premium"
                    />
                    <div className="badge-premium">PREMIUM</div>
                  </div>
                  <div className="articulo-info">
                    <h3 className="articulo-titulo">{articuloCocina.titulo}</h3>
                    <p className="articulo-descripcion">{articuloCocina.descripcion}</p>
                    <button onClick={guardarArticulo} className="guardar-button">
                      <i className="icon-guardar"></i> Guardar en Mi Colección
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="guardados-section">
              <h2>Mi Colección Culinaria</h2>
              {articulosGuardados.length === 0 ? (
                <p className="no-articulos">Aún no has guardado ningún artículo.</p>
              ) : (
                <div className="articulos-grid">
                  {articulosGuardados.map(articulo => (
                    <div key={articulo.id} className="articulo-guardado">
                      <div className="imagen-guardada-container">
                        <img 
                          src={articulo.imagen} 
                          alt={articulo.descripcion} 
                          className="imagen-guardada"
                        />
                      </div>
                      <div className="articulo-guardado-info">
                        <h4>{articulo.titulo}</h4>
                        <button 
                          onClick={() => eliminarArticulo(articulo.id)} 
                          className="eliminar-button"
                        >
                          <i className="icon-eliminar"></i> Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;