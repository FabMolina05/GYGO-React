import React from 'react';
import { PublicHeader } from "../../components/PublicHeader";
import Footer from "../../components/Footer";
import { ArrowRight, FileText, Leaf, BookOpen, Award, Users, Phone, Mail, MapPin } from 'lucide-react';
import "../../styles/ServicesPage.css";
import { Link } from 'react-router-dom';
import beneficiosambientales from '../../assets/10-beneficios-ambientales-de-plantar-un-arbol.jpg';
import certificaciones from '../../assets/istockphoto-1446199740-612x612.jpg';


export const ServicesHomePage = () => {


  const services = [
    {
      id: '01',
      title: 'Consultoría En Gestión Ambiental De Empresas',
      description: 'Resolvemos cualquier inconveniente o duda acerca de la gestión ambiental de su empresa por medio de una consultoría integral y estratégica de profesionales.',
      details: 'Banderas Azul Ecológica, Bandera Costa Rica, Carbono Neutral, Agricultura Orgánica y Agroindustria Sostenible.',
      icon: <FileText className="w-8 h-8" />,
      image: beneficiosambientales
    },
    {
      id: '02',
      title: 'Planes, Programas Y Políticas De Gestión Ambiental',
      description: 'Generación de políticas ambientales, políticas de gestión integral y programas de manejo de residuos, planes de gestión ambiental institucional.',
      details: 'Ofrecemos estrategias integrales para la gestión de residuos, planes de educación ambiental según sea su necesidad.',
      icon: <Leaf className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    },
    {
      id: '03',
      title: 'Eventos Sostenibles',
      description: 'Ofrecemos paquetes para obtención de certificaciones ambientales para sus eventos. También brindamos asistencia técnica de los eventos con personal ambientalista.',
      details: 'Brindamos estrategias ambientales para eventos, adecuación con el plan de gestión ambiental asignado con políticas empresariales.',
      icon: <Users className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    },
    {
      id: '04',
      title: 'Certificaciones Ambientales',
      description: 'Obtención y mantenimiento de certificaciones ambientales reconocidas internacionalmente para empresas y organizaciones.',
      details: 'Acompañamiento completo en procesos de certificación para garantizar el cumplimiento de estándares ambientales.',
      icon: <Award className="w-8 h-8" />,
      image: certificaciones
    },
    {
      id: '05',
      title: 'Educación Ambiental',
      description: 'Programas educativos personalizados para empresas, instituciones y comunidades, enfocados en la conciencia ambiental.',
      details: 'Capacitaciones y talleres diseñados para promover prácticas sostenibles y responsabilidad ambiental.',
      icon: <BookOpen className="w-8 h-8" />,
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    }
  ];

  return (
    <div className="services-page">
      <PublicHeader />
      <main>
        {/* Hero Section */}
        <section className="services-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Nuestros Servicios</h1>
              <p className="hero-subtitle">
                Soluciones integrales en gestión ambiental para empresas comprometidas con la sostenibilidad
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="services-grid-section">
          <div className="container">
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-image">
                    <img src={service.image} alt={service.title} />
                    <div className="service-overlay">
                      <div className="service-icon">
                        {service.icon}
                      </div>
                    </div>
                  </div>
                  <div className="service-content">
                    <div className="service-number">{service.id}</div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                    <p className="service-details">{service.details}</p>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Carbon Footprint Platform Section */}
        <section className="platform-section">
          <div className="container">
            <div className="platform-content">
              <div className="platform-text">
                <h2 className="platform-title">Gestión de Huella de Carbono</h2>
                <p className="platform-subtitle">
                  Puedes ingresar a nuestra plataforma de gestión de huella de carbono
                </p>
                <Link to="/inicio-sesion" className="platform-btn">
                  Ingresar a la Plataforma
                </Link>
              </div>
              <div className="platform-image">
                <img
                  src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                  alt="Plataforma de gestión de huella de carbono"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="container-contact">
            <div className="contact-content">
              <div className="contact-info">
                <h2 className="contact-title">¿Listo para comenzar?</h2>
                <p className="contact-subtitle">
                  Contacta con nosotros para obtener más información sobre nuestros servicios
                </p>
                <div className="contact-details">
                  <div className="contact-item">
                    <Phone className="w-6 h-6" />
                    <div style={{ marginLeft: "8%" }}>
                      <h4>Teléfono</h4>
                      <p>+(506) 6315-8782</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Mail className="w-6 h-6" />
                    <div >
                      <h4>Email</h4>
                      <p>fabiolamay209@gmail.com</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <MapPin className="w-6 h-6" />
                    <div style={{ marginLeft: "8%" }}>
                      <h4>Ubicación</h4>
                      <p>Alajuela, Costa Rica</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* 
                  <div className="contact-form">
                    <h3>Solicita una Consulta</h3>
                    <form>
                      <div className="form-group">
                        <input type="text" placeholder="Nombre completo" required />
                      </div>
                      <div className="form-group">
                        <input type="email" placeholder="Correo electrónico" required />
                      </div>
                      <div className="form-group">
                        <input type="tel" placeholder="Teléfono" required />
                      </div>
                      <div className="form-group">
                        <select required>
                          <option value="">Selecciona un servicio</option>
                          <option value="consultoria">Consultoría en Gestión Ambiental</option>
                          <option value="planes">Planes y Programas</option>
                          <option value="eventos">Eventos Sostenibles</option>
                          <option value="certificaciones">Certificaciones</option>
                          <option value="educacion">Educación Ambiental</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <textarea placeholder="Mensaje" rows="4" required></textarea>
                      </div>
                      <button type="submit" className="submit-btn">
                        Enviar Mensaje
                      </button>
                    </form>
                  </div> */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};