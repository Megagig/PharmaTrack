import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { executiveRoutes } from './ExecutiveRoutes';
import { pharmacyRoutes } from './PharmacyRoutes';
import { publicRoutes } from './PublicRoutes';
import App from '../App';
import { Login } from '../pages/Login';

const routes: RouteObject[] = [
  {
    path: '/home',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  ...publicRoutes,
  ...executiveRoutes,
  ...pharmacyRoutes,
];

export const router = createBrowserRouter(routes);
