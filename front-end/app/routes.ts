import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

/**
 * Configuration des routes de l'application
 * 
 * Structure:
 * - Routes publiques (accueil, connexion, inscription)
 * - Routes protégées (tableau de bord, profil)
 * - Gestion des erreurs pour les routes inexistantes
 */
export default [
  // Routes publiques
  index("routes/home.tsx"),
  
  // Authentification (non protégées)
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  // Routes protégées
  route("dashboard", "routes/dashboard.tsx"),
  route("profile", "routes/profile.tsx"),

  // Gestion des erreurs - Route catch-all pour les URLs inexistantes
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
