export interface User {
  id: number;
  email: string;
  passwordHash: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  body: string;
  createdAt: string;
}

export interface EmployeeCard {
  userId: number;
  position: string;
  responsibilities: string[];
  skills: string[];
  activeStatus: 'hired' | 'on_leave' | 'terminated';
  statusHistory: { timestamp: string; status: string; note?: string }[];
}

export interface DealMetrics {
  userId: number;
  averagePerPeak: number;
  totalVolume: number;
  lastUpdated: string;
  role: 'receiver' | 'issuer';
}

export interface WalletSummary {
  userId: number;
  salaryToDate: number;
  hoursWorked: number;
  position: string;
  lastPayrollDate: string;
  analyticsNotes?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}
