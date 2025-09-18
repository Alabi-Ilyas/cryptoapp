import {
  DatabaseService,
  InvestmentPlan,
  FAQ,
  User,
  UserInvestment,
  PlatformTransaction,
} from "./database";

// Demo investment plans
const demoPlans: Omit<InvestmentPlan, "id">[] = [
  {
    name: "Starter Plan",
    minAmount: 25,
    maxAmount: 200,
    returnRate: 5,
    duration: "24 hours",
    features: ["Low Risk", "Quick Returns", "24/7 Support"],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    name: "UNiQue Pack",
    minAmount: 300,
    maxAmount: 550,
    returnRate: 10,
    duration: "36 hours",
    features: [
      "Most Popular",
      "Higher Returns",
      "Priority Support",
      "Bonus Features",
    ],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    name: "Rockey Assets",
    minAmount: 2100,
    maxAmount: 60000,
    returnRate: 28,
    duration: "48 hours",
    features: ["High Returns", "Premium Support", "Advanced Analytics"],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    name: "AI Instant",
    minAmount: 3000,
    maxAmount: 999999,
    returnRate: 50,
    duration: "3 hours",
    features: [
      "AI-Powered",
      "Instant Returns",
      "Unlimited Investment",
      "VIP Support",
    ],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    name: "Bonus Plan",
    minAmount: 700,
    maxAmount: 50000,
    returnRate: 55,
    duration: "3 days",
    features: ["Extended Duration", "High Returns", "Bonus Rewards"],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    name: "Advanced Plan",
    minAmount: 1000,
    maxAmount: 15000,
    returnRate: 70,
    duration: "5 days",
    features: ["Advanced Strategy", "Premium Returns", "Expert Management"],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    name: "Capital Guard Plan",
    minAmount: 4000,
    maxAmount: 100000,
    returnRate: 80,
    duration: "12 days",
    features: ["Capital Protection", "Maximum Returns", "Risk Management"],
    isActive: true,
    createdAt: Date.now(),
  },
  {
    name: "AlphaGrid Pro",
    minAmount: 5500,
    maxAmount: 100000,
    returnRate: 98,
    duration: "21 days",
    features: [
      "Professional Grade",
      "Maximum Profit",
      "Elite Support",
      "Advanced Tools",
    ],
    isActive: true,
    createdAt: Date.now(),
  },
];

// Demo FAQs
const demoFAQs: Omit<FAQ, "id">[] = [
  {
    question: "How do I get started with Sovereign Assets?",
    answer:
      "Getting started is simple! Create an account, verify your email, choose an investment plan that suits your budget, and make your first investment. Our team will guide you through every step.",
    isActive: true,
    order: 1,
    createdAt: Date.now(),
  },
  {
    question: "What is the minimum investment amount?",
    answer:
      "Our minimum investment starts at just $25 with our Starter Plan. We offer various plans to accommodate different investment levels, from beginners to professional investors.",
    isActive: true,
    order: 2,
    createdAt: Date.now(),
  },
  {
    question: "How are profits calculated and when are they paid?",
    answer:
      "Profits are calculated based on the return rate of your chosen plan. For example, a 5% return on $100 gives you $5 profit. Profits are automatically credited to your account when the investment period ends.",
    isActive: true,
    order: 3,
    createdAt: Date.now(),
  },
  {
    question: "Is my investment secure with Sovereign Assets?",
    answer:
      "Yes, security is our top priority. We use advanced encryption, secure payment gateways, and follow strict financial regulations. Your investments are protected by our comprehensive security measures.",
    isActive: true,
    order: 4,
    createdAt: Date.now(),
  },
  {
    question: "Can I withdraw my funds anytime?",
    answer:
      "You can withdraw your profits and completed investments anytime. Active investments must complete their duration before withdrawal. We process withdrawal requests within 24-48 hours.",
    isActive: true,
    order: 5,
    createdAt: Date.now(),
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including bank transfers, PayPal, and major credit/debit cards. Choose the method that's most convenient for you during the investment process.",
    isActive: true,
    order: 6,
    createdAt: Date.now(),
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes! We provide 24/7 customer support through live chat, email, and phone. Our expert team is always ready to assist you with any questions or concerns about your investments.",
    isActive: true,
    order: 7,
    createdAt: Date.now(),
  },
  {
    question: "Can I have multiple active investments?",
    answer:
      "Absolutely! You can have multiple investments running simultaneously across different plans. This helps diversify your portfolio and maximize your earning potential.",
    isActive: true,
    order: 8,
    createdAt: Date.now(),
  },
];

// Demo admin user
const demoAdmin: Omit<User, "id"> = {
  username: "admin",
  email: "admin@sovereignassets.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  createdAt: Date.now(),
  lastLogin: Date.now(),
};

// Demo regular users
const demoUsers: Omit<User, "id">[] = [
  {
    username: "john_doe",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    createdAt: Date.now() - 86400000 * 30, // 30 days ago
    lastLogin: Date.now() - 3600000, // 1 hour ago
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "user",
    createdAt: Date.now() - 86400000 * 15, // 15 days ago
    lastLogin: Date.now() - 7200000, // 2 hours ago
  },
  {
    username: "mike_wilson",
    email: "mike@example.com",
    firstName: "Mike",
    lastName: "Wilson",
    role: "user",
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
    lastLogin: Date.now() - 1800000, // 30 minutes ago
  },
];

export class DemoDataService {
  static async initializeDemoData(): Promise<void> {
    try {
      // Check if demo data already exists
      const existingPlans = await DatabaseService.getInvestmentPlans();
      if (existingPlans.length > 0) {
        console.log("Demo data already exists, skipping initialization");
        return;
      }

      console.log("Initializing demo data...");

      // Create investment plans
      for (const plan of demoPlans) {
        await DatabaseService.createInvestmentPlan(plan);
      }

      // Create FAQs
      for (const faq of demoFAQs) {
        await DatabaseService.createInvestmentPlan(faq as any); // Note: You'll need to add FAQ creation method
      }

      console.log("Demo data initialized successfully");
    } catch (error) {
      console.error("Error initializing demo data:", error);
    }
  }

  static getDemoPlans(): Omit<InvestmentPlan, "id">[] {
    return demoPlans;
  }

  static getDemoFAQs(): Omit<FAQ, "id">[] {
    return demoFAQs;
  }

  static getDemoUsers(): Omit<User, "id">[] {
    return [...demoUsers, demoAdmin];
  }
}
