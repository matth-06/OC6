const TOKEN_KEY = "auth_token";
const TOKEN_EXPIRY_HOURS = 24; // Token validity in hours

/**
 * Récupère le token d'authentification depuis les cookies
 */
export function getToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith(`${TOKEN_KEY}=`)
  );

  return tokenCookie
    ? decodeURIComponent(tokenCookie.split("=")[1])
    : null;
}

/**
 * Stocke le token d'authentification dans les cookies avec expiration
 */
export function setToken(token: string): void {
  if (typeof document === "undefined") {
    return;
  }

  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + TOKEN_EXPIRY_HOURS);

  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
}

/**
 * Supprime le token d'authentification
 */
export function removeToken(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Efface complètement les données d'authentification
 */
export function logout(): void {
  removeToken();
}