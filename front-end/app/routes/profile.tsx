import { useRequireAuth, useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import DashboardFooter from "../components/DashboardFooter";
import DashboardHeader from "../components/DashboardHeader";

export default function Profile() {
  const { isAuthenticated } = useRequireAuth();
  const { token, user, logout: logoutUser } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  const profile = user ?? {};
  const fullName =
    profile.userInfos?.firstName && profile.userInfos?.lastName
      ? `${profile.userInfos.firstName} ${profile.userInfos.lastName}`
      : profile.username ?? "Utilisateur";

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Profil</h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">
                Informations utilisateur
              </h2>
              <p className="text-slate-600">Compte connecté : {fullName}</p>
            </div>

            <div className="grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-2">
              <p className="text-sm"><span className="font-medium text-slate-900">Prénom :</span> {profile.userInfos?.firstName ?? "-"}</p>
              <p className="text-sm"><span className="font-medium text-slate-900">Nom :</span> {profile.userInfos?.lastName ?? "-"}</p>
              <p className="text-sm"><span className="font-medium text-slate-900">Âge :</span> {profile.userInfos?.age ?? "-"}</p>
              <p className="text-sm"><span className="font-medium text-slate-900">Genre :</span> {profile.userInfos?.gender ?? "-"}</p>
              <p className="text-sm"><span className="font-medium text-slate-900">Poids :</span> {profile.userInfos?.weight ?? "-"} kg</p>
              <p className="text-sm"><span className="font-medium text-slate-900">Taille :</span> {profile.userInfos?.height ?? "-"} cm</p>
              <p className="text-sm"><span className="font-medium text-slate-900">Objectif :</span> {profile.weeklyGoal ?? profile.goal ?? "-"} km</p>
              <p className="text-sm"><span className="font-medium text-slate-900">Identifiant :</span> {profile.username ?? "-"}</p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <p className="text-sm">
                <span className="text-slate-600">Statut :</span>
                <span className="ml-2 inline-block rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  Connecté
                </span>
              </p>
              <p className="mt-2 text-sm">
                <span className="text-slate-600">Token présent :</span>
                <span className="ml-2 inline-block rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {token ? "Oui" : "Non"}
                </span>
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <Link
                to="/dashboard"
                className="inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Retour au dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
