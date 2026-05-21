import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import { Button } from '../components/common/Button/Button';
import { Badge } from '../components/common/Badge/Badge';
import { Avatar } from '../components/common/Avatar/Avatar';
import { ScoreRing } from '../components/hiring/ScoreRing/ScoreRing';
import { AgentStatus } from '../components/hiring/AgentStatus/AgentStatus';
import type { AgentLog } from '../components/hiring/AgentStatus/AgentStatus';

// ─── Nav ─────────────────────────────────────────────────────────────────────

const Nav: React.FC<{ onDemo: () => void; onAuth: () => void }> = ({ onDemo, onAuth }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
      <div className="lp-nav__inner">
        <a href="#" className="lp-logo">
          <LogoMark />
          HireAgent
        </a>
        <ul className="lp-nav__links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#results">Results</a></li>
        </ul>
        <div className="lp-nav__cta">
          <Button variant="ghost" size="sm" onClick={onAuth}>Sign in</Button>
          <Button variant="primary" size="sm" onClick={onDemo}>Get started</Button>
        </div>
      </div>
    </nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

const AGENT_LOGS: AgentLog[] = [
  { id: '1', message: 'Fetched 128 applications for Senior Engineer', timestamp: '09:41', type: 'info' },
  { id: '2', message: 'Parsed & ranked 128 resumes via Claude', timestamp: '09:42', type: 'info' },
  { id: '3', message: 'Top 14 candidates shortlisted (score ≥ 80)', timestamp: '09:43', type: 'success' },
  { id: '4', message: 'Interview slots auto-booked for 5 candidates', timestamp: '09:44', type: 'success' },
];

const HERO_CANDIDATES = [
  { name: 'Priya Sharma',   role: 'Frontend Engineer',    score: 93 },
  { name: 'Marcus Johnson', role: 'Full Stack Developer',  score: 87 },
  { name: 'Aisha Patel',    role: 'UI Engineer',           score: 81 },
];

const Hero: React.FC<{ onDemo: () => void }> = ({ onDemo }) => (
  <section className="lp-hero">
    <div className="lp-hero__content">
      <div className="lp-hero__badge">
        <span className="lp-hero__badge-dot" />
        AI-powered · Zero manual screening
      </div>
      <h1 className="lp-hero__headline">
        Hire the&nbsp;best
        <br />
        <span className="lp-hero__accent">10× faster</span>
      </h1>
      <p className="lp-hero__sub">
        HireAgent uses AI to read every resume, score every candidate,
        and schedule interviews — automatically. You only talk to people
        worth hiring.
      </p>
      <div className="lp-hero__actions">
        <Button variant="primary" size="lg" onClick={onDemo}>
          See it in action
        </Button>
        <Button variant="ghost" size="lg">
          Watch demo &nbsp;▶
        </Button>
      </div>
      <p className="lp-hero__footnote">No credit card required · Free 14-day trial</p>
    </div>

    <div className="lp-hero__visual">
      {/* Agent status panel */}
      <div className="lp-hero__panel lp-hero__panel--agent">
        <AgentStatus
          state="screening"
          currentTask="Scoring resumes for Senior Engineer role…"
          progress={72}
          candidatesProcessed={92}
          totalCandidates={128}
          logs={AGENT_LOGS}
        />
      </div>

      {/* Candidate score cards */}
      <div className="lp-hero__candidates">
        {HERO_CANDIDATES.map((c, i) => (
          <div key={c.name} className="lp-hero__cand" style={{ animationDelay: `${i * 0.12}s` }}>
            <Avatar name={c.name} size="sm" />
            <div className="lp-hero__cand-info">
              <span className="lp-hero__cand-name">{c.name}</span>
              <span className="lp-hero__cand-role">{c.role}</span>
            </div>
            <ScoreRing score={c.score} size={44} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '10×',  label: 'faster time-to-hire' },
  { value: '94%',  label: 'screening accuracy' },
  { value: '80%',  label: 'reduction in recruiter hours' },
  { value: '3.2×', label: 'more diverse shortlists' },
];

const Stats: React.FC = () => (
  <section className="lp-stats">
    <div className="lp-container">
      {STATS.map(s => (
        <div key={s.label} className="lp-stats__item">
          <span className="lp-stats__value">{s.value}</span>
          <span className="lp-stats__label">{s.label}</span>
        </div>
      ))}
    </div>
  </section>
);

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <BrainIcon />,
    title: 'AI Resume Screening',
    desc: 'Claude reads every application and scores candidates against your exact job requirements — no keyword matching, genuine understanding.',
  },
  {
    icon: <RankIcon />,
    title: 'Smart Candidate Ranking',
    desc: 'Every applicant receives a contextual match score. Your shortlist is always sorted best-first, with reasoning you can inspect.',
  },
  {
    icon: <CalendarIcon />,
    title: 'Auto Interview Scheduling',
    desc: 'The agent finds mutual availability and books interviews directly into calendars — no back-and-forth emails.',
  },
  {
    icon: <PipelineIcon />,
    title: 'Full Pipeline Tracking',
    desc: 'Follow every candidate from application to offer in a unified view. Status updates are automatic as the agent progresses.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Bias Reduction',
    desc: 'Scoring is based purely on skills and experience. Demographic signals are intentionally excluded from the ranking model.',
  },
  {
    icon: <ChartIcon />,
    title: 'Hiring Analytics',
    desc: 'Track time-to-hire, source quality, offer acceptance rates, and agent performance across every open role.',
  },
];

const Features: React.FC = () => (
  <section className="lp-features" id="features">
    <div className="lp-container">
      <div className="lp-section-label">Features</div>
      <h2 className="lp-section-title">Everything your recruiting team needs</h2>
      <p className="lp-section-sub">
        One agent handles the entire top-of-funnel so your team focuses on relationships, not spreadsheets.
      </p>
      <div className="lp-features__grid">
        {FEATURES.map(f => (
          <div key={f.title} className="lp-feature-card">
            <div className="lp-feature-card__icon">{f.icon}</div>
            <h3 className="lp-feature-card__title">{f.title}</h3>
            <p className="lp-feature-card__desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── How it works ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: '01',
    title: 'Post your job',
    desc: 'Describe the role in plain language. HireAgent extracts the skills, experience, and culture signals that matter.',
    badge: 'Setup · 2 min',
  },
  {
    num: '02',
    title: 'Agent screens applicants',
    desc: 'Every resume is read, parsed, and scored in real-time. The agent handles 100s of applicants overnight.',
    badge: 'Automated',
  },
  {
    num: '03',
    title: 'Review your shortlist',
    desc: 'Wake up to a ranked, scored shortlist with AI-generated summaries. Approve or dismiss with one click.',
    badge: 'Your call',
  },
  {
    num: '04',
    title: 'Interviews booked',
    desc: 'For approved candidates, the agent schedules interviews, sends invites, and adds video links — automatically.',
    badge: 'Automated',
  },
];

const HowItWorks: React.FC = () => (
  <section className="lp-how" id="how-it-works">
    <div className="lp-container">
      <div className="lp-section-label">How it works</div>
      <h2 className="lp-section-title">From job post to shortlist overnight</h2>
      <p className="lp-section-sub">
        A four-step loop that runs autonomously so you can focus on the humans, not the process.
      </p>
      <div className="lp-how__steps">
        {STEPS.map((step, i) => (
          <div key={step.num} className="lp-how__step">
            <div className="lp-how__step-left">
              <span className="lp-how__step-num">{step.num}</span>
              {i < STEPS.length - 1 && <span className="lp-how__step-line" />}
            </div>
            <div className="lp-how__step-body">
              <Badge variant="primary">{step.badge}</Badge>
              <h3 className="lp-how__step-title">{step.title}</h3>
              <p className="lp-how__step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Social proof ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: 'We used to spend 3 days screening 200 applications. HireAgent does it overnight and the quality is better than what we were doing manually.',
    name: 'Sarah Chen',
    title: 'Head of Talent, Stripe',
    score: 94,
  },
  {
    quote: 'The bias reduction piece sold us. Our shortlists are measurably more diverse now without any extra effort from the team.',
    name: 'James Okafor',
    title: 'VP People, Vercel',
    score: 91,
  },
  {
    quote: "I was skeptical an AI could understand nuanced roles. I was wrong. The candidate summaries are better than what a junior recruiter writes.",
    name: 'Mia Tanaka',
    title: 'Recruiting Lead, Linear',
    score: 88,
  },
];

const Results: React.FC = () => (
  <section className="lp-results" id="results">
    <div className="lp-container">
      <div className="lp-section-label">Results</div>
      <h2 className="lp-section-title">Trusted by fast-moving teams</h2>
      <div className="lp-results__grid">
        {TESTIMONIALS.map(t => (
          <div key={t.name} className="lp-testimonial">
            <div className="lp-testimonial__top">
              <QuoteIcon />
              <ScoreRing score={t.score} size={44} />
            </div>
            <p className="lp-testimonial__quote">"{t.quote}"</p>
            <div className="lp-testimonial__author">
              <Avatar name={t.name} size="sm" />
              <div>
                <span className="lp-testimonial__name">{t.name}</span>
                <span className="lp-testimonial__title">{t.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── CTA ──────────────────────────────────────────────────────────────────────

const CTA: React.FC<{ onDemo: () => void }> = ({ onDemo }) => (
  <section className="lp-cta">
    <div className="lp-container lp-cta__inner">
      <h2 className="lp-cta__title">Ready to hire smarter?</h2>
      <p className="lp-cta__sub">
        Start your free trial today. No setup fees, no contracts.
        Cancel anytime.
      </p>
      <div className="lp-cta__actions">
        <Button variant="primary" size="lg" onClick={onDemo}>
          Start free trial
        </Button>
        <Button variant="ghost" size="lg">
          Talk to sales
        </Button>
      </div>
    </div>
  </section>
);

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer: React.FC = () => (
  <footer className="lp-footer">
    <div className="lp-container lp-footer__inner">
      <a href="#" className="lp-logo">
        <LogoMark />
        HireAgent
      </a>
      <nav className="lp-footer__links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Status</a>
        <a href="#">Contact</a>
      </nav>
      <span className="lp-footer__copy">© 2026 HireAgent, Inc.</span>
    </div>
  </footer>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export const LandingPage: React.FC<{ onDemo: () => void; onAuth: () => void }> = ({ onDemo, onAuth }) => (
  <div className="lp">
    <Nav onDemo={onDemo} onAuth={onAuth} />
    <Hero onDemo={onDemo} />
    <Stats />
    <Features />
    <HowItWorks />
    <Results />
    <CTA onDemo={onDemo} />
    <Footer />
  </div>
);

// ─── Icons ────────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path d="M9 22L16 10l7 12H9z" fill="#fff" opacity=".9" />
      <circle cx="16" cy="10" r="3" fill="#fff" />
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5a3 3 0 1 0-5.993.142 4 4 0 0 0-2.867 6.158 4 4 0 0 0 1.86 7.2A3 3 0 1 0 12 19" />
      <path d="M12 5a3 3 0 1 1 5.993.142 4 4 0 0 1 2.867 6.158 4 4 0 0 1-1.86 7.2A3 3 0 1 1 12 19" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.6 17a3 3 0 0 0-6.2 0" />
      <path d="M8 17a3 3 0 0 0 6.2 0" />
      <circle cx="12" cy="12" r="0" />
    </svg>
  );
}
function RankIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8"  y1="2" x2="8"  y2="6" />
      <line x1="3"  y1="10" x2="21" y2="10" />
    </svg>
  );
}
function PipelineIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
      <line x1="2"  y1="20" x2="22" y2="20" />
    </svg>
  );
}
function QuoteIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--accent)" opacity=".25">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}
