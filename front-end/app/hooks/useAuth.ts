import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";

/**
 * Hook personnalisé pour gérer l'authentification depuis le contexte global
 */
export function useAuth() {
  const { token, user, isAuthenticated, login, logout } = useAppContext();

  return {
    isAuthenticated,
    token,
    user,
    login,
    logout,
  };
}

/**
 * Hook pour protéger les routes côté composant
 * Redirige automatiquement vers la page de connexion si l'utilisateur n'est pas authentifié
 */
export function useRequireAuth() {
  const navigate = useNavigate();
  const { isAuthenticated: isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) {
      navigate("/", { replace: true });
    }
  }, [isAuth, navigate]);

  return { isAuthenticated: isAuth };
}
