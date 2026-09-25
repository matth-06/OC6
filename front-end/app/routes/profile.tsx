import { useRequireAuth, useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import DashboardFooter from "../components/DashboardFooter";
import DashboardHeader from "../components/DashboardHeader";
import ProfileBlock from "../components/ProfileBlock";

export default function Profile() {
  const { isAuthenticated } = useRequireAuth();
  const { token, user, logout: logoutUser } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return null;
  }


  const profile = user ?? {};
  const fullName =
    profile.userInfos?.firstName && profile.userInfos?.lastName
      ? `${profile.userInfos.firstName} ${profile.userInfos.lastName}`
      : profile.username ?? "Utilisateur";

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <DashboardHeader />
        <section className="profile-section">
          <div className="profile-card">
          <ProfileBlock />
          </div>
          <div className="profile-details">
            <h1>Votre profil</h1>
            <p>Âge: {profile.userInfos?.age ?? "Non renseigné"}</p>
            <p>Genre: {profile.userInfos?.gender ?? "Non renseigné"}</p>
            <p>Taille: {profile.userInfos?.height ?? "Non renseignée"}</p>
            <p>Poids: {profile.userInfos?.weight ?? "Non renseigné"}kg</p>
          </div>
          <div className="stats-header">
            <h1>Vos Statistiques</h1>
            <h2>depuis le 14 juin 2023</h2>
          </div>
          <div className="stats-section">
            <div className="stat-card">
              <h3>Temps total couru</h3>
              <p>{profile.stats?.totalDistance ?? 0} km</p>
            </div>
            <div className="stat-card">
              <h3>Calories brûlées</h3>
              <p>{profile.stats?.caloriesBurned ?? 0} kcal</p>
            </div>
            <div className="stat-card">
              <h3>Distance totale parcourue</h3>
              <p>{profile.stats?.totalDistance ?? 0} km</p>
            </div>
            <div className="stat-card">
              <h3>Nombre de jours de repos</h3>
              <p>{profile.stats?.restDays ?? 0}</p>
            </div>
            <div className="stat-card">
              <h3>Nombre de sessions</h3>
              <p>{profile.stats?.sessionCount ?? 0}</p>
            </div>
          </div>
        </section>
      <DashboardFooter />
    </main>
  );
}
