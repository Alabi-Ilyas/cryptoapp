import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios"; // your axios instance
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

// --- Types ---
interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  isVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  mfaEnabled?: boolean;
}
interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  captchaToken: string;
}
interface LoginData {
  email: string;
  password: string;
  captchaToken: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  userProfile: UserProfile | null; // ✅ add this
  loading: boolean;
  login: (data: LoginData) => Promise<UserProfile>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// --- Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // --- Login ---
  // --- Login ---
  const login = async ({
    email,
    password,
    captchaToken,
  }: LoginData): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          captchaToken, // ✅ include token
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ save JWT
      localStorage.setItem("token", data.token);

      // ✅ set user
      setCurrentUser(data.user);
      setUserProfile(data.user);

      toast.success("Login successful!");
      return data.user;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
      throw error;
    }
  };

  // --- Register ---
  // --- Register ---
  const register = async ({
    email,
    password,
    firstName,
    lastName,
    captchaToken,
  }: RegisterData): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          role: "user",
          captchaToken, // ✅ send token
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success(data.message || "Account created successfully!");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  // --- Logout ---
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
  };

  // --- Fetch current user on page load ---
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentUser(res.data.user);
      setUserProfile(res.data.user);
    } catch (error) {
      setCurrentUser(null);
      setUserProfile(null); // ✅ clear on error
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="text-center p-4">Loading...</div> : children}
    </AuthContext.Provider>
  );
};
