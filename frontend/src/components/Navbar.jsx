import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="nav-brand-mark">A</span>
        <span>
          <span className="nav-brand-name">Active8</span>
          <span className="nav-brand-subtitle">Events and sponsorships</span>
        </span>
      </Link>

      <div className="nav-links">
        {!user && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
        {user && (
          <>
            <span className="nav-user-chip">{user.name}</span>
            <span className="badge badge-primary">{user.role.replace('_', ' ')}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
