import { useNavigate } from 'react-router-dom';
import { ComponentShowcase } from './ComponentShowcase';

export function DemoPage() {
  const navigate = useNavigate();
  return (
    <>
      <button
        onClick={() => navigate('/')}
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
  );
}
