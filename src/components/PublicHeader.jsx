"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Logo from '../assets/Logo.png';
import { logoutSesion, checkUserSession } from '../API/Auth';
//import logoutRol from '../context/AuthContext';

export const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  
  // Flag para evitar múltiples llamadas a checkSession
  const [sessionChecked, setSessionChecked] = useState(false)

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 915)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Detectar scroll para cambiar la opacidad
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Detectar si el usuario tiene sesión (AuthToken)
  useEffect(() => {
    if (sessionChecked) return; // Evitar ejecuciones múltiples
    
    const checkSession = async () => {
      const data = await checkUserSession();
      if (data?.user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setSessionChecked(true); // Marcar como completado
    };
    checkSession();
  }, [sessionChecked]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const menuItems = [
    { text: "Servicios", route: "/servicios" },
    { text: "Certificaciones", route: "/certificaciones" },
    { text: "Sobre Nosotros", route: "/nosotros" },
    { text: "Contactos", route: "/contactos" }
  ]

  const handleMenuClick = (route) => {
    closeMenu()
    navigate(route)
  }
  
  const handlePanelClick = () => {
    closeMenu()
    navigate("/panel-control")
  }

  const handleLogoClick = () => {
    navigate("/pagina-inicio")
  }

  const handleLoginClick = () => {
    closeMenu()
    navigate("/inicio-sesion")
  }

  const handleLogoutClick = async () => {
    const success = await logoutSesion()
    //logoutRol();
    if (success) {
      setIsLoggedIn(false)
      localStorage.clear()
      sessionStorage.clear()
      closeMenu()
      navigate("/pagina-inicio")
    }
  }

  return (
    <>
      <style>{`
        /* Base Styles */
.header {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1200px;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
}

.header-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease-in-out;
}

.header-glass.scrolled {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.container {
  padding: 0 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo-small {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo-small:hover {
  transform: scale(1.05);
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-text {
  color: #2E7D32;
  font-weight: bold;
  font-size: 1.3rem;
}

.nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
}

.nav-list li {
  position: relative;
}

.nav-list button {
  display: block;
  color: #2E7D32;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 10px 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-list button:hover {
  background-color: rgba(76, 175, 80, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  display: none;
  background: rgba(76, 175, 80, 0.1);
  border: none;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1002;
}

.menu-toggle:hover {
  background: rgba(76, 175, 80, 0.2);
  transform: scale(1.05);
}

.menu-toggle.hidden {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 24px;
  height: 20px;
}

.hamburger span {
  width: 100%;
  height: 2px;
  background: #2E7D32;
  transition: all 0.3s ease;
  border-radius: 1px;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.close-btn {
  display: none;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
}

.mobile-overlay.active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.header-spacer {
  height: 102px;
}

/* Tablet Styles (915px - 1024px) */
@media (max-width: 1024px) and (min-width: 916px) {
  .header {
    width: 92%;
  }

  .nav-list {
    gap: 4px;
  }

  .nav-list button {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}

/* Mobile Menu Styles (max-width: 915px) */
@media (max-width: 915px) {
  .header {
    width: 95%;
    top: 12px;
  }

  .header-content {
    height: 60px;
  }

  .container {
    padding: 0 16px;
  }

  .logo-text {
    font-size: 1.1rem;
  }

  .logo-icon {
    width: 55px;
    height: 55px;
  }

  .nav {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 280px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);
    transition: right 0.3s ease;
    z-index: 1001;
  }

  .nav.active {
    right: 0;
  }

  .nav-list {
    flex-direction: column;
    gap: 8px;
    padding: 80px 24px 24px;
    height: 100%;
    overflow-y: auto;
    display: flex;
    justify-content: flex-start;
  }

  .nav-list li {
    width: 100%;
  }

  .nav-list button {
    width: 100%;
    padding: 16px 20px;
    font-size: 1rem;
    border-radius: 12px;
    text-align: left;
  }

  
  /* CAMBIO 1: Estilos para los botones de Bootstrap en el menú móvil */
  .nav-list .btn {
    background: #2E7D32 !important;
    color: white !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 16px 20px !important;
    font-weight: 500 !important;
    font-size: 1rem !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    font-family: inherit !important;
  }

  .nav-list .btn:hover {
    background: #1B5E20 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3) !important;
  }

  .nav-list .btn-outline-success {
    background: #2E7D32 !important;
    color: white !important;
    border: none !important;
  }

  .nav-list .btn-outline-success:hover {
    background: #1B5E20 !important;
  }

  .nav-list .dropdown-toggle::after {
    display: none;
  }


  .right-section > div,
  .right-section > button:not(.menu-toggle) {
    display: none;  
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
    width: 48px;
    height: 48px;
    z-index: 1002;
  }

  .close-btn {
    display: flex;
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(76, 175, 80, 0.1);
    border: none;
    border-radius: 12px;
    padding: 10px;
    cursor: pointer;
    font-size: 1.5rem;
    color: #2E7D32;
    transition: all 0.3s ease;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    background: rgba(76, 175, 80, 0.2);
    transform: scale(1.05);
  }

  .header-spacer {
    height: 88px;
  }
}

/* Small Mobile Styles (max-width: 750px) */
@media (max-width: 750px) {
  .header {
    width: 96%;
    top: 10px;
  }

  .container {
    padding: 0 12px;
  }

  .header-content {
    height: 56px;
  }

  .logo-text {
    font-size: 1rem;
  }

  .logo-icon {
    width: 52px;
    height: 52px;
  }

  .nav {
    width: 100%;
    max-width: 300px;
  }

  .nav-list {
    padding: 70px 20px 20px;
  }

  .header-spacer {
    height: 80px;
  }
}

/* Extra Small Devices (max-width: 360px) */
@media (max-width: 360px) {
  .logo-text {
    font-size: 0.95rem;
  }

  .logo-small {
    gap: 8px;
  }

  .nav-list {
    padding: 60px 16px 16px;
  }

  .nav-list button {
    padding: 14px 16px;
    font-size: 0.95rem;
  }
}
      `}</style>

      <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu} />

      <header className="header">
        <div className={`header-glass ${scrolled ? 'scrolled' : ''}`}>
          <div className="container">
            <div className="header-content">
              <div className="logo-small" onClick={handleLogoClick}>
                <div className="logo-icon">
                  <img src={Logo} alt="Green On Logo" />
                </div>
                <span className="logo-text">Green On</span>
              </div>

              <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
                {isMenuOpen && (
                  <button className="close-btn" onClick={closeMenu}>
                    ×
                  </button>
                )}
                <ul className="nav-list">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <button onClick={() => handleMenuClick(item.route)}>
                        {item.text}
                      </button>
                    </li>
                  ))}
                  {/* Botones de cuenta en móvil */}
                  {isMobile && (
                    <li className="nav-item">
                      {isLoggedIn ? (
                        <div className="dropdown">
                          <button
                            className="btn btn-success dropdown-toggle w-100"
                            type="button"
                            id="mobileDropdownMenu"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Cuenta
                          </button>
                          <ul className="dropdown-menu w-100" aria-labelledby="mobileDropdownMenu">
                            <li>
                              <button className="dropdown-item" onClick={handlePanelClick}>
                                Ir al panel
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item text-danger" onClick={handleLogoutClick}>
                                Cerrar sesión
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <button
                          className="btn btn-outline-success w-100"
                          onClick={handleLoginClick}
                        >
                          Iniciar Sesión
                        </button>
                      )}
                    </li>
                  )}
                </ul>
              </nav>

              <div className="right-section">
                {/* Botones de cuenta en desktop */}
                {!isMobile && (
                  isLoggedIn ? (
                    <div className="dropdown">
                      <button
                        className="btn btn-success dropdown-toggle"
                        type="button"
                        id="desktopDropdownMenu"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Cuenta
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="desktopDropdownMenu">
                        <li>
                          <button className="dropdown-item" onClick={handlePanelClick}>
                            Ir al panel
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item text-danger" onClick={handleLogoutClick}>
                            Cerrar sesión
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <button className="btn btn-success" onClick={handleLoginClick}>
                      Iniciar Sesión
                    </button>
                  )
                )}

                <button 
                  className={`menu-toggle ${isMenuOpen ? 'hidden' : ''}`} 
                  onClick={toggleMenu} 
                  aria-label="Toggle menu" 
                  aria-expanded={isMenuOpen}
                >
                  <span className={`hamburger ${isMenuOpen ? "active" : ""}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="header-spacer" />
    </>
  )
}