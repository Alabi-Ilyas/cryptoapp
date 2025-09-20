import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  email: z.string().email("errors.invalidEmail"),
  password: z.string().min(6, "errors.passwordMin"),
});

type LoginFormData = z.infer<typeof loginSchema>;
const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const token = captchaToken || (await recaptchaRef.current?.executeAsync());
    if (!token) {
      toast.error(t("errors.captchaRequired"));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    try {
      const user = await login({
        email: data.email,
        password: data.password,
        captchaToken: token,
      });

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Link
          to="/"
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("login.backToHome")}
        </Link>

        <div className="text-center mb-8">
          <img
            src="/images/logo.jpg"
            alt={t("appName")}
            className="w-16 h-16 mx-auto mb-4 rounded-full"
          />
          <h1 className="text-3xl font-bold text-white mb-2">{t("login.welcome")}</h1>
          <p className="text-gray-400">{t("login.signInSubheading")}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t("login.email")}
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder={t("login.emailPlaceholder")}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{t(errors.email.message as string)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t("login.password")}
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-12"
                  placeholder={t("login.passwordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{t(errors.password.message as string)}</p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                onClick={() =>
                  toast(t("login.forgotFeature"), { icon: "ℹ️" })
                }
              >
                {t("login.forgot")}
              </button>
            </div>

            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
                onChange={(token) => setCaptchaToken(token)}
                theme="dark"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !captchaToken}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("login.signingIn") : t("login.signIn")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t("login.noAccount")}&nbsp;
              <Link
                to="/register"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                {t("register.createAccount")}
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <h3 className="text-sm font-medium text-gray-300 mb-2">{t("login.demoCredentials")}</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p><strong>{t("login.demoAdmin")}</strong></p>
              <p><strong>{t("login.demoUser")}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
