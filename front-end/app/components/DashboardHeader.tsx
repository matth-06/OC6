import { Link } from "react-router";
import "../styles/header.css";


export default function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="dashboard-brand">SPORTSEE</div>

      <nav className="dashboard-nav" aria-label="Navigation principale">
        <Link to="/dashboard" className="nav-link nav-link-active">
          Dashboard
        </Link>
        <Link to="/profile" className="nav-link">
          Mon profil
        </Link>
        <button type="button" className="nav-link nav-button">
          Se déconnecter
        </button>
      </nav>
    </header>
  );
}
