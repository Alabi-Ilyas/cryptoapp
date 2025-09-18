import React, { useState } from "react";
import { X, CreditCard, Mail, Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { createWithdrawalMethod } from "../api/axios";

import toast from "react-hot-toast";

const withdrawalMethodSchema = z
  .object({
    type: z.enum(["bank", "paypal", "crypto"]),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.type === "bank") {
        return data.accountName && data.accountNumber && data.bankName;
      }
      if (data.type === "paypal") {
        return data.email;
      }
      if (data.type === "crypto") {
        return data.address;
      }
      return false;
    },
    {
      message: "Please fill in all required fields for the selected method",
    }
  );

type WithdrawalMethodFormData = z.infer<typeof withdrawalMethodSchema>;

interface WithdrawalMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const WithdrawalMethodModal: React.FC<WithdrawalMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<WithdrawalMethodFormData>({
    resolver: zodResolver(withdrawalMethodSchema),
  });

  const watchedType = watch("type");

  const onSubmit = async (data: WithdrawalMethodFormData) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const details: any = {};

      if (data.type === "bank") {
        details.accountName = data.accountName;
        details.accountNumber = data.accountNumber;
        details.bankName = data.bankName;
      } else if (data.type === "paypal") {
        details.email = data.email;
      } else if (data.type === "crypto") {
        details.address = data.address;
      }

      await createWithdrawalMethod({
        methodName: data.type,
        accountDetails: JSON.stringify(details),
        isDefault: data.isPrimary,
      });

      toast.success("Withdrawal method added successfully!");
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error adding withdrawal method:", error);
      toast.error("Failed to add withdrawal method");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            Add Withdrawal Method
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Method Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Withdrawal Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "bank", label: "Bank", icon: CreditCard },
                { value: "paypal", label: "PayPal", icon: Mail },
                { value: "crypto", label: "Crypto", icon: Wallet },
              ].map((method) => (
                <label key={method.value} className="cursor-pointer">
                  <input
                    {...register("type")}
                    type="radio"
                    value={method.value}
                    className="sr-only"
                  />
                  <div
                    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                      watchedType === method.value
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <method.icon className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-white">{method.label}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Bank Details */}
          {watchedType === "bank" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Name
                </label>
                <input
                  {...register("accountName")}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Number
                </label>
                <input
                  {...register("accountNumber")}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bank Name
                </label>
                <input
                  {...register("bankName")}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Chase Bank"
                />
              </div>
            </div>
          )}

          {/* PayPal Details */}
          {watchedType === "paypal" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                PayPal Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
          )}

          {/* Crypto Details */}
          {watchedType === "crypto" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wallet Address
              </label>
              <input
                {...register("address")}
                type="text"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              />
            </div>
          )}

          {/* Primary Method */}
          <div className="flex items-center">
            <input
              {...register("isPrimary")}
              type="checkbox"
              className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <label className="ml-2 text-sm text-gray-300">
              Set as primary withdrawal method
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !watchedType}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Adding Method..." : "Add Withdrawal Method"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalMethodModal;
