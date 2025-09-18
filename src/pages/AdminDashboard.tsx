import React, { useState, useEffect } from "react";
import { Users, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getUsers,
  getAllInvestments,
  getAllWithdrawals,
  getAllDeposits,
  getAllTransactions,
  updateWithdrawalStatus,
  updateInvestmentStatus,
  getGlobalStats,
  approveTransaction,
} from "../api/axios";

import { User, Investment, Transaction } from "../type";
import { format } from "date-fns";
import toast from "react-hot-toast";

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvested: 0,
    totalProfit: 0,
    pendingTransactions: 0, // ✅ renamed
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [
        allUsers,
        allInvestments,
        withdrawals,
        deposits,
        allTransactions,
        globalStats,
      ] = await Promise.all([
        getUsers(),
        getAllInvestments(),
        getAllWithdrawals(),
        getAllDeposits(),
        getAllTransactions(),
        getGlobalStats(),
      ]);

      setUsers(allUsers.data);
      setInvestments(allInvestments.data);
      setTransactions(allTransactions.data); // use this instead of combining manually
      setStats(globalStats.data);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTransaction = async (transactionId: string) => {
    try {
      await approveTransaction(transactionId);

      // Remove from UI immediately
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));

      // Refresh overview stats
      const statsRes = await getGlobalStats();
      setStats(statsRes.data);

      toast.success("Transaction approved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve transaction");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-md px-6 sm:px-8 lg:px-12 flex justify-between items-center py-4">
        <div className="flex items-center">
          <img
            src="/images/logo.jpg"
            alt="Admin Logo"
            className="w-10 h-10 rounded-full mr-3"
          />
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex space-x-6">
        {["overview", "users", "transactions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize ${
              activeTab === tab
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-400 hover:text-white"
            } pb-1`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-white">
                {stats.totalUsers}
              </h3>
              <Users className="h-6 w-6 text-emerald-400 mt-2" />
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Total Invested</p>
              <h3 className="text-2xl font-bold text-white">
                ${stats.totalInvested.toLocaleString()}
              </h3>
              <TrendingUp className="h-6 w-6 text-blue-400 mt-2" />
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Total Profit</p>
              <h3 className="text-2xl font-bold text-white">
                ${stats.totalProfit.toLocaleString()}
              </h3>
              <DollarSign className="h-6 w-6 text-yellow-400 mt-2" />
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Pending Transactions</p>
              <h3 className="text-2xl font-bold text-white">
                {stats.pendingTransactions}
              </h3>
              <Clock className="h-6 w-6 text-red-400 mt-2" />
            </div>
          </div>
        )}

        {/* Users Table */}
        {/* Users Table */}
        {activeTab === "users" && (
          <div className="overflow-x-auto bg-gray-800 rounded-lg p-4">
            <table className="min-w-full text-left text-gray-300 border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  {[
                    "Name",
                    "Email",
                    "Role",
                    "Status",
                    "Created",
                    "Last Login",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-sm font-semibold text-gray-400"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr
                    key={u._id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-700" : ""
                    } hover:bg-gray-600 transition`}
                  >
                    <td className="px-4 py-2">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2 capitalize">{u.role}</td>
                    <td className="px-4 py-2">
                      {u.isVerified ? "Verified" : "Unverified"}
                    </td>
                    <td className="px-4 py-2">
                      {u.createdAt
                        ? format(new Date(u.createdAt), "MMM dd, yyyy")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {u.lastLogin
                        ? format(new Date(u.lastLogin), "MMM dd, yyyy")
                        : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions */}
        {/* Transactions */}
        {activeTab === "transactions" && (
          <div>
            <h2 className="text-white text-lg mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {transactions.map((t) => (
                <div
                  key={t._id}
                  className="bg-gray-800 p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <p>
                      <span className="font-bold capitalize">{t.type}</span> – $
                      {t.amount.toLocaleString()}
                    </p>
                    <p>Status: {t.status}</p>
                  </div>
                  {t.status === "pending" && (
                    <button
                      onClick={() => handleApproveTransaction(t._id)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-md text-sm font-semibold transition"
                    >
                      Approve Transaction
                    </button>
                  )}
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-gray-400">No transactions available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
