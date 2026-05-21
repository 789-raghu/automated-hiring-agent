import type { ReactNode } from 'react';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';
import { DemoPage } from '../pages/DemoPage';

export interface RouteDefinition {
  path: string;
  element: ReactNode;
}

export const routes: RouteDefinition[] = [
  { path: '/',      element: <HomePage /> },
  { path: '/auth',  element: <AuthPage /> },
  { path: '/demo',  element: <DemoPage /> },
];
