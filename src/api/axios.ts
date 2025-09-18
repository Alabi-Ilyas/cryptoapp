import axios from "axios";

// Set your base URL here (Vite uses import.meta.env)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: true, // if you use cookies for auth
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTH / USER ====================

// Register
export const registerUser = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}) => API.post("/auth/register", data);

// Login
export const loginUser = (data: { email: string; password: string }) =>
  API.post("/auth/login", data);

// Logout
export const logoutUser = () => API.post("/auth/logout");

// Get current user
export const getMe = () => API.get("/auth/me");

// Refresh token
export const refreshToken = () => API.get("/auth/refresh-token");

// Forgot password
export const forgotPassword = (email: string) =>
  API.post("/auth/forgot-password", { email });

// Reset password
export const resetPassword = (token: string, newPassword: string) =>
  API.post(`/auth/reset-password/${token}`, { newPassword });

// ==================== DEPOSITS ====================

// Create deposit
export const createDeposit = (data: {
  amount: number;
  method: string;
  transactionId: string;
}) => API.post("/deposits", data);

// Get user deposits
export const getUserDeposits = () => API.get("/deposits/user");

// Get all deposits (admin)
export const getAllDeposits = () => API.get("/deposits");

// Update deposit status (admin)
export const updateDepositStatus = (id: string, status: string) =>
  API.put(`/deposits/${id}/status`, { status });

// ==================== INVESTMENTS ====================

// Create investment
export const createInvestment = (data: { planId: string; amount: number }) =>
  API.post("/investments", data);

// Get user investments
export const getUserInvestments = () => API.get("/investments");

// Get all investments (admin)
export const getAllInvestments = () => API.get("/investments");

export const updateInvestmentStatus = (id: string, status: string) =>
  API.put(`/investments/${id}/status`, { status });


// ==================== PLANS ====================

// Get all plans
export const getPlans = () => API.get("/plans");

// Create plan (admin)
export const createPlan = (data: {
  planName: string;
  amount: number;
  profit: number;
  status: string;
  endDate: string;
}) => API.post("/plans", data);

// Update plan (admin)
export const updatePlan = (id: string, data: any) =>
  API.put(`/plans/${id}`, data);

// Delete plan (admin)
export const deletePlan = (id: string) => API.delete(`/plans/${id}`);

// ==================== SECURITY EVENTS ====================

// Get security events (admin)
export const getSecurityEvents = () => API.get("/security-events");

// ==================== WITHDRAWALS ====================

// Request withdrawal
export const requestWithdrawal = (data: { amount: number; method: string }) =>
  API.post("/withdrawals", data);

// Get user withdrawals
export const getUserWithdrawals = () => API.get("/withdrawals/user");

// Get all withdrawals (admin)
export const getAllWithdrawals = () => API.get("/withdrawals");

// Update withdrawal status (admin)
export const updateWithdrawalStatus = (id: string, status: string) =>
  API.put(`/withdrawals/${id}/status`, { status });

// ==================== ADMIN / USERS & STATS ====================

// Get all users (admin)
export const getUsers = () => API.get("/admin/users");

// Update user role (admin)
export const updateUserRole = (id: string, role: string) =>
  API.put(`/admin/users/${id}/role`, { role });

// Get global stats (admin)
export const getGlobalStats = () => API.get("/admin/stats");

// ==================== WITHDRAWAL METHODS ====================

// Create a withdrawal method
export const createWithdrawalMethod = (data: {
  methodName: string;
  accountDetails: string;
  isDefault?: boolean;
}) => API.post("/withdrawal-methods", data);

// Get user's withdrawal methods
export const getUserWithdrawalMethods = () => API.get("/withdrawal-methods/user");

// Delete a withdrawal method
export const deleteWithdrawalMethod = (id: string) =>
  API.delete(`/withdrawal-methods/${id}`);

// ==================== TRANSACTIONS ====================

// Get user's transaction history
export const getUserTransactions = () => API.get("/transactions/user");

// Create a custom transaction (optional)
// Create transaction (works for deposits, withdrawals, and investments)
export const createTransaction = (data: {
  type: "deposit" | "withdrawal" | "investment";
  amount: number;
  method: string;
  reference?: string;
  status?: string;
  investmentId?: string; // ✅ only needed if type === "investment"
}) => API.post("/transactions", data);
// Approve a transaction (admin)
export const approveTransaction = (transactionId: string) =>
  API.put(`/transactions/approve/${transactionId}`);

// Get all transactions (admin)
export const getAllTransactions = () => API.get("/transactions");
// ==================== MFA ====================

// Generate MFA secret and backup codes
export const generateMFASecret = () => API.post("/auth/mfa/generate");

// Verify MFA token
export const verifyMFAToken = (data: { token: string }) =>
  API.post("/auth/mfa/verify", data);

// Save MFA setup (secret + backup codes)
export const saveMFASetup = (data: {
  secret: string;
  backupCodes: string[];
}) => API.put("/auth/mfa/setup", data);

// Disable MFA (optional)
export const disableMFA = () => API.put("/auth/mfa/disable");

// Verify backup code (optional for login recovery)
export const verifyBackupCode = (data: { code: string }) =>
  API.post("/auth/mfa/verify-backup", data);

// ==================== FAQ ====================

// Get all FAQs
export const getFAQs = () => API.get("/faq");

// Create FAQ (admin)
export const createFAQ = (data: { question: string; answer: string }) =>
  API.post("/faq", data);

// Update FAQ (admin)
export const updateFAQ = (id: string, data: { question?: string; answer?: string }) =>
  API.put(`/faq/${id}`, data);

// Delete FAQ (admin)
export const deleteFAQ = (id: string) => API.delete(`/faq/${id}`);

// ==================== CRYPTO ====================

// Get crypto OHLC (candlestick) data
export const getCryptoOHLC = (coin: string, days: number = 1) =>
  API.get(`/crypto/${coin}/ohlc?days=${days}`);

// Get crypto market data (list of coins)
export const getCryptoMarkets = () => API.get("/crypto/markets");

export default API;
