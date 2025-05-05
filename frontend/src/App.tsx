import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import './App.css';

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Redirect based on user role
    if (user?.role === 'EXECUTIVE' || user?.role === 'ADMIN') {
      navigate('/executive/dashboard');
    } else if (user?.role === 'PHARMACY') {
      navigate('/pharmacy/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="app-container">
      <h1>PharmaTrack</h1>
      <p>Redirecting to the appropriate dashboard...</p>
    </div>
  );
}

export default App;
