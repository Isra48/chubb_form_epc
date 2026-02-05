import collage from '../assets/graphic-collage.svg';

function GraphicPanel() {
  return (
    <div className="graphic-content">
      <div className="graphic-visual" style={{ backgroundImage: `url(${collage})` }} aria-hidden="true" />
      <div className="graphic-copy">
        <p className="graphic-eyebrow">Formulario EPC</p>
        <h2 className="graphic-title">Tu registro, claro y sin friccion.</h2>
        <p className="graphic-subtitle">
          Completa los pasos con tranquilidad. Guardamos lo esencial para avanzar rapido.
        </p>
        <div className="graphic-tags">
          <span>3 minutos</span>
          <span>Datos seguros</span>
          <span>Proceso guiado</span>
        </div>
      </div>
    </div>
  );
}

export default GraphicPanel;
