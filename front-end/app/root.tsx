import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { AppProvider } from "./context/AppContext";
import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  let statusCode = 500;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    message = error.status === 404 ? "404 - Page not found" : `Error ${error.status}`;
    details =
      error.status === 404
        ? "The page you are looking for does not exist. Please check the URL and try again."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">{message}</h1>
        <p className="text-lg text-gray-600 mb-8">{details}</p>
        <a href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Back to Home
        </a>
      </div>
      {stack && import.meta.env.DEV && (
        <details className="mt-8 p-4 bg-red-50 rounded border border-red-200">
          <summary className="cursor-pointer font-semibold text-red-800">
            Error Details (Development)
          </summary>
          <pre className="w-full p-4 overflow-x-auto mt-4 text-sm">
            <code>{stack}</code>
          </pre>
        </details>
      )}
    </main>
  );
}
