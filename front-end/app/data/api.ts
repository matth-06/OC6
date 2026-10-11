import {
  mockGetUserActivity,
  mockGetUserInfo,
  mockLogin,
} from "./mockData";

export const isMock = false; // Changez cette valeur pour true si vous voulez utiliser les données simulées.

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

interface LoginResponse {
  token: string;
  userId: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  const body = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(body?.message ?? "Une erreur est survenue");
  }

  return body as T;
}

export function loginUser(username: string, password: string) {
  if (isMock) {
    return mockLogin(username, password);
  }

  return request<LoginResponse>("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export async function getUserInfo(token: string) {
  if (isMock) {
    return mockGetUserInfo(token);
  }

  const response = await request<{
    profile: Record<string, any>;
    statistics: Record<string, any>;
  }>("/api/user-info", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    ...response,
    userInfos: response.profile,
    weeklyGoal: response.profile.weeklyGoal,
  };
}

export function getUserActivity(
  token: string,
  startWeek = "1970-01-01",
  endWeek = new Date().toISOString().slice(0, 10),
) {
  if (isMock) {
    return mockGetUserActivity(token, startWeek, endWeek);
  }

  const query = new URLSearchParams({ startWeek, endWeek });
  return request<Array<Record<string, any>>>(
    `/api/user-activity?${query.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}