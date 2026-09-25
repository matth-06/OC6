import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockGetUserInfo } from "../data/mockData";
import { getToken, removeToken, setToken } from "../utils/auth";

// Définition du type de valeur accessible depuis le contexte global.
// On n’expose que les données utiles à l’application : token, utilisateur connecté,
// l’état d’authentification et les actions pour se connecter / se déconnecter.
interface AppContextValue {
  token: string | null;
  user: Record<string, any> | null;
  isAuthenticated: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

// createContext crée un "réservoir" de données globales.
// Tous les composants descendants pourront y accéder via useAppContext().
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Provider : composant racine qui encapsule l’application.
// Il détient l’état partagé et le transmet à tous les enfants.
export function AppProvider({ children }: { children: ReactNode }) {
  // On initialise le token à partir du cookie existant au chargement de l’application.
  // Cela permet de garder l’utilisateur connecté après un refresh de page.
  const [token, setTokenState] = useState<string | null>(() => getToken());

  // L’utilisateur connecté est aussi stocké dans le contexte pour éviter
  // de recharger ces infos à chaque composant.
  const [user, setUser] = useState<Record<string, any> | null>(null);

  // login() met à jour le cookie et le state partagé.
  // Cela permet aux composants d’être informés immédiatement du changement.
  const login = useCallback((newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
  }, []);

  // logout() nettoie le cookie et remet les états globaux à zéro.
  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
  }, []);

  // Lorsque le token change, on recharge le profil utilisateur associé.
  // Cela permet de garder le contexte synchronisé avec l’état authentification.
  useEffect(() => {
    let isMounted = true;

    async function syncUser() {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        // On récupère le profil de l’utilisateur à partir du token.
        // Cette information devient alors immédiatement disponible à tous les composants.
        const connectedUser = await mockGetUserInfo(token);
        if (isMounted) {
          setUser(connectedUser);
        }
      } catch {
        // Si le token est invalide ou l’appel échoue, on nettoie l’état pour éviter
        // de laisser l’application dans un état incohérent.
        if (isMounted) {
          removeToken();
          setTokenState(null);
          setUser(null);
        }
      }
    }

    void syncUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // useMemo évite de recréer l’objet de contexte à chaque rendu.
  // Cela permet d’améliorer les performances et de stabiliser les références.
  const value = useMemo<AppContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [login, logout, token, user],
  );

  // Le Provider transmet le contexte à tous ses descendants.
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook personnalisé pour consommer facilement le contexte.
// Il garantit que le composant est bien placé sous le Provider.
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
}
