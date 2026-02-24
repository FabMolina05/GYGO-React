import { useEffect } from "react";
import { PublicHeader } from "../../components/PublicHeader";
import Hero from "../../components/Hero";
import Mission from "../../components/Mission";
import Footer from "../../components/Footer";
import "../../styles/HomePage.css";
import { useAuth } from "../../context/AuthContext";

import BigLogo from '../../assets/BigLogo.png';

export const HomePage = () => {



  return (
    <div className="home-page">
      <PublicHeader />
      <main>
        <section className="brand-section">
          <div className="container">
            <div className="brand-logo">
              <div className="logo-container">
                <img
                  src={BigLogo}
                  alt="Green On Logo"
                  className="logo-image"
                ></img>
              </div>
              <p className="brand-tagline">
                SOLUCIÓN DE CONSULTORÍA DE SOSTENIBILIDAD
              </p>
            </div>
          </div>
        </section>
        <Hero />
        <Mission />
      </main>
      <Footer />
    </div>
  );
};
