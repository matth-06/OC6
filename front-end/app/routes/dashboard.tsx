import { useEffect, useMemo, useState } from "react";
import { mockGetUserActivity, mockGetUserInfo } from "../data/mockData";
import { useAuth, useRequireAuth } from "../hooks/useAuth";
import DashboardFooter from "../components/DashboardFooter";
import DashboardHeader from "../components/DashboardHeader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ComposedChart, Line, PieChart, Pie,} from "recharts";
import "../styles/dashboard.css";

const COLOR_DEFAULT = "#aab4fb"; // barre au repos (mauve clair)
const COLOR_ACTIVE = "#2400ff"; // barre survolée (bleu vif)
const COLOR_MIN = "#f7c9c2"; // barre Min (rose pâle)
const COLOR_MAX = "#f6390d"; // barre Max BPM (rouge/orange)
const LINE_IDLE = "#c9cdfa"; // ligne au repos (lavande pâle)
const LINE_ACTIVE = "#1e1bfa"; // ligne survolée (bleu vif)

 
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { periode: string; km: number } }>;
}) {
  if (!active || !payload || !payload.length) return null;
  const { periode, km } = payload[0].payload;
  return (
    <div className="dashboard-tooltip">
      <div className="dashboard-tooltip-date">{periode}</div>
      <div className="dashboard-tooltip-value">
        {km.toString().replace(".", ",")} km
      </div>
    </div>
  );
}
 
export default function Dashboard() {
  const { isAuthenticated } = useRequireAuth();
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [sessions, setSessions] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const lineColor = hovered ? LINE_ACTIVE : LINE_IDLE;
  const dotColor = "#1e1bfa"; // les points restent bleus dans les deux états

  const bpmData = useMemo(() => {
    if (!sessions.length) {
      return [];
    }

    const lastSessions = [...sessions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);

    const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    return lastSessions.map((session, index) => ({
      name: dayNames[index] ?? `J${index + 1}`,
      min: Number(session.heartRate?.min ?? 0),
      max: Number(session.heartRate?.max ?? 0),
      trend: Number(session.heartRate?.average ?? 0),
    }));
  }, [sessions]);

  const chartData = useMemo(() => {
    if (!sessions.length) {
      return [];
    }

    const lastSessions = [...sessions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-4);

    return lastSessions.map((session, index) => {
      const date = new Date(session.date);
      const start = new Date(date);
      start.setDate(date.getDate() - 6);

      const formatDate = (value: Date) =>
        `${String(value.getDate()).padStart(2, "0")}/${String(
          value.getMonth() + 1
        ).padStart(2, "0")}`;

      return {
        name: `S${index + 1}`,
        km: Number(session.distance ?? 0),
        periode: `${formatDate(start)} au ${formatDate(date)}`,
      };
    });
  }, [sessions]);

  const moyenne = chartData.length
    ? Math.round(chartData.reduce((sum, d) => sum + d.km, 0) / chartData.length)
    : 0;

  const heartRateAverage = useMemo(() => {
    if (!sessions.length) {
      return 0;
    }

    const total = sessions.reduce(
      (sum, session) => sum + Number(session.heartRate?.average ?? 0),
      0
    );

    return Math.round(total / sessions.length);
  }, [sessions]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!token || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const [connectedUser, activity] = await Promise.all([
          mockGetUserInfo(token),
          mockGetUserActivity(token),
        ]);

        if (isMounted) {
          setProfile(connectedUser);
          setSessions(activity);
        }
      } catch {
        if (isMounted) {
          setProfile(user ?? null);
          setSessions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token, user]);

  const activeUser = profile ?? user;

  const stats = useMemo(() => {
    if (!sessions.length) {
      return { totalDistance: 0, totalCalories: 0, totalSessions: 0 };
    }

    return sessions.reduce(
      (acc, session) => {
        acc.totalDistance += Number(session.distance ?? 0);
        acc.totalCalories += Number(session.caloriesBurned ?? 0);
        acc.totalSessions += 1;
        return acc;
      },
      { totalDistance: 0, totalCalories: 0, totalSessions: 0 }
    );
  }, [sessions]);

  const weeklyGoal = useMemo(() => {
    return activeUser?.weeklyGoal ?? activeUser?.goal ?? 6;
  }, [activeUser]);

  const completedSessions = useMemo(() => {
    if (!sessions.length) {
      return 0;
    }

    return Math.min(sessions.length, weeklyGoal);
  }, [sessions, weeklyGoal]);

  const totalMinutes = useMemo(() => {
    if (!sessions.length) {
      return 0;
    }

    return sessions.reduce((sum, session) => sum + Number(session.duration ?? 0), 0);
  }, [sessions]);

  const averageDistance = useMemo(() => {
    if (!sessions.length) {
      return 0;
    }

    return Number((stats.totalDistance / sessions.length).toFixed(1));
  }, [sessions, stats.totalDistance]);

  const donutData = useMemo(() => {
    const completed = Math.max(completedSessions, 0);
    const remaining = Math.max(weeklyGoal - completed, 0);

    return [
      { name: "réalisées", value: completed, color: "#2e57ff" },
      { name: "restants", value: remaining, color: "rgba(46, 87, 255, 0.15)" },
    ];
  }, [completedSessions, weeklyGoal]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <main className="dashboard-page dashboard-loading">
        <div className="dashboard-shell">
          <p>Chargement du tableau de bord...</p>
        </div>
      </main>
    );
  }

  const fullName =
    activeUser?.userInfos?.firstName && activeUser?.userInfos?.lastName
      ? `${activeUser.userInfos.firstName} ${activeUser.userInfos.lastName}`
      : activeUser?.username ?? "Utilisateur";

  const joinedDate = activeUser?.userInfos?.createdAt ?? "2023-06-14";

  return (
    <main className="dashboard-page">
      <DashboardHeader />
      <div className="dashboard-shell">
        {/* -------------------TOP------------------------- */}
        <section className="top-summary">
          <div className="profile-block">
            <div className="profile-avatar">
              {activeUser?.userInfos?.profilePicture ? (
                <img src={activeUser.userInfos.profilePicture} alt={fullName} />
              ) : (
                <span>{fullName.charAt(0)}</span>
              )}
            </div>

            <div className="profile-text">
              <h2>{fullName}</h2>
              <p>Membre depuis le 14 juin 2023</p>
            </div>
          </div>
              
          <div className="distance-stats">
              <p>Distance totale parcourue</p>
            </div>
          <div className="distance-card">
            <div className="distance-icon"></div>
            <div className="distance-value">{Math.round(stats.totalDistance || 312)} km</div>
          </div>
        </section>
              {/* -------------------CHART------------------------- */}
        <section className="section-title">
          <h3>Vos dernières performances</h3>
        </section>

        <section className="performance-grid">
          {/* -------------------CHART 1------------------------- */}
          <div className="performance-card">
            <div className="performance-header">
              <h2 className="performance-title">{moyenne}km en moyenne</h2>
              <div className="performance-range">
                <span className="performance-range-btn" aria-hidden="true">‹</span>
                <span>28 mai - 25 juin</span>
                <span className="performance-range-btn" aria-hidden="true">›</span>
              </div>
            </div>

            <p className="performance-subtitle">Total des kilomètres 4 dernières semaines</p>

            <div className="chart-wrapper">
              <ResponsiveContainer>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: "#d1d5db" }}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 13 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    domain={[0, 30]}
                    ticks={[0, 10, 20, 30]}
                  />
                  <Tooltip
                    cursor={false}
                    content={<CustomTooltip />}
                  />
                  <Bar
                    dataKey="km"
                    barSize={14}
                    radius={[7, 7, 7, 7]}
                    onMouseEnter={(_, index: number) => setActiveIndex(index)}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={index === activeIndex ? COLOR_ACTIVE : COLOR_DEFAULT}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="legend-row">
              <span className="legend-mark" />
              Km
            </div>
          </div>
          {/* -------------------CHART 2------------------------- */}
          <div className="heart-rate-card">
            <div className="heart-rate-header">
              <h2 className="heart-rate-title">{heartRateAverage} BPM</h2>
              <div className="heart-rate-range">
                <span className="heart-rate-range-btn" aria-hidden="true">‹</span>
                <span>28 mai - 04 juin</span>
                <span className="heart-rate-range-btn" aria-hidden="true">›</span>
              </div>
            </div>
            <p className="heart-rate-subtitle">Fréquence cardiaque moyenne</p>

            <div
              className="heart-rate-chart"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <ResponsiveContainer>
                <ComposedChart
                  data={bpmData}
                  margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                  barGap={-6}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: "#d1d5db" }}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 13 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    domain={[130, 187]}
                    ticks={[130, 145, 160, 187]}
                  />

                  <Bar
                    dataKey="min"
                    name="Min"
                    barSize={10}
                    radius={[5, 5, 5, 5]}
                    fill={COLOR_MIN}
                  />
                  <Bar
                    dataKey="max"
                    name="Max BPM"
                    barSize={14}
                    radius={[7, 7, 7, 7]}
                    fill={COLOR_MAX}
                  />

                  <Line
                    dataKey="trend"
                    name="Max BPM"
                    type="monotone"
                    stroke={lineColor}
                    strokeWidth={hovered ? 2.5 : 2}
                    dot={{ r: 4, fill: dotColor, strokeWidth: 0 }}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="heart-rate-legend">
              <span className="legend-item">
                <span className="legend-swatch legend-swatch-min" />
                Min
              </span>
              <span className="legend-item">
                <span className="legend-swatch legend-swatch-max" />
                Max BPM
              </span>
              <span className="legend-item">
                <span className="legend-swatch legend-swatch-trend" />
                Max BPM
              </span>
            </div>
          </div>
        </section>
          {/* -------------------DONUT CHART------------------------- */}
        <section className="week-header">
          <h3>Cette semaine</h3>
          <p>Du 23/06/2025 au 30/06/2025</p>
        </section>

        <section className="bottom-grid">
          <article className="panel donut-panel">
            <div className="donut-title">
              <span className="count">x{completedSessions}</span>
              <span className="text">sur objectif de {weeklyGoal}</span>
            </div>
            <p className="donut-subtitle">Courses hebdomadaire réalisées</p>

            <div className="donut-wrapper">
              <div className="donut-chart-wrap" aria-label="Cible hebdomadaire">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      innerRadius={58}
                      outerRadius={86}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={0}
                      stroke="none"
                    >
                      {donutData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center">
                  <span className="donut-label">{completedSessions}</span>
                </div>
              </div>
              <div className="donut-legend">
                <span className="legend-dot primary" />
                <span>{Math.max(weeklyGoal - completedSessions, 0)} restants</span>
              </div>
              <div className="donut-legend lower">
                <span className="legend-dot secondary" />
                <span>{completedSessions} réalisées</span>
              </div>
            </div>
          </article>

          <article className="panel metric-panel">
            <div className="metric-card-1">
              <span className="metric-label">Durée d’activité</span>
              <strong>{totalMinutes} <span className="metric-unit-1">minutes</span></strong>
            </div>

            <div className="metric-card-2">
              <span className="metric-label">Distance</span>
              <strong>{averageDistance} <span className="metric-unit-2">kilomètres</span></strong>
            </div>
          </article>
        </section>
        
      </div>

      <DashboardFooter />
    </main>
  );
}
