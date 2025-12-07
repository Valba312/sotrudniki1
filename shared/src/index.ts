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
  id?: number;
  userId: number;
  averagePerPeak: number;
  totalVolume: number;
  lastUpdated: string;
  role: 'receiver' | 'issuer';
  accuracy?: number;
  revenueShare?: number;
}

export interface WalletSummary {
  userId: number;
  salaryToDate: number;
  hoursWorked: number;
  position: string;
  lastPayrollDate: string;
  analyticsNotes?: string;
  projectedBonus?: number;
}

export interface Payout {
  id: number;
  userId: number;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  method?: string;
  note?: string;
}

export interface DealDetail {
  id: number;
  userId: number;
  role: 'receiver' | 'issuer';
  periodLabel: string;
  volume: number;
  averagePerPeak: number;
  accuracy: number;
  revenue?: number;
}

export interface EmployeeSummary {
  userId: number;
  fullName: string;
  position: string;
  card: EmployeeCard;
  deals: DealMetrics[];
  wallet: WalletSummary;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}
