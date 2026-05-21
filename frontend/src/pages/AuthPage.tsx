import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import { Tabs } from '../../ui_library/src/components/common/Tabs/Tabs';
import { Input } from '../../ui_library/src/components/common/Input/Input';
import { Button } from '../../ui_library/src/components/common/Button/Button';
import { useToast } from '../../ui_library/src/components/common/Toast/Toast';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserType = 'company' | 'employee';
type AuthMode = 'login' | 'signup';

interface CompanyLoginFields { email: string; password: string }
interface CompanySignupFields { companyName: string; industry: string; email: string; password: string; confirmPassword: string }
interface EmployeeLoginFields { email: string; password: string }
interface EmployeeSignupFields { fullName: string; email: string; jobTitle: string; password: string; confirmPassword: string }

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function validateLogin(email: string, password: string) {
  const errors: Record<string, string> = {};
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
}

// ─── Company Login ────────────────────────────────────────────────────────────

const CompanyLogin: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { toast } = useToast();
  const [form, setForm] = useState<CompanyLoginFields>({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof CompanyLoginFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const errs = validateLogin(form.email, form.password);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    toast({ type: 'success', title: 'Welcome back!', message: 'Signed in to your company account.' });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Work Email"
        type="email"
        placeholder="company@example.com"
        value={form.email}
        onChange={set('email')}
        error={errors.email}
        fullWidth
        leadingIcon={<EmailIcon />}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={form.password}
        onChange={set('password')}
        error={errors.password}
        fullWidth
        leadingIcon={<LockIcon />}
      />
      <div className="auth-form__forgot">
        <button type="button" className="auth-link">Forgot password?</button>
      </div>
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Sign In
      </Button>
      <p className="auth-form__switch">
        Don't have an account?{' '}
        <button type="button" className="auth-link" onClick={onSwitch}>Sign up</button>
      </p>
    </form>
  );
};

// ─── Company Signup ───────────────────────────────────────────────────────────

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
  'Manufacturing', 'Media', 'Consulting', 'Real Estate', 'Other',
];

const CompanySignup: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { toast } = useToast();
  const [form, setForm] = useState<CompanySignupFields>({
    companyName: '', industry: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof CompanySignupFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.companyName.trim()) errs.companyName = 'Company name is required';
    if (!form.industry) errs.industry = 'Please select an industry';
    if (!form.email) errs.email = 'Email is required';
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    toast({ type: 'success', title: 'Account created!', message: 'Welcome to HireAgent. Start posting jobs right away.' });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Company Name"
        type="text"
        placeholder="Acme Corp"
        value={form.companyName}
        onChange={set('companyName') as React.ChangeEventHandler<HTMLInputElement>}
        error={errors.companyName}
        fullWidth
        leadingIcon={<BuildingIcon />}
      />
      <div className={`input-wrapper input-wrapper--full`}>
        <label className="input-label" htmlFor="industry-select">Industry</label>
        <div className={`input-field${errors.industry ? ' input-field--error' : ''}`}>
          <span className="input-icon input-icon--leading"><GridIcon /></span>
          <select
            id="industry-select"
            className="input-el input-el--leading auth-select"
            value={form.industry}
            onChange={set('industry') as React.ChangeEventHandler<HTMLSelectElement>}
          >
            <option value="" disabled>Select industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        {errors.industry && <p className="input-message input-message--error" role="alert">{errors.industry}</p>}
      </div>
      <Input
        label="Work Email"
        type="email"
        placeholder="you@company.com"
        value={form.email}
        onChange={set('email') as React.ChangeEventHandler<HTMLInputElement>}
        error={errors.email}
        fullWidth
        leadingIcon={<EmailIcon />}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        value={form.password}
        onChange={set('password') as React.ChangeEventHandler<HTMLInputElement>}
        error={errors.password}
        fullWidth
        leadingIcon={<LockIcon />}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Repeat password"
        value={form.confirmPassword}
        onChange={set('confirmPassword') as React.ChangeEventHandler<HTMLInputElement>}
        error={errors.confirmPassword}
        fullWidth
        leadingIcon={<LockIcon />}
      />
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Create Company Account
      </Button>
      <p className="auth-form__switch">
        Already have an account?{' '}
        <button type="button" className="auth-link" onClick={onSwitch}>Sign in</button>
      </p>
    </form>
  );
};

// ─── Employee Login ───────────────────────────────────────────────────────────

const EmployeeLogin: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { toast } = useToast();
  const [form, setForm] = useState<EmployeeLoginFields>({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof EmployeeLoginFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const errs = validateLogin(form.email, form.password);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    toast({ type: 'success', title: 'Welcome back!', message: 'Signed in to your employee account.' });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={set('email')}
        error={errors.email}
        fullWidth
        leadingIcon={<EmailIcon />}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={form.password}
        onChange={set('password')}
        error={errors.password}
        fullWidth
        leadingIcon={<LockIcon />}
      />
      <div className="auth-form__forgot">
        <button type="button" className="auth-link">Forgot password?</button>
      </div>
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Sign In
      </Button>
      <p className="auth-form__switch">
        New here?{' '}
        <button type="button" className="auth-link" onClick={onSwitch}>Create an account</button>
      </p>
    </form>
  );
};

// ─── Employee Signup ──────────────────────────────────────────────────────────

const EmployeeSignup: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { toast } = useToast();
  const [form, setForm] = useState<EmployeeSignupFields>({
    fullName: '', email: '', jobTitle: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof EmployeeSignupFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address';
    if (!form.jobTitle.trim()) errs.jobTitle = 'Job title is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    toast({ type: 'success', title: 'Account created!', message: 'Your profile is ready. Start applying to jobs!' });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Full Name"
        type="text"
        placeholder="Jane Smith"
        value={form.fullName}
        onChange={set('fullName')}
        error={errors.fullName}
        fullWidth
        leadingIcon={<PersonIcon />}
      />
      <Input
        label="Email"
        type="email"
        placeholder="jane@example.com"
        value={form.email}
        onChange={set('email')}
        error={errors.email}
        fullWidth
        leadingIcon={<EmailIcon />}
      />
      <Input
        label="Job Title"
        type="text"
        placeholder="e.g. Frontend Engineer"
        value={form.jobTitle}
        onChange={set('jobTitle')}
        error={errors.jobTitle}
        fullWidth
        leadingIcon={<BriefcaseIcon />}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        value={form.password}
        onChange={set('password')}
        error={errors.password}
        fullWidth
        leadingIcon={<LockIcon />}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Repeat password"
        value={form.confirmPassword}
        onChange={set('confirmPassword')}
        error={errors.confirmPassword}
        fullWidth
        leadingIcon={<LockIcon />}
      />
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Create Account
      </Button>
      <p className="auth-form__switch">
        Already have an account?{' '}
        <button type="button" className="auth-link" onClick={onSwitch}>Sign in</button>
      </p>
    </form>
  );
};

// ─── Auth Page ────────────────────────────────────────────────────────────────

const USER_TABS = [
  { key: 'company', label: 'For Companies', icon: <BuildingIcon /> },
  { key: 'employee', label: 'For Employees', icon: <PersonIcon /> },
];

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('company');
  const [mode, setMode] = useState<AuthMode>('login');

  const handleTabChange = (key: string) => {
    setUserType(key as UserType);
    setMode('login');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <LogoMark />
            HireAgent
          </div>
          <p className="auth-tagline">Intelligent hiring, powered by AI</p>
        </div>

        {/* User type tabs */}
        <Tabs tabs={USER_TABS} activeKey={userType} onChange={handleTabChange} />

        {/* Login / Sign Up toggle */}
        <div className="auth-mode-toggle">
          <button
            type="button"
            className={`auth-mode-btn${mode === 'login' ? ' auth-mode-btn--active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-mode-btn${mode === 'signup' ? ' auth-mode-btn--active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        <div className="auth-form-area">
          {userType === 'company' && mode === 'login' && <CompanyLogin onSwitch={() => setMode('signup')} />}
          {userType === 'company' && mode === 'signup' && <CompanySignup onSwitch={() => setMode('login')} />}
          {userType === 'employee' && mode === 'login' && <EmployeeLogin onSwitch={() => setMode('signup')} />}
          {userType === 'employee' && mode === 'signup' && <EmployeeSignup onSwitch={() => setMode('login')} />}
        </div>

        {/* Back link */}
        <button type="button" className="auth-back" onClick={() => navigate('/')}>
          <ArrowLeftIcon /> Back to home
        </button>
      </div>
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path d="M9 22L16 10l7 12H9z" fill="#fff" opacity=".9" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 9v12M15 9v12" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}


export default AuthPage;