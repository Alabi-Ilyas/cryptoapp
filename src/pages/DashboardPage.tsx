import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Plus,
  Eye,
  EyeOff,
  CreditCard,
  History,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserInvestments,
  getUserTransactions,
  getPlans,
  getUserWithdrawalMethods,
  createDeposit,
} from "../api/axios";
import { format } from "date-fns";
import toast from "react-hot-toast";
import InvestmentModal from "../components/InvestmentModal";
import WithdrawalMethodModal from "../components/WithdrawalMethodModal";
import MFASetup from "../components/MFASetup";
import type {
  Transaction,
  Investment,
  WithdrawalMethod,
  InvestmentPlan,
} from "../type";
// Import the useTranslation hook
import { useTranslation } from "react-i18next";

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, logout, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showBalance, setShowBalance] = useState(true);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [withdrawalMethods, setWithdrawalMethods] = useState<
    WithdrawalMethod[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [methods, setMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [depositAmount, setDepositAmount] = useState<number>(0);

  useEffect(() => {
    async function loadMethods() {
      const res = await getUserWithdrawalMethods();
      setMethods(res.data);
    }
    loadMethods();
  }, []);

  const handleDeposit = async () => {
    if (!selectedMethod || !depositAmount) return;
    const transactionId = "TXN" + Date.now(); // unique reference
    try {
      await createDeposit({
        amount: depositAmount,
        method: selectedMethod,
        transactionId,
      });
      toast.success(t("dashboard.depositRequested"));
      loadDashboardData(); // refresh dashboard data
    } catch (error) {
      console.error(error);
      toast.error(t("dashboard.deposit_failed"));
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      const [investmentsRes, transactionsRes, plansRes, methodsRes] =
        await Promise.all([
          getUserInvestments(),
          getUserTransactions(),
          getPlans(),
          getUserWithdrawalMethods(),
        ]);

      setInvestments(investmentsRes?.data || []);
      setTransactions(transactionsRes?.data || []);
      setInvestmentPlans(plansRes?.data || []);
      setWithdrawalMethods(methodsRes?.data || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error(t("dashboard.failed_to_load"));
    } finally {
      setLoading(false);
    }
  };

  const parseDate = (value?: string | number | null) => {
    if (!value && value !== 0) return null;
    const d =
      typeof value === "number" ? new Date(value) : new Date(String(value));
    return isNaN(d.getTime()) ? null : d;
  };

  const safeFormat = (value?: string | number | null, fmt = "MMM dd, yyyy") => {
    const d = parseDate(value);
    return d ? format(d, fmt) : "N/A";
  };

  const totalInvested = investments.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  );
  const totalProfit = investments.reduce(
    (sum, inv) => sum + (inv.profit || 0),
    0
  );
  const activeInvestments = investments.filter(
    (inv) => inv.status === "active"
  ).length;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleInvestmentSuccess = () => {
    loadDashboardData();
    setShowInvestmentModal(false);
  };

  const handleWithdrawalMethodSuccess = () => {
    loadDashboardData();
    setShowWithdrawalModal(false);
  };

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">{t("dashboard.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src="/images/logo.jpg"
                alt="Sovereign Assets Capital"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h1 className="text-xl font-bold text-white">
                  {t("dashboard.title")}
                </h1>
                <p className="text-gray-400 text-sm">
                  {t("dashboard.welcome", {
                    name: userProfile?.firstName || "User",
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              {t("dashboard.logout")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {showBalance ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {t("dashboard.total_balance")}
              </p>
              <p className="text-2xl font-bold text-white">
                {showBalance
                  ? `$${(totalInvested + totalProfit).toLocaleString()}`
                  : "****"}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {t("dashboard.totalInvested")}
              </p>
              <p className="text-2xl font-bold text-white">
                {showBalance ? `$${totalInvested.toLocaleString()}` : "****"}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <PieChart className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {t("dashboard.totalProfit")}
              </p>
              <p className="text-2xl font-bold text-white">
                {showBalance ? `$${totalProfit.toLocaleString()}` : "****"}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Plus className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {t("dashboard.active_investments")}
              </p>
              <p className="text-2xl font-bold text-white">
                {activeInvestments}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 mb-8">
          <div className="overflow-x-auto border-b border-gray-700">
            <div className="flex min-w-max">
              {[
                {
                  id: "overview",
                  label: t("dashboard.tabs.overview"),
                  icon: PieChart,
                },
                {
                  id: "investments",
                  label: t("dashboard.tabs.investments"),
                  icon: TrendingUp,
                },
                {
                  id: "transactions",
                  label: t("dashboard.tabs.transactions"),
                  icon: History,
                },
                {
                  id: "settings",
                  label: t("dashboard.tabs.settings"),
                  icon: Settings,
                },
                {
                  id: "security",
                  label: t("dashboard.tabs.security"),
                  icon: Shield,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-emerald-400 border-b-2 border-emerald-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">
                    {t("dashboard.portfolio_overview")}
                  </h2>
                  <button
                    onClick={() => setShowInvestmentModal(true)}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2 inline" />
                    {t("dashboard.new_investment")}
                  </button>
                </div>

                {investments.length === 0 ? (
                  <div className="text-center py-12">
                    <PieChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">
                      {t("dashboard.no_investments")}
                    </h3>
                    <p className="text-gray-500 mb-4">{t("start_journey")}</p>
                    <button
                      onClick={() => setShowInvestmentModal(true)}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      {t("dashboard.first_investment")}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {investments.slice(0, 4).map((investment) => {
                      const plan = investmentPlans.find(
                        (p) => p._id === investment.plan
                      );

                      const start = parseDate(investment.startDate);
                      const end = parseDate(investment.endDate);
                      const now = new Date().getTime();
                      const progress =
                        start && end
                          ? ((now - start.getTime()) /
                              (end.getTime() - start.getTime())) *
                            100
                          : 0;

                      return (
                        <div
                          key={investment._id}
                          className="bg-gray-700 rounded-xl p-4 border border-gray-600"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-white">
                                {plan?.planName || "Unknown Plan"}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                ${investment.amount?.toLocaleString()}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                investment.status === "active"
                                  ? "bg-green-500/20 text-green-400"
                                  : investment.status === "completed"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {t(`status.${investment.status}`)}
                            </span>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">
                                {t("dashboard.progress")}
                              </span>
                              <span className="text-gray-400">
                                {Math.min(Math.max(progress, 0), 100).toFixed(
                                  0
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all"
                                style={{
                                  width: `${Math.min(
                                    Math.max(progress, 0),
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              {t("dashboard.profit")}: $
                              {investment.profit?.toLocaleString()}
                            </span>
                            <span className="text-gray-400">
                              {safeFormat(investment.endDate)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Investments Tab */}
            {activeTab === "investments" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">
                    {t("dashboard.my_investments")}
                  </h2>
                  <button
                    onClick={() => setShowInvestmentModal(true)}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2 inline" />
                    {t("dashboard.new_investment")}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          {t("dashboard.table.plan")}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          {t("dashboard.table.amount")}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          {t("dashboard.table.profit")}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          {t("dashboard.table.status")}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          {t("dashboard.table.end_date")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((investment) => {
                        const plan = investmentPlans.find(
                          (p) => p._id === investment.plan
                        );
                        return (
                          <tr
                            key={investment._id}
                            className="border-b border-gray-700"
                          >
                            <td className="py-3 px-4 text-white">
                              {plan?.planName || "Unknown Plan"}
                            </td>
                            <td className="py-3 px-4 text-white">
                              ${investment.amount?.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-green-400">
                              ${investment.profit?.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  investment.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : investment.status === "completed"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {t(`status.${investment.status}`)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {safeFormat(investment.endDate)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">
                  {t("dashboard.transaction_history")}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          {t("dashboard.table.date")}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          {t("dashboard.table.type")}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          {t("dashboard.table.amount")}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          {t("dashboard.table.status")}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          {t("dashboard.table.reference")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction._id}
                          className="border-b border-gray-700"
                        >
                          <td className="py-3 px-4 text-white">
                            {safeFormat(
                              transaction.createdAt,
                              "MMM dd, yyyy HH:mm"
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.type === "deposit"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : transaction.type === "withdrawal"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {transaction.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white">
                            ${transaction.amount?.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.status === "approved"
                                  ? "bg-green-500/20 text-green-400"
                                  : transaction.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {t(`status.${transaction.status}`)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {transaction.reference || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">
                  {t("dashboard.account_settings")}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Profile Information */}
                  <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-4">
                      {t("dashboard.profile_info")}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          {t("dashboard.full_name")}
                        </label>
                        <p className="text-white">
                          {userProfile?.firstName} {userProfile?.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          {t("dashboard.email")}
                        </label>
                        <p className="text-white">{userProfile?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          {t("dashboard.member_since")}
                        </label>
                        <p className="text-white">
                          {userProfile?.createdAt
                            ? safeFormat(userProfile.createdAt, "MMMM dd, yyyy")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Methods */}
                  <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-white">
                        {t("dashboard.withdrawal_methods")}
                      </h3>
                      <button
                        onClick={() => setShowWithdrawalModal(true)}
                        className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-emerald-600 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1 inline" />
                        {t("dashboard.add_method")}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {withdrawalMethods.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                          {t("dashboard.no_methods")}
                        </p>
                      ) : (
                        withdrawalMethods.map((method) => (
                          <div
                            key={method._id}
                            className="flex items-center justify-between p-3 bg-gray-600 rounded-lg"
                          >
                            <div className="flex items-center">
                              <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {t(`method_names.${method.methodName}`)}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {method.accountDetails}
                                </p>
                              </div>
                            </div>
                            {method.isDefault && (
                              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">
                                {t("dashboard.primary")}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">
                  {t("dashboard.security_settings")}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Multi-Factor Authentication */}
                  <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <div className="flex items-center mb-4">
                      <Shield className="w-6 h-6 text-emerald-400 mr-2" />
                      <h3 className="text-lg font-medium text-white">
                        {t("dashboard.two_factor_auth")}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      {t("dashboard.2fa_description")}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            userProfile?.mfaEnabled
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {userProfile?.mfaEnabled
                            ? t("dashboard.2fa_enabled")
                            : t("dashboard.2fa_disabled")}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowMFASetup(true)}
                        className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors"
                      >
                        {userProfile?.mfaEnabled
                          ? t("dashboard.2fa_manage")
                          : t("dashboard.2fa_enable")}{" "}
                        2FA
                      </button>
                    </div>
                  </div>

                  {/* Security Status */}
                  <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-4">
                      {t("dashboard.security_status")}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: t("dashboard.ssl_encryption"), status: true },
                        {
                          label: t("dashboard.account_verification"),
                          status: true,
                        },
                        {
                          label: t("dashboard.two_factor_auth"),
                          status: userProfile?.mfaEnabled || false,
                        },
                        {
                          label: t("dashboard.secure_connection"),
                          status: true,
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-300 text-sm">
                            {item.label}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {item.status
                              ? t("dashboard.status_active")
                              : t("dashboard.status_inactive")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showInvestmentModal && (
        <InvestmentModal
          isOpen={showInvestmentModal}
          onClose={() => setShowInvestmentModal(false)}
          onSuccess={handleInvestmentSuccess}
        />
      )}

      {showWithdrawalModal && (
        <WithdrawalMethodModal
          isOpen={showWithdrawalModal}
          onClose={() => setShowWithdrawalModal(false)}
          onSuccess={handleWithdrawalMethodSuccess}
        />
      )}

      {showMFASetup && (
        <MFASetup
          isOpen={showMFASetup}
          onClose={() => setShowMFASetup(false)}
          onSuccess={() => {
            loadDashboardData();
            setShowMFASetup(false);
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
