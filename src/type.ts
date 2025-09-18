// src/types.ts

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
  verificationToken?: string;
  lastLogin?: string;
  mfaEnabled?: boolean;
  mfaSecret?: string;
  mfaBackupCodes?: string[];
  createdAt: string;
  updatedAt?: string;
};


export type Deposit = {
  _id: string;
  user: string; // or User if populated
  amount: number;
  method: string;
  status: "pending" | "approved" | "rejected";
  transactionId?: string;
  createdAt: string;
  updatedAt?: string;
};

export type Withdrawal = {
  _id: string;
  user: string;
  amount: number;
  method?: string;
  status: "pending" | "approved" | "rejected";
  transactionId: string;
  createdAt: string;
  updatedAt?: string;
};

export type Transaction = {
  _id: string;
  user: string;
  type: "deposit" | "withdrawal" | "investment";
  amount: number;
  method: string;
  reference?: string;
  investmentId?: string; // ✅ only set when type = "investment"
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
};


export type Investment = {
  _id: string;
  user: string;
  plan: string;
  amount: number;
  profit: number;
  status: "active" | "completed" | "pending";
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;
};

export type InvestmentPlan = {
  _id: string;
  planName: string;
  profitPercent: number;
  minAmount: number;
  maxAmount: number;
  durationHours: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt?: string;
};

export type WithdrawalMethod = {
  _id: string;
  user: string;
  methodName: "bank" | "paypal" | "crypto";
  accountDetails: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type SecurityEvent = {
  _id: string;
  user?: string;
  type: "login" | "failed-login" | "password-change";
  ip?: string;
  userAgent?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
};

export type FAQ = {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt?: string;
};