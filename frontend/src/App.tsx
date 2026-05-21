import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { ToastProvider } from '../ui_library/src/components/common/Toast/Toast';
import { routes } from './router/routes';
import { UserContext } from './contexts/user_context';
import type { User } from './models/types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ToastProvider>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </ToastProvider>
    </UserContext.Provider>
  );
}

export default App;