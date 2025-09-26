import React, { useState, useEffect } from "react";
import { X, Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createWithdrawalMethod } from "../api/axios"; // ✅ use your axios.ts
import toast from "react-hot-toast"; // or whatever toast lib you use

const withdrawalMethodSchema = z.object({
  type: z.enum(["crypto"]), // Only crypto is allowed
  address: z.string().min(1, "Crypto address is required"),
  isPrimary: z.boolean().default(false),
});

type WithdrawalMethodFormData = z.infer<typeof withdrawalMethodSchema>;

interface WithdrawalMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // refresh list after success
}

const WithdrawalMethodModal: React.FC<WithdrawalMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<WithdrawalMethodFormData>({
    resolver: zodResolver(withdrawalMethodSchema),
    defaultValues: {
      type: "crypto", // default
      address: "",
      isPrimary: false,
    },
  });

  // Always enforce crypto as the type on modal open
  useEffect(() => {
    if (isOpen) {
      setValue("type", "crypto");
    }
  }, [isOpen, setValue]);

  const onSubmit = async (data: WithdrawalMethodFormData) => {
    setIsLoading(true);
    try {
      const details = { address: data.address };

      await createWithdrawalMethod({
        methodName: data.type,
        accountDetails: JSON.stringify(details),
        isDefault: data.isPrimary,
      });

      toast.success("Withdrawal method added successfully!");
      reset({ type: "crypto", address: "", isPrimary: false });
      onSuccess(); // ✅ tell dashboard to refresh
      onClose();
    } catch (error: any) {
      console.error("Error adding withdrawal method:", error);
      toast.error(error.response?.data?.message || "Failed to add withdrawal method");
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
          <h2 className="text-xl font-bold text-white">Add Withdrawal Method</h2>
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
            <div className="grid grid-cols-1 gap-3">
              <label className="cursor-pointer">
                <input
                  {...register("type")}
                  type="radio"
                  value="crypto"
                  className="sr-only"
                />
                <div className="flex flex-col items-center p-4 border-2 rounded-lg transition-all border-emerald-500 bg-emerald-500/10">
                  <Wallet className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-white">Crypto</span>
                </div>
              </label>
            </div>
          </div>

          {/* Crypto Address */}
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
            {errors.address && (
              <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

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
            disabled={isLoading}
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
