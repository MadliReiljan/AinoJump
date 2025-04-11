import React from 'react'
import "../styles/GlobalContainer.scss"
import heroImage from "../images/IMG_4844.jpg"

export const MainPage = () => {
  return (
    <>
      <div style={styles.heroSection}>

        <div style={styles.overlay}></div>
        
        <div className="container-transparent" style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <h1 style={styles.heading}>Tere tulemast AinoJumpi!</h1>
          </div>
        </div>

        <div style={styles.svgContainer}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none" 
            style={styles.svg}
          >
            <path 
              fill="#1C1C1C" 
              d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" 
            ></path>
          </svg>
        </div>
      </div>
      
      <div className='container'>
        <div style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </div>
    </>
  )
}

const styles = {

  heroSection: {
    height: '500px',
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
    fontSize: '3rem',
    marginBottom: '1rem'
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
  },
  
  paragraph: {
    marginBottom: '2rem'
  }
}