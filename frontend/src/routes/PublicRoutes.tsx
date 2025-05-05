import { RouteObject } from 'react-router-dom';
import { LandingPage } from '../pages/public/LandingPage';
import { Register } from '../pages/public/Register';
import { About } from '../pages/public/About';
import { Features } from '../pages/public/Features';
import { Contact } from '../pages/public/Contact';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/features',
    element: <Features />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
];
