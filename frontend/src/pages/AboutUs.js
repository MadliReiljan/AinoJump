import React from 'react';
import '../styles/AboutUs.scss';
import contentImage1 from "../images/Anna.webp";
import contentImage2 from "../images/Aino-Anna.webp";
import contentImage3 from "../images/Aino.webp";

export const AboutUs = () => {
  return (
    <div className="about-container">
      <h2 className="meist-heading">Tutvu meiega</h2>
      <div className="text-section">
        <div className="text-block">
          <p className="paragraph">
            Aino on kogenud jumpingu­treener, kes on pühendunud sellele erivõimlemisvormile juba üle kahe aasta jagu. 
            Enda teekonna alguses suundus ta Tallinnas toimuvale jumpingu koolitusele, mida viis läbi Tšehhist pärit spetsialist, keda peetakse üheks selle treeningstiili kaasasutajaks. 
            Peale seda täiendas Aino enda oskuseid Tartus, Hafiti trennides, kus Eesti turul on need sessioonid olnud peamised väravad jumpingu tutvustamiseks ja levitamiseks. Enda kogemuste ja omandatud teadmiste toel asutas Aino AinoJumpi, mille raames pakub ta hetkel regulaarseid treeninguid nii algajatele kui ka edasijõudnutele.
          </p>
        </div>
            
        <div className="text-block">
          <p className="paragraph">
            Anna alustas jumpingu treeningutega osalejana, kuid leidis peagi, et see treeningstiil kõnetab teda sügavamalt. 
            Tema kasvav huvi ja pühendumus viisid ta edasi treenerikoolitustele. Nüüd töötab Anna koos Ainoga, kus nad pakuvad osalejatele hea ja mõnusa õhkkonnaga jumpingu trenne, keskenduvad osalejate heaolule ja korrektse sooritustehnika arendamisele.
          </p>
        </div>
      </div>

      <div className="gallery-section">
        <div className="image-gallery">
          <div className="individual-image-container">
            <div className="name-overlay">Anna</div>
            <img src={contentImage1} alt="Anna trampoline jumping" className="gallery-image" />
          </div>
          <div className="individual-image-container center-container">
            <img src={contentImage2} alt="Anna and Aino" className="gallery-image" />
          </div>
          <div className="individual-image-container">
            <div className="name-overlay right">Aino</div>
            <img src={contentImage3} alt="Aino trampoline jumping" className="gallery-image" />
          </div>
        </div>
      </div>
    </div>
  );
};