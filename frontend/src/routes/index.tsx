import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { executiveRoutes } from './ExecutiveRoutes';
import { pharmacyRoutes } from './PharmacyRoutes';
import { publicRoutes } from './PublicRoutes';
import App from '../App';
import { Login } from '../pages/Login';
import { LoginNew } from '../pages/LoginNew';

const routes: RouteObject[] = [
  {
    path: '/home',
    element: <App />,
  },
  {
    path: '/login-old',
    element: <Login />,
  },
  {
    path: '/login',
    element: <LoginNew />,
  },
  ...publicRoutes,
  ...executiveRoutes,
  ...pharmacyRoutes,
];

export const router = createBrowserRouter(routes);
