declare const MOCK_USERS: Array<Record<string, any>>;

export default MOCK_USERS;

export function getWeeklyGoal(user: Record<string, any>): number | null;
export function mockLogin(
  username: string,
  password: string,
): Promise<{ token: string; userId: string }>;
export function mockGetUserInfo(token: string): Promise<Record<string, any>>;
export function mockGetUserActivity(
  token: string,
  startWeek?: string,
  endWeek?: string,
): Promise<Array<Record<string, any>>>;