import { Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastProvider } from '../ui_library/src/components/common/Toast/Toast';
import { routes } from './router/routes.tsx';

function App() {
  return (
    <ToastProvider>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </ToastProvider>
  );
}

export default App;
