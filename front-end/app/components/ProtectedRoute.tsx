import { Navigate } from "react-router";
import { useAppContext } from "../context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Composant qui protège les routes en vérifiant l'authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
