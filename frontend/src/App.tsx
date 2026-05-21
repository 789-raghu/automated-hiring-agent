import { useState } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage';
import { ComponentShowcase } from './pages/ComponentShowcase';
import { AuthPage } from './pages/AuthPage';
import { ToastProvider } from './components/common/Toast/Toast';

type Page = 'landing' | 'auth' | 'demo';

function App() {
  const [page, setPage] = useState<Page>('landing');

  return (
    <ToastProvider>
      {page === 'demo' && (
        <>
          <button
            onClick={() => setPage('landing')}
            style={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 200,
              padding: '6px 14px',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontFamily: 'var(--sans)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Back to landing
          </button>
          <ComponentShowcase />
        </>
      )}
      {page === 'auth' && <AuthPage onBack={() => setPage('landing')} />}
      {page === 'landing' && (
        <LandingPage
          onDemo={() => setPage('demo')}
          onAuth={() => setPage('auth')}
        />
      )}
    </ToastProvider>
  );
}

export default App;
