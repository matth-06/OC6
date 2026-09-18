import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { mockGetUserActivity, mockGetUserInfo } from "../data/mockData";
import { useAuth, useRequireAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { isAuthenticated } = useRequireAuth();
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [sessions, setSessions] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!token || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const [connectedUser, activity] = await Promise.all([
          mockGetUserInfo(token),
          mockGetUserActivity(token),
        ]);

        if (isMounted) {
          setProfile(connectedUser);
          setSessions(activity);
        }
      } catch {
        if (isMounted) {
          setProfile(user ?? null);
          setSessions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token, user]);

  const activeUser = profile ?? user;

  const stats = useMemo(() => {
    if (!sessions.length) {
      return { totalDistance: 0, totalCalories: 0, totalSessions: 0 };
    }

    return sessions.reduce(
      (acc, session) => {
        acc.totalDistance += Number(session.distance ?? 0);
        acc.totalCalories += Number(session.caloriesBurned ?? 0);
        acc.totalSessions += 1;
        return acc;
      },
      { totalDistance: 0, totalCalories: 0, totalSessions: 0 }
    );
  }, [sessions]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-4xl">
          <p className="text-lg text-slate-600">Chargement du tableau de bord...</p>
        </div>
      </main>
    );
  }

  const fullName =
    activeUser?.userInfos?.firstName && activeUser?.userInfos?.lastName
      ? `${activeUser.userInfos.firstName} ${activeUser.userInfos.lastName}`
      : activeUser?.username ?? "Utilisateur";

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">Bienvenue, {fullName}</h1>
            <p className="mt-2 text-slate-600">
              Voici les informations associées à votre compte connecté.
            </p>
          </div>
          <Link
            to="/profile"
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Voir le profil
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Objectif hebdo</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {activeUser?.weeklyGoal ?? activeUser?.goal ?? 0} km
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Distance totale</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{stats.totalDistance.toFixed(1)} km</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Calories</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{stats.totalCalories} kcal</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-xl font-semibold">Dernières séances</h2>
            {sessions.length === 0 ? (
              <p className="text-slate-600">Aucune séance enregistrée pour ce compte.</p>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 5).map((session, index) => (
                  <div key={`${session.date}-${index}`} className="flex items-center justify-between rounded border border-slate-200 p-3">
                    <div>
                      <p className="font-medium text-slate-800">{session.date}</p>
                      <p className="text-sm text-slate-500">{session.duration} min</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{Number(session.distance ?? 0).toFixed(1)} km</p>
                      <p className="text-sm text-slate-500">{session.caloriesBurned ?? 0} kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-xl font-semibold">Profil</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-medium text-slate-900">Nom :</span> {activeUser?.userInfos?.lastName ?? "-"}</p>
              <p><span className="font-medium text-slate-900">Prénom :</span> {activeUser?.userInfos?.firstName ?? "-"}</p>
              <p><span className="font-medium text-slate-900">Âge :</span> {activeUser?.userInfos?.age ?? "-"}</p>
              <p><span className="font-medium text-slate-900">Poids :</span> {activeUser?.userInfos?.weight ?? "-"} kg</p>
              <p><span className="font-medium text-slate-900">Taille :</span> {activeUser?.userInfos?.height ?? "-"} cm</p>
              <p><span className="font-medium text-slate-900">Identifiant :</span> {activeUser?.username ?? "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
