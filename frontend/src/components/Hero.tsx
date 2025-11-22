interface Props {
  onContactClick: () => void
}

export const Hero = ({ onContactClick }: Props) => (
  <section className="hero">
    <div className="hero-copy">
      <p className="eyebrow">Project bundles built for builders</p>
      <h1>
        Ship portfolio-grade work with <span>production ready</span> briefs.
      </h1>
      <p>
        Browse curated bundles across UI/UX, AI engineering, and automation. Every project contains explainer notes,
        reusable assets, and clearly scoped deliverables.
      </p>
      <div className="hero-cta">
        <a className="btn" href="#projects">
          Browse projects
        </a>
        <button type="button" className="btn ghost" onClick={onContactClick}>
          Schedule a call
        </button>
      </div>
      <ul className="hero-points">
        <li>Realtime availability &amp; pricing</li>
        <li>One-click Razorpay checkout</li>
        <li>Download links emailed instantly</li>
      </ul>
    </div>
    <div className="hero-panel">
      <div className="glow" />
      <div className="hero-card">
        <p>Live bundles</p>
        <h3>Discover projects that mirror on-the-job briefs.</h3>
        <ul>
          <li>Domain filters &amp; keyword search.</li>
          <li>Sub-project breakdowns.</li>
          <li>Tooling guidance &amp; mentor notes.</li>
        </ul>
      </div>
    </div>
  </section>
)
