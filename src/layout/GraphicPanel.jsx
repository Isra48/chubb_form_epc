import collage from '../assets/bigImg.jpg';
import titleImage from '../assets/titulo.png';

function GraphicPanel() {
  return (
    <div className="graphic-content">
      <div className="graphic-visual" aria-hidden="true">
        <div className="graphic-visual-image" style={{ backgroundImage: `url(${collage})` }} />
      </div>
      <div className="graphic-copy">
        <img className="graphic-title-image" src={titleImage} alt="Tu registro, claro y sin friccion." />
        <p className="graphic-statement">Fortaleciendo al sector afianzador, acelerando resultados.</p>
      </div>
    </div>
  );
}

export default GraphicPanel;
