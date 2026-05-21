import { useNavigate } from 'react-router-dom';
import { LandingPage } from './LandingPage';

export function HomePage() {
  const navigate = useNavigate();
  return (
    <LandingPage
      onDemo={() => navigate('/demo')}
      onAuth={() => navigate('/auth')}
    />
  );
}
