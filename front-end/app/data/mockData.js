/**
 * mockData.js
 * -----------
 * Mock aligné sur la VRAIE structure retournée par le backend (Sophie) et
 * les VRAIES routes exposées :
 *
 *   POST /api/login
 *     body: { username, password }
 *     -> { token, userId }
 *
 *   GET /api/user-info
 *     (authentifié via le token) -> infos de l'utilisateur connecté
 *
 *   GET /api/user-activity?startWeek=<date>&endWeek=<date>
 *     (authentifié) -> les sessions de course sur la période demandée
 *
 *   GET /images/<filename>
 *     -> photo de profil
 */

const MOCK_USERS = [
  {
    id: "user123",
    weeklyGoal: 2,
    userInfos: {
      firstName: "Sophie",
      lastName: "Martin",
      age: 32,
      gender: "female",
      profilePicture: "http://localhost:8000/images/sophie.jpg",
      height: 165,
      weight: 60,
      createdAt: "2025-01-01",
    },
    username: "sophiemartin",
    password: "password123",
    runningData: [
      { date: "2025-01-04", distance: 5.8, duration: 38, heartRate: { min: 140, max: 178, average: 163 }, caloriesBurned: 422 },
      { date: "2025-01-05", distance: 3.2, duration: 20, heartRate: { min: 148, max: 184, average: 171 }, caloriesBurned: 248 },
      { date: "2025-01-09", distance: 6.4, duration: 42, heartRate: { min: 140, max: 176, average: 163 }, caloriesBurned: 468 },
      { date: "2025-01-12", distance: 7.5, duration: 50, heartRate: { min: 138, max: 178, average: 162 }, caloriesBurned: 532 },
      { date: "2025-01-19", distance: 5.1, duration: 34, heartRate: { min: 141, max: 177, average: 165 }, caloriesBurned: 378 },
      { date: "2025-02-05", distance: 8.0, duration: 52, heartRate: { min: 140, max: 178, average: 162 }, caloriesBurned: 565 },
      { date: "2025-02-15", distance: 9.2, duration: 62, heartRate: { min: 138, max: 179, average: 161 }, caloriesBurned: 645 },
      { date: "2025-03-09", distance: 10.5, duration: 68, heartRate: { min: 136, max: 179, average: 159 }, caloriesBurned: 720 },
      { date: "2025-03-27", distance: 11.0, duration: 72, heartRate: { min: 135, max: 179, average: 158 }, caloriesBurned: 755 },
      { date: "2025-06-22", distance: 11.2, duration: 72, heartRate: { min: 135, max: 180, average: 159 }, caloriesBurned: 765 },
      { date: "2025-08-17", distance: 11.5, duration: 75, heartRate: { min: 132, max: 180, average: 157 }, caloriesBurned: 785 },
      { date: "2026-02-22", distance: 7.4, duration: 48, heartRate: { min: 140, max: 177, average: 162 }, caloriesBurned: 520 },
      { date: "2026-06-14", distance: 10.5, duration: 68, heartRate: { min: 137, max: 179, average: 160 }, caloriesBurned: 720 },
    ],
  },
  {
    id: "user789",
    goal: 3,
    userInfos: {
      firstName: "Emma",
      lastName: "Leroy",
      age: 28,
      gender: "female",
      height: 170,
      weight: 62,
      profilePicture: "http://localhost:8000/images/emma.jpg",
      createdAt: "2025-01-01",
    },
    username: "emmaleroy",
    password: "password789",
    runningData: [
      { date: "2025-01-02", distance: 5.5, duration: 33, heartRate: { min: 140, max: 175, average: 158 }, caloriesBurned: 370 },
      { date: "2025-01-04", distance: 6.2, duration: 37, heartRate: { min: 142, max: 178, average: 160 }, caloriesBurned: 410 },
      { date: "2025-01-09", distance: 7.0, duration: 42, heartRate: { min: 141, max: 177, average: 162 }, caloriesBurned: 470 },
      { date: "2025-02-05", distance: 7.1, duration: 43, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 465 },
      { date: "2025-03-22", distance: 7.3, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 485 },
      { date: "2025-05-21", distance: 7.3, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 485 },
      { date: "2025-07-20", distance: 7.3, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 485 },
      { date: "2025-09-18", distance: 7.3, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 485 },
      { date: "2025-12-17", distance: 7.2, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 480 },
      { date: "2026-03-17", distance: 7.3, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 485 },
      { date: "2026-07-15", distance: 7.3, duration: 44, heartRate: { min: 142, max: 178, average: 163 }, caloriesBurned: 485 },
    ],
  },
  {
    id: "user456",
    userInfos: {
      firstName: "Marc",
      lastName: "Dubois",
      goal: 2,
      age: 45,
      gender: "male",
      height: 180,
      weight: 85,
      profilePicture: "http://localhost:8000/images/marc.jpg",
      createdAt: "2025-01-01",
    },
    username: "marcdubois",
    password: "password456",
    runningData: [
      { date: "2025-01-05", distance: 3.0, duration: 22, heartRate: { min: 120, max: 145, average: 132 }, caloriesBurned: 180 },
      { date: "2025-01-19", distance: 4.2, duration: 30, heartRate: { min: 122, max: 148, average: 135 }, caloriesBurned: 220 },
      { date: "2025-02-16", distance: 4.0, duration: 28, heartRate: { min: 123, max: 147, average: 134 }, caloriesBurned: 210 },
      { date: "2025-03-16", distance: 4.5, duration: 32, heartRate: { min: 124, max: 149, average: 136 }, caloriesBurned: 230 },
      { date: "2025-05-11", distance: 4.3, duration: 31, heartRate: { min: 124, max: 148, average: 135 }, caloriesBurned: 220 },
      { date: "2025-07-06", distance: 4.2, duration: 30, heartRate: { min: 124, max: 148, average: 135 }, caloriesBurned: 220 },
      { date: "2025-09-14", distance: 3.6, duration: 25, heartRate: { min: 121, max: 145, average: 132 }, caloriesBurned: 185 },
      { date: "2025-11-23", distance: 4.0, duration: 28, heartRate: { min: 123, max: 147, average: 134 }, caloriesBurned: 210 },
      { date: "2026-01-19", distance: 4.2, duration: 30, heartRate: { min: 122, max: 148, average: 135 }, caloriesBurned: 220 },
      { date: "2026-04-13", distance: 4.1, duration: 29, heartRate: { min: 123, max: 147, average: 134 }, caloriesBurned: 210 },
    ],
  },
];
export default MOCK_USERS;

// ---------------------------------------------------------------------------
// Helper : lit l'objectif hebdomadaire quel que soit son emplacement réel
// (voir le point de vigilance en tête de fichier).
// ---------------------------------------------------------------------------
export function getWeeklyGoal(user) {
  return user?.weeklyGoal ?? user?.goal ?? user?.userInfos?.goal ?? null;
}

// ---------------------------------------------------------------------------
// Simule POST /api/login
// ---------------------------------------------------------------------------
export function mockLogin(username, password) {
  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return Promise.reject({ status: 401, message: "Identifiants invalides" });
  }

  // Le token n'est pas un vrai JWT signé : c'est uniquement un id
  // encodé pour que le mock retrouve l'utilisateur derrière l'appel.
  const token = `mock-token.${user.id}`;
  return Promise.resolve({ token, userId: user.id });
}

// ---------------------------------------------------------------------------
// Simule GET /api/user-info
// En vrai, l'API identifie l'utilisateur via le token envoyé dans le
// header Authorization. Ici on retrouve l'utilisateur à partir du token
// mocké généré par mockLogin.
// ---------------------------------------------------------------------------
export function mockGetUserInfo(token) {
  const userId = token?.replace("mock-token.", "");
  const user = MOCK_USERS.find((u) => u.id === userId);

  if (!user) {
    return Promise.reject({ status: 401, message: "Non authentifié" });
  }

  // On ne renvoie jamais le mot de passe au frontend, même en mock,
  // pour prendre le même réflexe qu'un vrai backend bien fait.
  const { password, runningData, ...safeUser } = user;
  return Promise.resolve({
    ...safeUser,
    weeklyGoal: getWeeklyGoal(user),
  });
}

// ---------------------------------------------------------------------------
// Simule GET /api/user-activity?startWeek=<date>&endWeek=<date>
// ---------------------------------------------------------------------------
export function mockGetUserActivity(token, startWeek, endWeek) {
  const userId = token?.replace("mock-token.", "");
  const user = MOCK_USERS.find((u) => u.id === userId);

  if (!user) {
    return Promise.reject({ status: 401, message: "Non authentifié" });
  }

  const start = startWeek ? new Date(startWeek) : null;
  const end = endWeek ? new Date(endWeek) : null;

  const sessions = user.runningData.filter((session) => {
    const d = new Date(session.date);
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  });

  return Promise.resolve(sessions);
}