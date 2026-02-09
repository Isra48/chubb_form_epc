import col1Image from '../assets/col1.png';
import collage from '../assets/bigImg.jpg';
import titleImage from '../assets/titulo.png';

function GraphicPanel() {
  return (
    <>
      <div className="graphic-image-only" style={{ backgroundImage: `url(${col1Image})` }} aria-hidden="true" />
      <div className="graphic-content graphic-content--mobile">
        <div className="graphic-visual" aria-hidden="true">
          <div className="graphic-visual-image" style={{ backgroundImage: `url(${collage})` }} />
        </div>
        <div className="graphic-copy">
          <img className="graphic-title-image" src={titleImage} alt="Tu registro, claro y sin fricción." />
          <p className="graphic-statement">Fortaleciendo al sector afianzador, acelerando resultados.</p>
        </div>
      </div>
    </>
  );
}

export default GraphicPanel;
