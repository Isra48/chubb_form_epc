function SplitScreenLayout({ left, right }) {
  return (
    <div className="split-layout">
      <aside className="split-layout__visual" aria-hidden="true">
        {left}
      </aside>
      <section className="split-layout__form">{right}</section>
    </div>
  );
}

export default SplitScreenLayout;
