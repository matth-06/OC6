import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { mockLogin } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import "../styles/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!username || !password) {
        throw new Error("Veuillez remplir tous les champs");
      }

      const response = await mockLogin(username.trim(), password);
      login(response.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err && "message" in err
            ? String((err as { message?: string }).message)
            : "Identifiants invalides";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">SPORTSEE</div>

        <div className="login-card">
          <h1>
            Transformez
            <br />
            vos stats en résultats
          </h1>

          <form onSubmit={handleSubmit} className="login-form">
            <h2>Se connecter</h2>

            {error && <div className="login-error">{error}</div>}

            <label htmlFor="username" className="login-field">
              <span>Adresse email</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Adresse email"
                disabled={isLoading}
                required
              />
            </label>

            <label htmlFor="password" className="login-field">
              <span>Mot de passe</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                disabled={isLoading}
                required
              />
            </label>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>

            <Link to="/register" className="login-link">
              Mot de passe oublié ?
            </Link>
          </form>
        </div>
      </section>

      <aside className="login-visual" aria-label="Course à pied">
        <div className="login-badge">
          Analysez vos performances en un clin d’œil,
          <br />
          suivez vos progrès et atteignez vos objectifs.
        </div>
      </aside>
    </main>
  );
}
