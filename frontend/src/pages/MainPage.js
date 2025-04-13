import React from 'react';
import { NavLink } from "react-router-dom";
import "../styles/GlobalContainer.scss"
import heroImage from "../images/IMG_4844.jpg"
import contentImage from "../images/MainImage.jpg" 

export const MainPage = () => {
  return (
    <>
      <div style={styles.heroSection}>
        <div style={styles.overlay}></div>
        
        <div className="container-transparent" style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <h1 style={styles.heading}>Tule hüppa meiega!</h1>
            <NavLink to="/broneeri" style={styles.booking} className="booking-link"> Broneeri </NavLink>
          </div>
        </div>

        <div style={styles.svgContainer}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 720" 
            preserveAspectRatio="none" 
            style={styles.svg}
          >
            <path 
              fill="#1C1C1C" 
              d="M0,0 C480,920 960,920 1440,0 L1440,920 L0,920 Z" 
            ></path>
          </svg>
        </div>
      </div>
      
      <div className="container">
        <div className="two-column-section">
          <div className="text-column">
          <h2 className="section-heading">
            <span className="highlight-text">Jumping</span>, mis see on?
          </h2>
            <p className="paragraph">
            Jumpingu batuuditreening on dünaamiline treeningvorm, mis ühendab aeglased ja kiiremad hüpped, traditsioonilise aeroobika sammude variatsioonid ning kiirus- ja jõuelementide kombinatsiooni. Selle treeningu juured ulatuvad tagasi trampoliinide arenguni 1930. aastatel, mil Ameerika sportlased ja leiutajad nagu George Nissen ja Larry Griswold hakkasid kasutama hüppamist treeninguna, et parandada koordinatsiooni, jõudu ja vastupidavust. Alguses mõeldud peamiselt sportlikeks ja akrobaatlikeks harjutusteks, on jumping arenenud üldiseks kehalise aktiivsuse vormiks, mis rõhutab kogu keha lihaste töö ja pidevaid gravitatsioonilisi muutusi – protsessi, kus ühes treeningus aktiveeritakse üle 400 lihast. 
            </p>
            <p className="paragraph">
            Selline intensiivne ja mitmekülgne liikumine muudab jumping treeningu kolm korda efektiivsemaks kui jooksmine, pakkudes samal ajal ka palju rõõmu ja motivatsiooni. Treeningu eesmärk on mitte ainult füüsiline tugevdamine, vaid ka lõbus liikumisvorm, mis sobib kõigile – olenemata vanusest või varasemast treeningukogemusest.
            </p>
          </div>
          
          <div className="image-column">
            <div className="content-image-container">
              <img 
                src={contentImage} 
                alt="AinoJump facility" 
                className="content-image"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container2">
        <div className="one-column-section">
          <div className="text-column">
          <h2 className="section-heading">
            <span className="highlight-text">Tule trenni!</span>
          </h2>
            <p className="paragraph">
            Astuge samm tervislikuma elu suunas! Broneeri trenni ja avasta, kuidas jumping võib muuta teie treeningrutiini, pakkudes lõbusat ja efektiivset viisi keha vormis hoidmiseks. Liitu meiega, et kogeda positiivset muutust nii füüsiliselt kui ka vaimselt – treeningud on loodud igas vanuses ja igas kehalises vormis inimestele.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  heroSection: {
    height: '600px',
    position: 'relative',
    width: '100%',
    backgroundImage: `url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center bottom',
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1
  },
  
  heroContainer: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  heroContent: {
    textAlign: 'center',
    color: 'white'
  },
  
  heading: {
    fontSize: '60px',
    marginBottom: '1rem',
    fontWeight: '400',
  },

  booking: {
    fontSize: '1.5rem',
    fontWeight: 'regular',
    marginBottom: '1rem',
    border: '2px solid #ADDD6D', 
    borderRadius: '50px',
    padding: '0.5rem 2rem',
    display: 'inline-block',
    color: 'white', 
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  svgContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    width: '100%',
    zIndex: 3
  },
  
  svg: {
    display: 'block',
    width: '100%',
    height: '50px'
  }
}