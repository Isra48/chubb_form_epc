function SplitLayout({ graphic, form }) {
  return (
    <main className="split-layout">
      <aside className="graphic-panel">{graphic}</aside>
      <section className="form-panel">{form}</section>
    </main>
  );
}

export default SplitLayout;
