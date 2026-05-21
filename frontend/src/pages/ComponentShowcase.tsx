import React, { useState } from 'react';
import './ComponentShowcase.css';

import { Button } from '../../ui_library/src/components/common/Button/Button';
import { Input, Textarea } from '../../ui_library/src/components/common/Input/Input';
import { Badge, StatusBadge } from '../../ui_library/src/components/common/Badge/Badge';
import { Avatar, AvatarGroup } from '../../ui_library/src/components/common/Avatar/Avatar';
import { Modal } from '../../ui_library/src/components/common/Modal/Modal';
import { Spinner } from '../../ui_library/src/components/common/Spinner/Spinner';
import { SearchBar } from '../../ui_library/src/components/common/SearchBar/SearchBar';
import { Card, CardHeader, CardBody, CardFooter } from '../../ui_library/src/components/common/Card/Card';
import { EmptyState } from '../../ui_library/src/components/common/EmptyState/EmptyState';
import { Tabs } from '../../ui_library/src/components/common/Tabs/Tabs';

import { JobCard } from '../../ui_library/src/components/hiring/JobCard/JobCard';
import { CandidateCard } from '../../ui_library/src/components/hiring/CandidateCard/CandidateCard';
import { ApplicationTracker } from '../../ui_library/src/components/hiring/ApplicationTracker/ApplicationTracker';
import { AgentStatus } from '../../ui_library/src/components/hiring/AgentStatus/AgentStatus';
import { ScoreRing } from '../../ui_library/src/components/hiring/ScoreRing/ScoreRing';
import { InterviewCard } from '../../ui_library/src/components/hiring/InterviewCard/InterviewCard';

import type { ApplicationStatus } from '../../ui_library/src/components/common/Badge/Badge';
import type { Tab } from '../../ui_library/src/components/common/Tabs/Tabs';
import type { AgentState, AgentLog } from '../../ui_library/src/components/hiring/AgentStatus/AgentStatus';

// ─── Shared fixture data ──────────────────────────────────────────────────────

const JOBS = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'full-time' as const,
    status: 'active' as const,
    applicantCount: 42,
    postedAt: '3 days ago',
    salary: '$160k – $200k',
    companyName: 'Acme Corp',
  },
  {
    id: '2',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'remote' as const,
    status: 'paused' as const,
    applicantCount: 18,
    postedAt: '1 week ago',
    salary: '$120k – $150k',
    companyName: 'Nova Labs',
  },
  {
    id: '3',
    title: 'Backend Intern',
    department: 'Engineering',
    location: 'New York, NY',
    type: 'internship' as const,
    status: 'closed' as const,
    applicantCount: 97,
    postedAt: '2 weeks ago',
    companyName: 'Acme Corp',
  },
];

const CANDIDATES = [
  {
    id: 'c1',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    role: 'Frontend Engineer',
    experience: '5 yrs exp',
    skills: ['React', 'TypeScript', 'GraphQL', 'CSS', 'Webpack'],
    status: 'interview' as ApplicationStatus,
    matchScore: 87,
    appliedAt: '2 days ago',
  },
  {
    id: 'c2',
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    role: 'Full Stack Developer',
    experience: '3 yrs exp',
    skills: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
    status: 'screening' as ApplicationStatus,
    matchScore: 64,
    appliedAt: '4 days ago',
  },
  {
    id: 'c3',
    name: 'Aisha Patel',
    email: 'aisha.patel@email.com',
    role: 'UI Engineer',
    experience: '7 yrs exp',
    skills: ['Vue', 'React', 'Figma', 'Design Systems', 'A11y', 'Storybook'],
    status: 'offer' as ApplicationStatus,
    matchScore: 93,
    appliedAt: '1 week ago',
  },
];

const PIPELINE_STEPS = [
  { key: 'applied', label: 'Applied', description: 'Application received', completedAt: 'May 10' },
  { key: 'screening', label: 'AI Screening', description: 'Resume parsed & scored', completedAt: 'May 11' },
  { key: 'interview', label: 'Interview', description: '2 rounds scheduled' },
  { key: 'offer', label: 'Offer', description: 'Awaiting decision' },
  { key: 'hired', label: 'Hired', description: 'Onboarding begins' },
];

const AGENT_LOGS: AgentLog[] = [
  { id: '1', message: 'Fetched 42 new applications for Senior Frontend Engineer', timestamp: '09:41', type: 'info' },
  { id: '2', message: 'Parsed resumes using Claude claude-sonnet-4-6', timestamp: '09:42', type: 'info' },
  { id: '3', message: 'Scored 38 candidates — 4 skipped (incomplete data)', timestamp: '09:43', type: 'warning' },
  { id: '4', message: 'Shortlisted top 12 candidates (score ≥ 75)', timestamp: '09:43', type: 'success' },
  { id: '5', message: 'Interview slots auto-booked for 3 candidates', timestamp: '09:44', type: 'success' },
];

const SHOWCASE_TABS: Tab[] = [
  { key: 'common', label: 'Common UI' },
  { key: 'jobs', label: 'Jobs', count: 3 },
  { key: 'candidates', label: 'Candidates', count: 3 },
  { key: 'pipeline', label: 'Pipeline' },
  { key: 'agent', label: 'AI Agent' },
];

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="showcase-section">
    <h2 className="showcase-section__title">{title}</h2>
    {children}
  </section>
);

const Row: React.FC<{ children: React.ReactNode; wrap?: boolean }> = ({ children, wrap = true }) => (
  <div className={`showcase-row ${wrap ? 'showcase-row--wrap' : ''}`}>{children}</div>
);

// ─── Tab panels ───────────────────────────────────────────────────────────────

const CommonTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Buttons */}
      <Section title="Button">
        <Row>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Row>
        <Row>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row>
          <Button loading>Saving…</Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" icon={<PlusIcon />}>Add Candidate</Button>
          <Button variant="ghost" icon={<PlusIcon />} iconPosition="right">Next</Button>
        </Row>
      </Section>

      {/* Badges */}
      <Section title="Badge & StatusBadge">
        <Row>
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </Row>
        <Row>
          {(['new', 'screening', 'interview', 'offer', 'hired', 'rejected'] as ApplicationStatus[]).map(s => (
            <StatusBadge key={s} status={s} />
          ))}
        </Row>
      </Section>

      {/* Spinners */}
      <Section title="Spinner">
        <Row>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Row>
      </Section>

      {/* Avatars */}
      <Section title="Avatar & AvatarGroup">
        <Row>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => (
            <Avatar key={s} name="Priya Sharma" size={s} />
          ))}
          <Avatar src="https://i.pravatar.cc/80?img=47" name="Marcus Johnson" size="md" />
          <Avatar src="broken-url" name="Aisha Patel" size="md" />
        </Row>
        <Row>
          <AvatarGroup
            size="sm"
            avatars={[
              { name: 'Priya Sharma' },
              { name: 'Marcus Johnson' },
              { name: 'Aisha Patel' },
              { name: 'David Lee' },
              { name: 'Sara Kim' },
              { name: 'Tom Ray' },
            ]}
            max={4}
          />
        </Row>
      </Section>

      {/* Score Ring */}
      <Section title="ScoreRing">
        <Row>
          <ScoreRing score={93} size={72} />
          <ScoreRing score={64} size={72} />
          <ScoreRing score={38} size={72} />
          <ScoreRing score={93} size={52} />
          <ScoreRing score={64} size={40} />
        </Row>
      </Section>

      {/* Inputs */}
      <Section title="Input & Textarea">
        <div className="showcase-inputs">
          <Input
            label="Candidate name"
            placeholder="e.g. Priya Sharma"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            fullWidth
          />
          <Input
            label="Email"
            placeholder="candidate@email.com"
            leadingIcon={<MailIcon />}
            hint="We'll never share this address"
            fullWidth
          />
          <Input
            label="Phone"
            placeholder="+1 555 000 0000"
            error="Phone number is required"
            fullWidth
          />
          <Textarea
            label="Cover note"
            placeholder="Add a quick note about this candidate…"
            fullWidth
          />
        </div>
      </Section>

      {/* SearchBar */}
      <Section title="SearchBar">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search candidates, jobs…"
          fullWidth
        />
      </Section>

      {/* Card */}
      <Section title="Card">
        <Row>
          <Card padding="md" style={{ width: 240 } as React.CSSProperties}>
            <CardHeader><strong>Card with sections</strong></CardHeader>
            <CardBody>Body content goes here.</CardBody>
            <CardFooter>Footer area</CardFooter>
          </Card>
          <Card padding="md" hoverable style={{ width: 240 } as React.CSSProperties}>
            Hoverable card — try clicking.
          </Card>
          <Card padding="md" selected style={{ width: 240 } as React.CSSProperties}>
            Selected card state.
          </Card>
        </Row>
      </Section>

      {/* EmptyState */}
      <Section title="EmptyState">
        <EmptyState
          icon={<InboxIcon />}
          title="No candidates yet"
          description="Once you post a job and the AI agent runs, matched candidates will appear here."
          action={<Button variant="primary">Post a Job</Button>}
        />
      </Section>

      {/* Tabs */}
      <Section title="Tabs">
        <Tabs
          tabs={[
            { key: 'all', label: 'All', count: 42 },
            { key: 'shortlist', label: 'Shortlisted', count: 12 },
            { key: 'interview', label: 'Interview', count: 5 },
            { key: 'rejected', label: 'Rejected', count: 8, disabled: false },
          ]}
          activeKey="shortlist"
          onChange={() => { }}
        />
      </Section>

      {/* Modal */}
      <Section title="Modal">
        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          Open Modal
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm Shortlist"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.6 }}>
            You are about to shortlist <strong>Priya Sharma</strong> for the{' '}
            <strong>Senior Frontend Engineer</strong> role. The AI agent will schedule
            an interview slot automatically.
          </p>
        </Modal>
      </Section>
    </>
  );
};

const JobsTab: React.FC = () => {
  const [selected, setSelected] = useState<string | null>('1');
  return (
    <Section title="JobCard">
      <div className="showcase-grid">
        {JOBS.map(job => (
          <JobCard
            key={job.id}
            {...job}
            selected={selected === job.id}
            onClick={() => setSelected(job.id)}
          />
        ))}
      </div>
    </Section>
  );
};

const CandidatesTab: React.FC = () => {
  const [selected, setSelected] = useState<string | null>('c1');
  return (
    <Section title="CandidateCard">
      <div className="showcase-grid">
        {CANDIDATES.map(c => (
          <CandidateCard
            key={c.id}
            {...c}
            selected={selected === c.id}
            onClick={() => setSelected(c.id)}
            onShortlist={() => alert(`Shortlisted ${c.name}`)}
            onReject={() => alert(`Rejected ${c.name}`)}
          />
        ))}
      </div>
    </Section>
  );
};

const PipelineTab: React.FC = () => (
  <>
    <Section title="ApplicationTracker — Horizontal">
      <ApplicationTracker
        steps={PIPELINE_STEPS}
        currentStep="interview"
      />
    </Section>
    <Section title="ApplicationTracker — Vertical">
      <div style={{ maxWidth: 360 }}>
        <ApplicationTracker
          steps={PIPELINE_STEPS}
          currentStep="interview"
          orientation="vertical"
        />
      </div>
    </Section>
    <Section title="InterviewCard">
      <div className="showcase-grid">
        <InterviewCard
          id="iv1"
          candidateName="Priya Sharma"
          role="Senior Frontend Engineer"
          type="video"
          status="scheduled"
          date="Wed, May 21 2026"
          time="2:00 PM IST"
          duration="45 min"
          interviewers={[
            { name: 'Rahul Mehta', role: 'Hiring Manager' },
            { name: 'Sara Kim', role: 'Tech Lead' },
          ]}
          meetLink="https://meet.example.com/abc"
          notes="Focus on system design and component architecture."
          onJoin={() => alert('Joining meeting…')}
          onReschedule={() => alert('Reschedule flow')}
          onCancel={() => alert('Cancel flow')}
        />
        <InterviewCard
          id="iv2"
          candidateName="Marcus Johnson"
          role="Full Stack Developer"
          type="technical"
          status="completed"
          date="Mon, May 19 2026"
          time="11:00 AM IST"
          duration="60 min"
          interviewers={[{ name: 'David Lee', role: 'Senior Engineer' }]}
        />
      </div>
    </Section>
  </>
);

const AgentTab: React.FC = () => {
  const states: AgentState[] = ['idle', 'thinking', 'screening', 'scoring', 'done', 'error'];
  const [agentState, setAgentState] = useState<AgentState>('screening');
  const [progress, setProgress] = useState(58);

  return (
    <>
      <Section title="AgentStatus — States">
        <Row wrap={false} >
          {states.map(s => (
            <button
              key={s}
              className={`showcase-state-btn ${agentState === s ? 'showcase-state-btn--active' : ''}`}
              onClick={() => setAgentState(s)}
            >
              {s}
            </button>
          ))}
        </Row>
        <AgentStatus
          state={agentState}
          currentTask={
            agentState === 'screening'
              ? 'Parsing and scoring resume for Priya Sharma…'
              : agentState === 'scoring'
                ? 'Ranking candidates against job requirements…'
                : agentState === 'thinking'
                  ? 'Determining best interview time slots…'
                  : undefined
          }
          progress={['screening', 'scoring'].includes(agentState) ? progress : undefined}
          candidatesProcessed={24}
          totalCandidates={42}
          logs={AGENT_LOGS}
        />
        {['screening', 'scoring'].includes(agentState) && (
          <div style={{ marginTop: 12 }}>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </Section>
    </>
  );
};

// ─── Main showcase ────────────────────────────────────────────────────────────

export const ComponentShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('common');

  return (
    <div className="showcase">
      <header className="showcase-header">
        <div className="showcase-header__badge">Component Library</div>
        <h1 className="showcase-header__title">Hiring Agent UI</h1>
        <p className="showcase-header__sub">
          16 reusable components · vanilla CSS · React 19
        </p>
      </header>

      <div className="showcase-tabs-bar">
        <Tabs tabs={SHOWCASE_TABS} activeKey={activeTab} onChange={setActiveTab} />
      </div>

      <main className="showcase-main">
        {activeTab === 'common' && <CommonTab />}
        {activeTab === 'jobs' && <JobsTab />}
        {activeTab === 'candidates' && <CandidatesTab />}
        {activeTab === 'pipeline' && <PipelineTab />}
        {activeTab === 'agent' && <AgentTab />}
      </main>
    </div>
  );
};

// ─── Inline icons used only in this file ─────────────────────────────────────

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const InboxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);
