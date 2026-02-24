import "../styles/Footer.css"
import { useNavigate } from "react-router-dom"

const Footer = () => {
  const navigate = useNavigate()

  const handleMenuClick = (route) => {
    navigate(route);
  }
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h4>Servicios</h4>
            <ul>
              <li>
                <a href="#" onClick={() => handleMenuClick("/servicios")}>Auditoría Ambiental</a>
              </li>
              <li>
                <a href="#" onClick={() => handleMenuClick("/nosotros")}>Sobre Nosotros</a>
              </li>
              <li>
                <a href="#" onClick={() => handleMenuClick("/contactos")}>Paquetes</a>
              </li>

            </ul>
          </div>

          <div className="footer-column">
            <h4>Certificaciones</h4>
            <ul>
              <li>
                <a href="/certificaciones">Certificaciones disponibles</a>
              </li>
              <li>
                <a href="https://www.ict.go.cr/es/sostenibilidad/bandera-azul.html" target="_blank">Bandera Azul</a>
              </li>
              <li>
                <a href="https://cambioclimatico.minae.go.cr/programa-pais-carbono-neutralidad/" target="_blank" >Carbono Neutral</a>
              </li>
              <li>
                <a href="https://www.esencialcostarica.com/quienes-somos/" target="_blank">Esencial Costa Rica</a>
              </li>
            </ul>
          </div>



          <div className="footer-column">
            <h4>Contacto</h4>
            <ul>
              <li>
                <a >+(506) 6315-8782</a>
              </li>
              <li>
                <a >fabiolamay209@gmail.com</a>
              </li>
              <li>
                <a >123 Green Street</a>
              </li>
              <li>
                <a >Lun - Vie 9:00-18:00</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">

          <div className="footer-logo">
            <span>Green On</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
