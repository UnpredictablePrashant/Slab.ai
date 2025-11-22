interface Props {
  onContactClick: () => void
}

export const SiteHeader = ({ onContactClick }: Props) => (
  <header className="site-header">
    <div className="logo">
      <span>Slab.ai</span>
      <small>Projects</small>
    </div>
    <nav>
      <a href="#projects">Projects</a>
      <a href="#highlights">Why us</a>
      <a href="#faq">FAQs</a>
      <button type="button" onClick={onContactClick}>
        Talk to us
      </button>
    </nav>
  </header>
)
