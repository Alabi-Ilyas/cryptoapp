import { database } from "./firebase";
import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { User as FirebaseUser } from "firebase/auth";

// Types based on your schema
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  createdAt: number;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  lastLogin?: number;
  role?: "user" | "admin";
  mfaEnabled?: boolean;
  mfaSecret?: string;
  mfaBackupCodes?: string[];
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  returnRate: number;
  duration: string;
  createdAt: number;
  maxAmount?: number;
  features: string[];
  isActive: boolean;
}

export interface UserInvestment {
  id: string;
  userId: string;
  investmentPlanId: string;
  amount: number;
  startDate: number;
  endDate: number;
  profit: number;
  createdAt: number;
  status: "active" | "completed" | "pending";
}

export interface PlatformTransaction {
  id: string;
  userId: string;
  amount: number;
  createdAt: number;
  userInvestmentId?: string;
  paymentMethod?: string;
  referenceId?: string;
  adminNotes?: string;
  processedAt?: number;
  paymentAccountDetails?: string;
  type: "deposit" | "withdrawal" | "profit";
  status: "pending" | "completed" | "failed";
}

export interface MarketData {
  id: string;
  symbol: string;
  price: number;
  timestamp: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt: number;
  isActive: boolean;
  order: number;
}

export interface WithdrawalMethod {
  id: string;
  userId: string;
  type: "bank" | "paypal" | "crypto";
  details: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    email?: string;
    address?: string;
  };
  isPrimary: boolean;
  createdAt: number;
}

// Database operations
export class DatabaseService {
  // User operations
  static async createUser(
    firebaseUser: FirebaseUser,
    additionalData: Partial<User> = {}
  ): Promise<void> {
    const userData: User = {
      id: firebaseUser.uid,
      username:
        additionalData.username || firebaseUser.email?.split("@")[0] || "",
      email: firebaseUser.email || "",
      createdAt: Date.now(),
      lastLogin: Date.now(),
      role: "user",
      ...additionalData,
    };

    await set(ref(database, `users/${firebaseUser.uid}`), userData);
  }

  static async getUser(userId: string): Promise<User | null> {
    const snapshot = await get(ref(database, `users/${userId}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

  static async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<void> {
    await update(ref(database, `users/${userId}`), updates);
  }

  static async getAllUsers(): Promise<User[]> {
    const snapshot = await get(ref(database, "users"));
    if (!snapshot.exists()) return [];

    const users = snapshot.val();
    return Object.keys(users).map((key) => ({ ...users[key], id: key }));
  }

  // Investment Plan operations
  static async getInvestmentPlans(): Promise<InvestmentPlan[]> {
    const snapshot = await get(ref(database, "investmentPlans"));
    if (!snapshot.exists()) return [];

    const plans = snapshot.val();
    return Object.keys(plans).map((key) => ({ ...plans[key], id: key }));
  }

  static async createInvestmentPlan(
    plan: Omit<InvestmentPlan, "id">
  ): Promise<string> {
    const newPlanRef = push(ref(database, "investmentPlans"));
    await set(newPlanRef, plan);
    return newPlanRef.key!;
  }

  // User Investment operations
  static async createUserInvestment(
    investment: Omit<UserInvestment, "id">
  ): Promise<string> {
    const newInvestmentRef = push(ref(database, "userInvestments"));
    await set(newInvestmentRef, { ...investment, id: newInvestmentRef.key });
    return newInvestmentRef.key!;
  }

  static async getUserInvestments(userId: string): Promise<UserInvestment[]> {
    const snapshot = await get(
      query(
        ref(database, "userInvestments"),
        orderByChild("userId"),
        equalTo(userId)
      )
    );
    if (!snapshot.exists()) return [];

    const investments = snapshot.val();
    return Object.keys(investments).map((key) => ({
      ...investments[key],
      id: key,
    }));
  }

  static async getAllInvestments(): Promise<UserInvestment[]> {
    const snapshot = await get(ref(database, "userInvestments"));
    if (!snapshot.exists()) return [];

    const investments = snapshot.val();
    return Object.keys(investments).map((key) => ({
      ...investments[key],
      id: key,
    }));
  }

  // Transaction operations
  static async createTransaction(
    transaction: Omit<PlatformTransaction, "id">
  ): Promise<string> {
    const newTransactionRef = push(ref(database, "platformTransactions"));
    await set(newTransactionRef, { ...transaction, id: newTransactionRef.key });
    return newTransactionRef.key!;
  }

  static async getUserTransactions(
    userId: string
  ): Promise<PlatformTransaction[]> {
    const snapshot = await get(
      query(
        ref(database, "platformTransactions"),
        orderByChild("userId"),
        equalTo(userId)
      )
    );
    if (!snapshot.exists()) return [];

    const transactions = snapshot.val();
    return Object.keys(transactions).map((key) => ({
      ...transactions[key],
      id: key,
    }));
  }

  static async getAllTransactions(): Promise<PlatformTransaction[]> {
    const snapshot = await get(ref(database, "platformTransactions"));
    if (!snapshot.exists()) return [];

    const transactions = snapshot.val();
    return Object.keys(transactions).map((key) => ({
      ...transactions[key],
      id: key,
    }));
  }

  // Withdrawal Method operations
  static async createWithdrawalMethod(
    method: Omit<WithdrawalMethod, "id">
  ): Promise<string> {
    const newMethodRef = push(ref(database, "withdrawalMethods"));
    await set(newMethodRef, { ...method, id: newMethodRef.key });
    return newMethodRef.key!;
  }

  static async getUserWithdrawalMethods(
    userId: string
  ): Promise<WithdrawalMethod[]> {
    const snapshot = await get(
      query(
        ref(database, "withdrawalMethods"),
        orderByChild("userId"),
        equalTo(userId)
      )
    );
    if (!snapshot.exists()) return [];

    const methods = snapshot.val();
    return Object.keys(methods).map((key) => ({ ...methods[key], id: key }));
  }

  static async updateWithdrawalMethod(
    methodId: string,
    updates: Partial<WithdrawalMethod>
  ): Promise<void> {
    await update(ref(database, `withdrawalMethods/${methodId}`), updates);
  }

  static async deleteWithdrawalMethod(methodId: string): Promise<void> {
    await remove(ref(database, `withdrawalMethods/${methodId}`));
  }

  // FAQ operations
  static async getFAQs(): Promise<FAQ[]> {
    const snapshot = await get(ref(database, "faqs"));
    if (!snapshot.exists()) return [];

    const faqs = snapshot.val();
    return Object.keys(faqs)
      .map((key) => ({ ...faqs[key], id: key }))
      .sort((a, b) => a.order - b.order);
  }

  // Market Data operations
  static async updateMarketData(
    symbol: string,
    data: Omit<MarketData, "id" | "symbol">
  ): Promise<void> {
    await set(ref(database, `marketData/${symbol}`), { ...data, symbol });
  }

  static async getMarketData(): Promise<MarketData[]> {
    const snapshot = await get(ref(database, "marketData"));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.keys(data).map((key) => ({ ...data[key], id: key }));
  }

  // Real-time listeners
  static onUserInvestmentsChange(
    userId: string,
    callback: (investments: UserInvestment[]) => void
  ): () => void {
    const investmentsRef = query(
      ref(database, "userInvestments"),
      orderByChild("userId"),
      equalTo(userId)
    );

    const unsubscribe = onValue(investmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const investments = snapshot.val();
        const investmentsList = Object.keys(investments).map((key) => ({
          ...investments[key],
          id: key,
        }));
        callback(investmentsList);
      } else {
        callback([]);
      }
    });

    return () => off(investmentsRef, "value", unsubscribe);
  }

  static onUserTransactionsChange(
    userId: string,
    callback: (transactions: PlatformTransaction[]) => void
  ): () => void {
    const transactionsRef = query(
      ref(database, "platformTransactions"),
      orderByChild("userId"),
      equalTo(userId)
    );

    const unsubscribe = onValue(transactionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const transactions = snapshot.val();
        const transactionsList = Object.keys(transactions).map((key) => ({
          ...transactions[key],
          id: key,
        }));
        callback(transactionsList);
      } else {
        callback([]);
      }
    });

    return () => off(transactionsRef, "value", unsubscribe);
  }
}
