import { useEffect, useMemo, useState } from "react";
import { mockGetUserActivity } from "../data/mockData";
import { useRequireAuth, useAuth } from "../hooks/useAuth";
import DashboardFooter from "../components/DashboardFooter";
import DashboardHeader from "../components/DashboardHeader";
import ProfileBlock from "../components/ProfileBlock";
import "../styles/profile.css";

export default function Profile() {
  const { isAuthenticated } = useRequireAuth();
  const { token, user } = useAuth();
  const [sessions, setSessions] = useState<Array<Record<string, any>>>([]);
  const profile = user ?? {};

  useEffect(() => {
    let isMounted = true;

    async function loadActivity() {
      if (!token) return;

      try {
        const activity = await mockGetUserActivity(token);
        if (isMounted) setSessions(activity);
      } catch {
        if (isMounted) setSessions([]);
      }
    }

    void loadActivity();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const stats = useMemo(() => {
    const totals = sessions.reduce<{
      minutes: number;
      calories: number;
      distance: number;
    }>(
      (result, session) => ({
        minutes: result.minutes + Number(session.duration ?? 0),
        calories: result.calories + Number(session.caloriesBurned ?? 0),
        distance: result.distance + Number(session.distance ?? 0),
      }),
      { minutes: 0, calories: 0, distance: 0 },
    );
    const sessionDates = [...new Set(sessions.map((session) => session.date))]
      .map((date) => new Date(date).getTime())
      .sort((first, second) => first - second);
    const elapsedDays = sessionDates.length > 1
      ? Math.floor((sessionDates[sessionDates.length - 1] - sessionDates[0]) / 86_400_000) + 1
      : sessionDates.length;

    return {
      ...totals,
      restDays: Math.max(0, elapsedDays - sessionDates.length),
    };
  }, [sessions]);

  const joinedDate = user?.userInfos?.createdAt
    ? new Date(user.userInfos.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "date inconnue";

    if (!isAuthenticated) {
      return null;
    }

  return (
    <main className="profile-page">
      <DashboardHeader />
      <section className="profile-layout">
        <aside className="profile-side">
          <div className="profile-header-card">
            <ProfileBlock />
          </div>

          <div className="profile-details">
            <h2>Votre profil</h2>
            <p>Âge : {profile.userInfos?.age ?? "Non renseigné"}</p>
            <p>Genre : {profile.userInfos?.gender ?? "Non renseigné"}</p>
            <p>Taille : {profile.userInfos?.height ?? "Non renseignée"}</p>
            <p>Poids : {profile.userInfos?.weight ?? "Non renseigné"} kg</p>
          </div>
        </aside>

        <div className="stats-panel">
          <div className="stats-header">
            <h1>Vos statistiques</h1>
            <p>depuis le {joinedDate}</p>
          </div>

          <div className="stats-section">
            <div className="stat-card">
              <h3>Temps total couru</h3>
              <p>{Math.floor(stats.minutes / 60)}h {stats.minutes % 60}min</p>
            </div>
            <div className="stat-card">
              <h3>Calories brûlées</h3>
              <p>{stats.calories} cal</p>
            </div>
            <div className="stat-card">
              <h3>Distance totale parcourue</h3>
              <p>{Number(stats.distance.toFixed(1))} km</p>
            </div>
            <div className="stat-card">
              <h3>Nombre de jours de repos</h3>
              <p>{stats.restDays} jours</p>
            </div>
            <div className="stat-card stat-card--wide">
              <h3>Nombre de sessions</h3>
              <p>{sessions.length} sessions</p>
            </div>
          </div>
        </div>
      </section>
      <DashboardFooter />
    </main>
  );
}
