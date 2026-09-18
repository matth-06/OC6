import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home - React Router App" },
    { name: "description", content: "Welcome to our React Router application with authentication" },
  ];
}

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <main className="min-h-screen bg-slate-50 p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Welcome Back!</h1>
                <p className="mt-2 text-lg text-slate-600">You are authenticated</p>
              </div>
              <div className="space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="inline-block px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main>
          <Welcome />
          <div className="bg-slate-50 py-12 px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-slate-600 mb-6">
                Sign in to access your dashboard and profile
              </p>
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-block px-6 py-2 bg-slate-200 text-slate-900 rounded hover:bg-slate-300 transition"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
