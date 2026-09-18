import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="mb-6">
          <p className="text-6xl font-bold text-blue-600">404</p>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
          Page not found
        </h1>
        
        <p className="mt-3 text-lg text-slate-600 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist. Please check the URL and try again.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>

          {isAuthenticated ? (
            <div className="flex gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 bg-slate-600 text-white rounded hover:bg-slate-700 transition"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/profile"
                className="inline-block px-6 py-3 border border-slate-300 text-slate-900 rounded hover:bg-slate-50 transition"
              >
                View Profile
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-slate-600 text-white rounded hover:bg-slate-700 transition"
            >
              Sign In
            </Link>
          )}
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm ring-1 ring-slate-200 max-w-md mx-auto">
          <h2 className="font-semibold text-slate-900 mb-2">Need help?</h2>
          <p className="text-sm text-slate-600">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </main>
  );
}
