export type UserRole = "Admin" | "Officer" | "Analyst" | "Viewer";

export interface AuthUser {
  id?: number;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

export interface DemoAccount {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  permissions: string;
  description: string;
  badgeColor: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "Admin",
    name: "System Administrator",
    email: "admin@geomine.ai",
    password: "DemoPass#2026",
    permissions: "Full platform control, user governance, audit trail, report generation & data approval",
    description: "Unrestricted operational & administrative access across all modules",
    badgeColor: "bg-red-100 text-red-800 border-red-200"
  },
  {
    role: "Officer",
    name: "Executive Officer",
    email: "officer@geomine.ai",
    password: "DemoPass#2026",
    permissions: "AI natural language query, official report generation, anomaly verification & export",
    description: "Full analytical synthesis and document compiling access",
    badgeColor: "bg-blue-100 text-[#123B6D] border-blue-200"
  },
  {
    role: "Analyst",
    name: "Data Analyst",
    email: "analyst@geomine.ai",
    password: "DemoPass#2026",
    permissions: "Statistical discrepancy review, raw document ingestion, CSV/Excel uploads",
    description: "Focused on mathematical validation and data ingestion pipeline",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
  },
  {
    role: "Viewer",
    name: "Public Viewer",
    email: "viewer@geomine.ai",
    password: "DemoPass#2026",
    permissions: "Read-only access to published catalogs, production trajectories, and data lineage",
    description: "Read-only tier; restricted from generating reports or approving data",
    badgeColor: "bg-gray-100 text-gray-700 border-gray-200"
  }
];

const AUTH_STORAGE_KEY = "geomine_auth_user";

export function getCurrentUser(): AuthUser {
  if (typeof window === "undefined") {
    return {
      name: "Executive Officer",
      email: "officer@geomine.ai",
      role: "Officer"
    };
  }

  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading auth state:", e);
  }

  // Default to Officer for instant interactive demonstration
  const defaultUser: AuthUser = {
    name: "Executive Officer",
    email: "officer@geomine.ai",
    role: "Officer"
  };
  return defaultUser;
}

export function setCurrentUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("auth-changed"));
  } catch (e) {
    console.error("Error saving auth state:", e);
  }
}

export async function loginWithCredentials(email: string, password: string): Promise<AuthUser> {
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
  );

  let token = "demo-token";
  let name = account ? account.name : "Operational User";
  let role: UserRole = account ? account.role : "Officer";

  try {
    const res = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password })
    });
    if (res.ok) {
      const data = await res.json();
      token = data.access_token;
      if (data.user) {
        name = data.user.name;
        role = data.user.role;
      }
    }
  } catch (err) {
    console.warn("Backend auth unavailable, using offline role match:", err);
  }

  if (!account && token === "demo-token") {
    throw new Error("Invalid email or password. Please use one of the demo accounts listed below.");
  }

  const authenticatedUser: AuthUser = {
    name,
    email: email.trim(),
    role,
    token
  };

  setCurrentUser(authenticatedUser);
  return authenticatedUser;
}

export async function switchDemoRole(role: UserRole): Promise<AuthUser> {
  const account = DEMO_ACCOUNTS.find((a) => a.role === role) || DEMO_ACCOUNTS[1];
  return await loginWithCredentials(account.email, account.password);
}

export function logout(): void {
  const viewerAccount = DEMO_ACCOUNTS.find((a) => a.role === "Viewer")!;
  setCurrentUser({
    name: viewerAccount.name,
    email: viewerAccount.email,
    role: "Viewer"
  });
}

// RBAC Permission Helpers
export function canGenerateReports(role: UserRole): boolean {
  return role === "Admin" || role === "Officer";
}

export function canApproveValidation(role: UserRole): boolean {
  return role === "Admin" || role === "Officer" || role === "Analyst";
}

export function canUploadDocuments(role: UserRole): boolean {
  return role === "Admin" || role === "Officer" || role === "Analyst";
}

export function isAdmin(role: UserRole): boolean {
  return role === "Admin";
}

export function isViewer(role: UserRole): boolean {
  return role === "Viewer";
}
