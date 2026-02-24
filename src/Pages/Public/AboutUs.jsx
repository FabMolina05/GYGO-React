import { useEffect } from "react";
import { PublicHeader } from "../../components/PublicHeader";
import Footer from "../../components/Footer";
import "../../styles/AboutUsPage.css";
import { useAuth } from "../../context/AuthContext";
import Biotec from '../../assets/biotec.jpg';
import LaLima from '../../assets/1-51ca2921-removebg-preview (1).png';
import Garnier from '../../assets/Garnier-logo.png';


export const AboutUs = () => {
  
  return (
    <div className="about-page">
      <PublicHeader />
      <main>
        {/* Clients Section */}
        <section className="clients-section">
          <div className="container">
            <h2 className="section-title">Nuestros Clientes</h2>
            <div className="clients-grid">
              <div className="client-logo">
                <img src={Biotec} />
              </div>
              <div className="client-logo">
                <img src={LaLima} alt="LA LIMA" />
              </div>
              <div className="client-logo">
                <img src={Garnier} alt="GARNIER" />
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="about-us-section">
          <div className="container">
            <div className="about-content">
              <h2 className="section-title">Sobre Nosotros</h2>
              <div className="about-text-box">
                <p className="about-text">
                  Green On nació como una iniciativa para ayudar al desarrollo sostenible del país. Nuestra misión es brindar soluciones integrales que protejan todos sus ámbitos: ambiental, social y productivo mediante la implementación de tecnologías, ambientales prácticas y accesibles, sin perder de vista el ámbito económico, para un desarrollo efectivo e integral del impacto de nuestros clientes. Además de promover las iniciativas nacionales como lo son las certificaciones ambientales.
                </p>
                <p className="about-text">
                  Queremos que nuestros clientes puedan cumplir todas sus expectativas ambientales sin importar la naturaleza o tamaño de su empresa.
                </p>
              </div>
            </div>
          </div>
        </section>

       {/*  Founders Section
        <section className="founders-section">
          <div className="container">
            <h2 className="section-title">Nuestros Fundadores</h2>
            
            <div className="founders-grid">
              
              <div className="founder-card">
                <div className="founder-image">
                  <img src="src/assets/ericka-sandoval.jpg" alt="Ericka Sandoval" />
                </div>
                <div className="founder-info">
                  <h3 className="founder-name">Fabiola A. May</h3>
                  <p className="founder-description">
                    Cursante del MBA de sostenibilidad en la Escuela Ejecutiva y una profunda dedicación a la sostenibilidad ambiental y las iniciativas de banderas azules, Ericka Sandoval ha demostrado un compromiso inquebrantable con la creación de un impacto positivo duradero. Su enfoque integral hacia la gestión empresarial.
                  </p>
                  <p className="founder-description">
                    Como Presidenta Ejecutiva de Green Os, Ericka Sandoval ha impulsado la visión estratégica de la empresa, estableciendo estándares excepcionales para la sostenibilidad corporativa y la responsabilidad internacional por sus enfoques. Bajo su liderazgo, la empresa ha logrado integrar prácticas sostenibles en cada aspecto de sus operaciones, generando un crecimiento significativo y una reputación ejemplar en el mercado.
                  </p>
                  
                </div>
              </div>

              
              <div className="founder-card">
                <div className="founder-image">
                  <img src="src/assets/daniela-cambronero.jpg" alt="Daniela Cambronero" />
                </div>
                <div className="founder-info">
                  <h3 className="founder-name">Daniela Cambronero</h3>
                  <p className="founder-description">
                    Con una sólida formación en ingeniería ambiental y más de 8 años de experiencia en el campo de la sostenibilidad y las iniciativas de banderas azules, Daniela Cambronero ha demostrado una comprensión excepcional con la protección del medio ambiente. Su trabajo como Coordinadora de Prácticas Ambientales en Green Os. Despliega sus habilidades técnicas y creativas para organizar eventos que no solo educan, sino que también inspiran a otros a unirse a la causa ecológica y que reflejan los valores y objetivos de sostenibilidad de la empresa.
                  </p>
                  <p className="founder-description">
                    Su capacidad para diseñar y ejecutar eventos que generan un impacto duradero ha sido significativamente al éxito y la reputación de la empresa en el ámbito de la sostenibilidad. Su dedicación a la causa ambiental, combinada con su enfoque estratégico para la organización de eventos, ha liderado numerosos proyectos de sostenibilidad, trabajando en estrecha colaboración con empresas y organizaciones para desarrollar soluciones ambientales sostenibles y mejorar el rendimiento ambiental de la empresa.
                  </p>
                  
                </div> 
              </div>
             
            </div>
          </div>
        </section>*/}
      </main>
      <Footer />
    </div>
  );
};