import React from 'react';
import '../styles/GlobalContainer.scss';
import '../styles/AboutUs.scss';
import contentImage1 from "../images/Anna.jpg";
import contentImage2 from "../images/Aino-Anna.jpg";
import contentImage3 from "../images/Aino.jpg";

export const AboutUs = () => {
  return (
    <div className="container">
      <h2 className="meist-heading">Tutvu meiega</h2>
        <div className="two-column-section">
          <div className="text-column">
            <p className="paragraph">
              Jumpingu batuuditreening on dünaamiline treeningvorm, mis ühendab aeglased ja kiiremad hüpped, traditsioonilise aeroobika sammude variatsioonid ning kiirus- ja jõuelementide kombinatsiooni. Selle treeningu juured ulatuvad tagasi trampoliinide arenguni 1930. aastatel, mil Ameerika sportlased ja leiutajad nagu George Nissen ja Larry Griswold hakkasid kasutama hüppamist treeninguna, et parandada koordinatsiooni, jõudu ja vastupidavust. Alguses mõeldud peamiselt sportlikeks ja akrobaatlikeks harjutusteks, on jumping arenenud üldiseks kehalise aktiivsuse vormiks, mis rõhutab kogu keha lihaste töö ja pidevaid gravitatsioonilisi muutusi – protsessi, kus ühes treeningus aktiveeritakse üle 400 lihast. 
            </p>
            <p className="paragraph">
              Selline intensiivne ja mitmekülgne liikumine muudab jumping treeningu kolm korda efektiivsemaks kui jooksmine, pakkudes samal ajal ka palju rõõmu ja motivatsiooni. Treeningu eesmärk on mitte ainult füüsiline tugevdamine, vaid ka lõbus liikumisvorm, mis sobib kõigile – olenemata vanusest või varasemast treeningukogemusest.
            </p>
          </div>
                
          <div className="text-column">
            <p className="paragraph">
              Jumpingu batuuditreening on dünaamiline treeningvorm, mis ühendab aeglased ja kiiremad hüpped, traditsioonilise aeroobika sammude variatsioonid ning kiirus- ja jõuelementide kombinatsiooni. Selle treeningu juured ulatuvad tagasi trampoliinide arenguni 1930. aastatel, mil Ameerika sportlased ja leiutajad nagu George Nissen ja Larry Griswold hakkasid kasutama hüppamist treeninguna, et parandada koordinatsiooni, jõudu ja vastupidavust. Alguses mõeldud peamiselt sportlikeks ja akrobaatlikeks harjutusteks, on jumping arenenud üldiseks kehalise aktiivsuse vormiks, mis rõhutab kogu keha lihaste töö ja pidevaid gravitatsioonilisi muutusi – protsessi, kus ühes treeningus aktiveeritakse üle 400 lihast. 
            </p>
            <p className="paragraph">
              Selline intensiivne ja mitmekülgne liikumine muudab jumping treeningu kolm korda efektiivsemaks kui jooksmine, pakkudes samal ajal ka palju rõõmu ja motivatsiooni. Treeningu eesmärk on mitte ainult füüsiline tugevdamine, vaid ka lõbus liikumisvorm, mis sobib kõigile – olenemata vanusest või varasemast treeningukogemusest.
            </p>
          </div>
        </div>

      
      <div className="name-row">
        <div className="name">Anna</div>
        <div className="name">Aino</div>
      </div>
      
      <div className="image-gallery">
        <div className="individual-image-container">
          <img src={contentImage1} alt="Anna trampoline jumping" className="gallery-image" />
        </div>
        <div className="individual-image-container center-container">
          <img src={contentImage2} alt="Anna and Aino" className="gallery-image" />
        </div>
        <div className="individual-image-container">
          <img src={contentImage3} alt="Aino trampoline jumping" className="gallery-image" />
        </div>
      </div>
    </div>
  );
};