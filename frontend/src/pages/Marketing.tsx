import { useMemo, useState } from 'react'
import { CheckoutSheet } from '../components/CheckoutSheet'
import { DownloadForm } from '../components/DownloadForm'
import { FaqList } from '../components/FaqList'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Highlights } from '../components/Highlights'
import { LeadForm } from '../components/LeadForm'
import { NotificationStack } from '../components/NotificationStack'
import { ProjectFilters } from '../components/ProjectFilters'
import { ProjectGrid } from '../components/ProjectGrid'
import { SiteHeader } from '../components/SiteHeader'
import { StatsStrip } from '../components/StatsStrip'
import { TestimonialsMarquee } from '../components/TestimonialsMarquee'
import { useNotifications } from '../hooks/useNotifications'
import { useProjectData } from '../hooks/useProjectData'
import type { Project } from '../types/project'

export const MarketingPage = () => {
  const { projects, domains, loading, error } = useProjectData()
  const domainNameMap = useMemo(() => {
    const entries: Record<string, string> = {}
    domains.forEach((domain) => {
      entries[domain._id] = domain.name
    })
    return entries
  }, [domains])

  const [selectedDomain, setSelectedDomain] = useState('all')
  const [query, setQuery] = useState('')
  const [checkoutProject, setCheckoutProject] = useState<Project | null>(null)
  const [recentDownloadLink, setRecentDownloadLink] = useState<string | null>(null)
  const { notifications, push, dismiss } = useNotifications()

  const filteredProjects = useMemo(() => {
    let scoped = [...projects]
    if (selectedDomain === 'featured') {
      scoped = projects.slice(0, Math.min(6, projects.length))
    } else if (selectedDomain !== 'all') {
      scoped = scoped.filter((project) => project.projectDomain === selectedDomain)
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      scoped = scoped.filter(
        (project) =>
          project.projectTitle.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q) ||
          (project.keyWords ?? []).some((keyword) => keyword.toLowerCase().includes(q)),
      )
    }

    return scoped
  }, [projects, selectedDomain, query])

  const handleContactClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <NotificationStack notifications={notifications} onDismiss={dismiss} />
      <CheckoutSheet
        project={checkoutProject}
        onClose={() => setCheckoutProject(null)}
        onSuccess={(link) => setRecentDownloadLink(link)}
        notify={push}
      />

      <SiteHeader onContactClick={handleContactClick} />
      <Hero onContactClick={handleContactClick} />
      <StatsStrip />

      {recentDownloadLink && (
        <div className="banner success">
          <p>
            Download link ready:&nbsp;
            <a href={recentDownloadLink} target="_blank" rel="noreferrer">
              {recentDownloadLink}
            </a>
          </p>
        </div>
      )}

      <section className="section" id="projects">
        <header>
          <p className="eyebrow">Available bundles</p>
          <h2>Choose a project with confidence</h2>
          <p>Filter by domain, search for tooling keywords, and preview the deliverables before purchasing.</p>
        </header>

        <ProjectFilters
          domains={domains}
          selectedDomain={selectedDomain}
          onSelectDomain={setSelectedDomain}
          query={query}
          onQueryChange={setQuery}
        />

        {error && <div className="banner error">{error}</div>}

        <ProjectGrid
          projects={filteredProjects}
          loading={loading}
          domainMap={domainNameMap}
          onSelectProject={setCheckoutProject}
        />
      </section>

      <section className="section" id="highlights">
        <header>
          <p className="eyebrow">Built for builders</p>
          <h2>Everything you need to start shipping</h2>
        </header>
        <Highlights />
      </section>

      <section className="section testimonials">
        <header>
          <p className="eyebrow">Community voices</p>
          <h2>Stories from recent builders</h2>
        </header>
        <TestimonialsMarquee />
      </section>

      <section className="section dual">
        <DownloadForm notify={push} />
        <LeadForm notify={push} />
      </section>

      <section className="section" id="faq">
        <header>
          <p className="eyebrow">FAQs</p>
          <h2>Answers before you swipe the card</h2>
        </header>
        <FaqList />
      </section>

      <Footer />
    </div>
  )
}
