import { useEffect, useMemo, useState } from "react";
import { mockGetUserActivity, mockGetUserInfo } from "../data/mockData";
import { useAuth, useRequireAuth } from "../hooks/useAuth";
import DashboardFooter from "../components/DashboardFooter";
import DashboardHeader from "../components/DashboardHeader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ComposedChart, Line,} from "recharts";
import "../styles/dashboard.css";


const COLOR_DEFAULT = "#aab4fb"; // barre au repos (mauve clair)
const COLOR_ACTIVE = "#2400ff"; // barre survolée (bleu vif)
 
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
            <div className="distance-icon">↗</div>
            <div className="distance-value">{Math.round(stats.totalDistance || 312)} km</div>
          </div>
        </section>

        <section className="section-title">
          <h3>Vos dernières performances</h3>
        </section>

        <section className="performance-grid">
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
        </section>

        <section className="week-header">
          <h3>Cette semaine</h3>
          <p>Du 23/06/2025 au 30/06/2025</p>
        </section>

        <section className="bottom-grid">
          <article className="panel donut-panel">
            <div className="donut-title">
              <span className="count">x4</span>
              <span className="text">sur objectif de 6</span>
            </div>
            <p className="donut-subtitle">Courses hebdomadaire réalisées</p>

            <div className="donut-wrapper">
              <div className="donut-chart" aria-label="Cible hebdomadaire">
                <div className="donut-inner">
                  <span className="donut-label">4</span>
                </div>
              </div>
              <div className="donut-legend">
                <span className="legend-dot primary" />
                <span>2 restants</span>
              </div>
              <div className="donut-legend lower">
                <span className="legend-dot secondary" />
                <span>4 réalisées</span>
              </div>
            </div>
          </article>

          <article className="panel metric-panel">
            <div className="metric-card">
              <span className="metric-label">Durée d’activité</span>
              <strong>140 <span className="metric-unit">minutes</span></strong>
            </div>

            <div className="metric-card">
              <span className="metric-label">Distance</span>
              <strong>21.7 <span className="metric-unit">kilomètres</span></strong>
            </div>
          </article>
        </section>
        
      </div>

      <DashboardFooter />
    </main>
  );
}
