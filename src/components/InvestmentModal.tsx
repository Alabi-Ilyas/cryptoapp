import React, { useState, useEffect } from "react";
import { X, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { createInvestment, createTransaction, getPlans } from "../api/axios";
import type { InvestmentPlan } from "../type";

const investmentSchema = z.object({
  plan: z.string().min(1, "Please select a plan"),
  amount: z.number().min(1, "Amount must be greater than 0"),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type CreateInvestmentPayload = {
  planId: string;
  amount: number;
  profit: number;
};

const wallets = [
  { label: "BTC", address: "bc1qk70eh4ca7q3u0q3055g9d85yrre4xskhkr4lpv" },
  { label: "USDT TRC20", address: "TG16m34wzsN1tqU2zEgskpYHco2zLzR88C" },
  {
    label: "USDT ERC20 / ETH",
    address: "0xe916988995F7d5B46870E36b6736E145cC5FD7f5",
  },
  { label: "BNB", address: "0x95a2D05a028c2f2E22a058AE45eFF83115Fd2Ad9" },
  { label: "TON", address: "UQAmENJ-FHW7qhHJfiy3TpGFYKoE0vyj5ZKWSAM4KtjvwPqD" },
  { label: "Solana", address: "HaeMss5Puo1aasft4Hc6XGezbhGoJhtC2FyXBY6an7i2" },
  { label: "XRP", address: "rnCrVNu5nnNRbSb1jqmnu2bqxs8MeNc9XQ" },
];

const InvestmentModal: React.FC<InvestmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [showWallets, setShowWallets] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdInvestment, setCreatedInvestment] = useState<any>(null);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlans();
        const validPlans = res.data.filter(
          (p: InvestmentPlan) =>
            typeof p.profitPercent === "number" && !isNaN(p.profitPercent)
        );
        setPlans(validPlans);
      } catch (error) {
        toast.error("Failed to load plans");
      }
    };
    fetchPlans();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
  });

  const watchedAmount = watch("amount");
  const watchedPlanId = watch("plan");
  const selectedPlan = plans.find((p) => p._id === watchedPlanId);

 const onSubmit = async (data: InvestmentFormData) => {
  if (!selectedPlan) {
    toast.error("Please select a valid plan.");
    return;
  }

  if (
    data.amount < selectedPlan.minAmount ||
    data.amount > selectedPlan.maxAmount
  ) {
    toast.error(
      `Amount must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount}.`
    );
    return;
  }

  setIsLoading(true);
  try {
    const profit = (data.amount * selectedPlan.profitPercent) / 100;
    const payload: CreateInvestmentPayload = {
      planId: data.plan,
      amount: data.amount,
      profit,
    };

    const investmentResponse = await createInvestment(payload);
    setCreatedInvestment(investmentResponse.data.investment); // store it for transaction
    toast.success("Investment created! Now select a wallet to deposit.");
    setShowWallets(true);

  } catch (error: any) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Failed to create investment"
    );
  } finally {
    setIsLoading(false);
  }
};


  const handleRequestConfirmation = async () => {
    if (!selectedWallet || !watchedAmount || !createdInvestment) {
      toast.error("Please select a wallet.");
      return;
    }

    setIsLoading(true);
    try {
      await createTransaction({
        type: "investment", // important: must be "investment"
        amount: watchedAmount,
        method: selectedWallet,
        status: "pending",
        investmentId: createdInvestment._id, // link to the investment
      });

      toast.success("Transaction created! Status: Pending");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">New Investment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Plan dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Select Plan
            </label>
            <select
              {...register("plan")}
              className="w-full pl-4 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">-- Choose a plan --</option>
              {plans.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.planName} - ${p.minAmount?.toLocaleString() || "N/A"} - $
                  {p.maxAmount?.toLocaleString() || "N/A"}
                </option>
              ))}
            </select>
            {errors.plan && (
              <p className="text-red-400 text-sm">{errors.plan.message}</p>
            )}
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Enter amount"
              />
            </div>
            {errors.amount && (
              <p className="text-red-400 text-sm">{errors.amount.message}</p>
            )}
            {watchedAmount && selectedPlan && (
              <p className="text-gray-400 text-xs mt-1">
                You selected <strong>{selectedPlan.planName}</strong> and
                entered <strong>${watchedAmount.toLocaleString()}</strong>. The
                plan requires a minimum of{" "}
                <strong>${selectedPlan.minAmount?.toLocaleString()}</strong> and
                a maximum of{" "}
                <strong>${selectedPlan.maxAmount?.toLocaleString()}</strong>.
              </p>
            )}
          </div>

          {/* Wallet selection */}
          {showWallets && (
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 text-sm text-gray-200 space-y-2">
              <p className="text-emerald-400 font-semibold mb-2">
                Select a wallet for your deposit:
              </p>
              {wallets.map((w) => (
                <label key={w.label} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="wallet"
                    value={w.label}
                    checked={selectedWallet === w.label}
                    onChange={() =>
                      setSelectedWallet(`${w.label} - ${w.address}`)
                    }
                  />
                  <span>
                    {w.label}: {w.address}
                  </span>
                </label>
              ))}
              <button
                type="button"
                onClick={handleRequestConfirmation}
                disabled={!selectedWallet || isLoading}
                className="mt-3 w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Request Confirmation"}
              </button>
            </div>
          )}

          {/* Submit button */}
          {!showWallets && (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default InvestmentModal;
