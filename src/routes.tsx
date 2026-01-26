import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';

// Lazy load all pages for code splitting
const isDevelopment = (import.meta.env as any).DEV;
const NotFoundPage = isDevelopment ? lazy(() => import('../dev-tools/src/PageNotFound')) : lazy(() => import('./pages/_404'));

const RoleplayPage = lazy(() => import('./pages/roleplay'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const KnowledgePage = lazy(() => import('./pages/knowledge'));
const EIMetricsPage = lazy(() => import('./pages/ei-metrics'));
const ModulesPage = lazy(() => import('./pages/modules'));
const FrameworksPage = lazy(() => import('./pages/frameworks'));
const ExercisesPage = lazy(() => import('./pages/exercises'));
const CapabilityReviewPage = lazy(() => import('./pages/capability-review'));
const DataReportsPage = lazy(() => import('./pages/data-reports'));
const HelpPage = lazy(() => import('./pages/help'));
const HeuristicsPage = lazy(() => import('./pages/heuristics'));
const ProfilePage = lazy(() => import('./pages/profile'));
const SQLPage = lazy(() => import('./pages/sql'));
const ChatPage = lazy(() => import('./pages/chat'));
const WorkerProbePage = lazy(() => import('./pages/worker-probe'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/roleplay',
    element: <RoleplayPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/knowledge',
    element: <KnowledgePage />,
  },
  {
    path: '/ei-metrics',
    element: <EIMetricsPage />,
  },
  {
    path: '/modules',
    element: <ModulesPage />,
  },
  {
    path: '/frameworks',
    element: <FrameworksPage />,
  },
  {
    path: '/exercises',
    element: <ExercisesPage />,
  },
  {
    path: '/capability-review',
    element: <CapabilityReviewPage />,
  },
  {
    path: '/data-reports',
    element: <DataReportsPage />,
  },
  {
    path: '/help',
    element: <HelpPage />,
  },
  {
    path: '/heuristics',
    element: <HeuristicsPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/sql',
    element: <SQLPage />,
  },
  {
    path: '/chat',
    element: <ChatPage />,
  },
  {
    path: '/worker-probe',
    element: <WorkerProbePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Types for type-safe navigation
export type Path = 
  | '/' 
  | '/roleplay' 
  | '/dashboard' 
  | '/knowledge' 
  | '/ei-metrics' 
  | '/modules' 
  | '/frameworks' 
  | '/exercises' 
  | '/capability-review' 
  | '/data-reports' 
  | '/help' 
  | '/heuristics' 
  | '/profile' 
  | '/sql' 
  | '/chat' 
  | '/worker-probe';

export type Params = Record<string, string | undefined>;
