import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { executiveRoutes } from './ExecutiveRoutes';
import App from '../App';
import { Login } from '../pages/Login';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  ...executiveRoutes,
];

export const router = createBrowserRouter(routes);
