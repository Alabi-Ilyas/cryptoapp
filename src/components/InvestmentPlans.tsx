import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { getPlans } from "../api/axios";
import type { InvestmentPlan } from "../type"; // Corrected import path
import { useAuth } from "../contexts/AuthContext";

const InvestmentPlans: React.FC = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await getPlans();
      const investmentPlans = response.data;

      // Filter for active plans based on the 'status' property
      const activePlans = investmentPlans.filter(
        (plan: InvestmentPlan) => plan?.status === "active"
      );

      // Remove duplicates by `_id`
      const uniquePlans = Array.from(
        new Map(activePlans.map((plan: InvestmentPlan) => [plan._id, plan])).values()
      );

      setPlans(uniquePlans as InvestmentPlan[]);
    } catch (error) {
      console.error("Error loading investment plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planName?: string) => {
    if (!planName || typeof planName !== "string") return DollarSign;

    if (planName.includes("AI")) return TrendingUp;
    if (planName.includes("Pro") || planName.includes("Alpha")) return Star;
    if (planName.includes("Guard")) return Shield;
    return DollarSign;
  };

  const getPlanColor = (index: number) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-teal-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-pink-500 to-rose-500",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-800/50" id="plans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading investment plans...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-800/50" id="plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your Investment Plan
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select from our carefully crafted investment plans designed to
            maximize your returns while minimizing risk through professional
            portfolio management.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan: InvestmentPlan, index) => {
            const IconComponent = getPlanIcon(plan?.planName);
            const isPopular =
              plan?.planName?.includes("Unique") ||
              plan?.planName?.includes("AI");

            // Use the profitPercent from the plan data
            const returnRate = plan.profitPercent ?? 0;

            // These are placeholder features since they don't exist in the type
            const features = [
              "Secure and safe",
              "24/7 support",
              "Daily payouts",
            ];

            return (
              <motion.div
                key={plan._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300 group hover:shadow-2xl ${
                  isPopular ? "ring-2 ring-emerald-500/50" : ""
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getPlanColor(
                    index
                  )} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Plan Details */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {plan?.planName || "Untitled Plan"}
                  </h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-emerald-400">
                      {returnRate.toFixed(2) ?? 0}%
                    </span>
                    <span className="text-gray-400 ml-2">return</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">
                        Duration: {plan.durationHours} hours
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">
                        Min: ${plan.minAmount?.toLocaleString() || 0} - Max:{" "}
                        ${plan.maxAmount?.toLocaleString() || "Unlimited"}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {features?.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-gray-300"
                      >
                        <Check className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  {currentUser ? (
                    <Link
                      to="/dashboard"
                      className={`w-full bg-gradient-to-r ${getPlanColor(
                        index
                      )} text-white py-3 rounded-lg font-semibold text-center block hover:shadow-lg transition-all duration-200 group-hover:shadow-emerald-500/25`}
                    >
                      Invest Now
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className={`w-full bg-gradient-to-r ${getPlanColor(
                        index
                      )} text-white py-3 rounded-lg font-semibold text-center block hover:shadow-lg transition-all duration-200 group-hover:shadow-emerald-500/25`}
                    >
                      Get Started
                    </Link>
                  )}
                </div>

                {/* Profit Calculator */}
                <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">
                    Example: $1,000 investment
                  </p>
                  <p className="text-emerald-400 font-bold">
                    Profit: $
                    {(
                      1000 * (returnRate / 100) || 0
                    ).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InvestmentPlans;
