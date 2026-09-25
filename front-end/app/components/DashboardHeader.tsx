import { useRequireAuth, useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import "../styles/header.css";


export default function DashboardHeader() {
  const { token, user, logout: logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };
  return (
    <header className="dashboard-header">
      <div className="dashboard-brand">SPORTSEE</div>

      <nav className="dashboard-nav" aria-label="Navigation principale">
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link to="/profile" className="nav-link">
          Mon profil
        </Link>
        |
        <button type="button" onClick={handleLogout} className="nav-link nav-button">
          Se déconnecter
        </button>
      </nav>
    </header>
  );
}
