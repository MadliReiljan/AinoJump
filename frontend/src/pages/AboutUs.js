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
            Aino on kogenud jumpingu­treener, kes on pühendunud sellele erivõimlemisvormile juba kahe aasta jagu. Oma teekonna alguses suundus ta Tallinnas toimuvale jumpingu koolitusele, mida viis läbi Tšehhist pärit spetsialist – just tema on peetud üheks selle treeningstiili tuntuimaks loojaiks. Pärast seda täiendas Aino end Tartus Hafiti trennides, kus Eesti turul on need sessioonid olnud peamised väravad jumpingu tutvustamiseks ja levitamiseks. Oma kogemuste ja omandatud teadmiste toel asutas Aino AinoJumpi, mille raames pakub ta tänini regulaarseid ja struktureeritud treeninguid nii algajatele kui edasijõudnutele.
            </p>
          </div>
                
          <div className="text-column">
            <p className="paragraph">
            Anna liitus AinoJumpi tiimiga hiljem, tuues endaga selge sooviga õppida korrektselt teostatud hüppeid ja efektiivseid treeningmeetodeid. Aino juhendamisel omandas Anna põhjaliku ettevalmistuse – alates õigest hüppetehnikast kuni rutiinide kavandamiseni – ning on nüüd võimeline Aino kõrval treeninguid läbi viima. Koos pakuvad Aino ja Anna struktureeritud, motiveeriva õhkkonnaga jumpingu­sessioone, mille fookuses on nii osalejate turvalisus kui ka individuaalsete arengueesmärkide saavutamine.
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