import React from 'react';
import { NavLink } from "react-router-dom";
import "../styles/GlobalContainer.scss"
import heroImage from "../images/IMG_4844.webp";
import mainImg from "../images/main1.webp";
import mainImg2 from "../images/main2.webp";
import mainImg3 from "../images/main3.webp"; 
import mainImg4 from "../images/main4.webp";
import contentImage from "../images/MainImage.webp";
import CircleBackground from "../components/CircleBackground";

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
            Jumping batuuditreening on kombinatsioon aeglastest ja kiiretest hüpetest, traditsioonilise aeroobika sammude variatsioonidest ning dünaamilistest kiirus- ja jõuspordielementidest. 
            Selle treeningu juured ulatuvad 1930. aastatesse, mil Ameerika sportlased ja leiutajad, nagu George Nissen ja Larry Griswold, hakkasid trampoliine kasutama hüppetreeninguteks, et parandada koordinatsiooni, jõudu ja vastupidavust.
            Alguses mõeldud peamiselt sportlikeks ja akrobaatlikeks harjutusteks, on jumping arenenud kolm korda efektiivsemaks kehalise aktiivsuse vormiks kui jooksmine. See on tingitud pidevatest gravitatsioonilistest muutustest, mis hõlmavad enam kui 400 lihase pingutust ja lõdvestust samal ajal. Seda on palju rohkem kui mistahes muu vastupidavusspordiala puhul.
            </p>
            <p className="paragraph">
            Selline intensiivne ja mitmekülgne liikumisvorm aitab arendada vastupidavust, koordinatsiooni ja lihasjõudu, pakkudes samal ajal vaheldusrikast ning kaasahaaravat treeningkogemust. Jumping sobib igas vanuses ja erineva tasemega harrastajatele, olles nii tõhus kui ka lõbus viis kehalise vormi parandamiseks.
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
      <div className="container">
        <div className="benefits-grid">
          <div className="benefits-heading">
            <h2 className="section-heading">
              Miks just <span className="highlight-text">Jumping?</span>
            </h2>
          </div>
          <CircleBackground className="circle-large" />
          <div className="benefits-row">
            <div className="benefit-card">
              <div className="benefit-image-container">
                <img 
                  src={mainImg} 
                  alt="Südame tervis" 
                  className="benefit-image"
                />
              </div>
              <h3 className="benefit-title">Südame tervis ja vereringe</h3>
              <p className="benefit-description">
                Jumping tõstab pulssi ja soodustab vereringe paranemist,
                mis aitab parandada südant ning kardiovaskulaarset vastupidavust.
              </p>
            </div>
            
            <div className="benefit-card offset-card">
              <div className="benefit-image-container">
                <img 
                  src={mainImg2} 
                  alt="Koordinatsioon" 
                  className="benefit-image"
                />
              </div>
              <h3 className="benefit-title">Koordinatsioon ja tasakaal</h3>
              <p className="benefit-description">
                Treeningu käigus kasutatavad hüpped ja pöörded aitavad arendada
                keha koordinatsiooni ja tasakaalu, mis tõstab igapäevast liikumisoskust.
              </p>
            </div>
          </div>
          
          <div className="benefits-row">
            <div className="benefit-card">
              <div className="benefit-image-container">
                <img 
                  src={mainImg3}
                  alt="Kalorite põletus" 
                  className="benefit-image"
                />
              </div>
              <h3 className="benefit-title">Kalorite põletus ja vormisolek</h3>
              <p className="benefit-description">
                Jumping on suurepärane viis kaloreid põletada, muutes treeningud
                dünaamiliseks ja motiveerivaks ning toetades kehalise vormi säilitamist.
              </p>
            </div>
            
            <div className="benefit-card offset-card">
              <div className="benefit-image-container">
                <img 
                  src={mainImg4} 
                  alt="Stressi maandamine" 
                  className="benefit-image"
                />
              </div>
              <h3 className="benefit-title">Stressi maandamine ja heaolu</h3>
              <p className="benefit-description">
              Jumping aitab pingetest vabaneda ja stressi leevendada, pakkudes samal ajal lõbusat ja energilist liikumist, mis tõstab meeleolu ja parandab enesetunnet.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container2" style={{ marginBottom: '5rem' }}>
        <div className="one-column-section">
          <div className="text-column">
          <h2 className="section-heading">
            <span className="highlight-text">Tule trenni!</span>
          </h2>
            <p className="paragraph">
            Astuge samm tervislikuma elu suunas! Broneeri trenn ja avasta, kuidas jumping võib muuta Teie treeningrutiini, mis pakub lõbusat ja efektiivset viisi keha vormis hoidmiseks. Liitu meiega, et kogeda positiivset muutust nii füüsiliselt kui ka vaimselt — treeningud on loodud igas vanuses ja igas kehalises vormis inimestele.
            </p>
            <NavLink to="/broneeri" style={styles.booking} className="booking-link"> Broneeri trenn </NavLink>
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