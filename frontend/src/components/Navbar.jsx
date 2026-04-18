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
      <Link to="/" className="nav-brand">Active8</Link>
      <div className="nav-links">
        {!user && <Link to="/login" className="nav-link">Login</Link>}
        {!user && <Link to="/register" className="btn btn-primary btn-sm">Register</Link>}
        {user && <span className="badge badge-primary">Role: {user.role}</span>}
        {user && <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
