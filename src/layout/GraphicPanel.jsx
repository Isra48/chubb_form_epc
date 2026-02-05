import collage from '../assets/graphic-collage.svg';
import titleImage from '../assets/title-text-placeholder.svg';

function GraphicPanel() {
  return (
    <div className="graphic-content">
      <div className="graphic-visual" style={{ backgroundImage: `url(${collage})` }} aria-hidden="true" />
      <div className="graphic-copy">
        <img className="graphic-title-image" src={titleImage} alt="Tu registro, claro y sin friccion." />
        <p className="graphic-statement">Fortaleciendo al sector afianzador, acelerando resultados.</p>
      </div>
    </div>
  );
}

export default GraphicPanel;
