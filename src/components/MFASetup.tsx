import React, { useState, useEffect } from "react";
import { X, Shield, Copy, Check, AlertTriangle } from "lucide-react";
import QRCode from "react-qr-code";
import axios from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

interface MFASetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MFASetup: React.FC<MFASetupProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<"setup" | "verify" | "backup">("setup");
  const [mfaData, setMfaData] = useState<{
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen && currentUser) {
      generateMFASecret();
    }
  }, [isOpen, currentUser]);

  const generateMFASecret = async () => {
    try {
      const res = await axios.post("/auth/mfa/generate");
      setMfaData(res.data);
    } catch (err) {
      toast.error("Failed to generate MFA secret");
      console.error(err);
    }
  };

  const handleVerifyCode = async () => {
    if (!mfaData || !verificationCode) return;

    setIsLoading(true);
    try {
      const res = await axios.post("/auth/mfa/verify", {
        token: verificationCode,
      });

      if (res.data.success) {
        await axios.put("/auth/mfa/setup", {
          secret: mfaData.secret,
          backupCodes: mfaData.backupCodes,
        });

        setStep("backup");
        toast.success("MFA verification successful!");
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("MFA verification error:", error);
      toast.error("Failed to verify MFA code");
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackupCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodes((prev) => new Set([...prev, index]));
    toast.success("Backup code copied!");

    setTimeout(() => {
      setCopiedCodes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 2000);
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
    toast.success("Multi-Factor Authentication enabled successfully!");
  };

  if (!isOpen || !mfaData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-emerald-400 mr-2" />
            <h2 className="text-xl font-bold text-white">
              Enable Two-Factor Authentication
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Setup */}
          {step === "setup" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Scan QR Code
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Use your authenticator app (Google Authenticator, Authy, etc.)
                  to scan this QR code
                </p>
              </div>

              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCode value={mfaData.qrCodeUrl} size={200} />
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-2">
                  Can't scan? Enter this code manually:
                </p>
                <div className="flex items-center justify-between bg-gray-600 rounded p-2">
                  <code className="text-emerald-400 text-sm font-mono">
                    {mfaData.secret}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(mfaData.secret);
                      toast.success("Secret copied!");
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep("verify")}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Continue to Verification
              </button>
            </div>
          )}

          {/* Step 2: Verify */}
          {step === "verify" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Verify Setup
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <input
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="000000"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                maxLength={6}
              />

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep("setup")}
                  className="flex-1 border border-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Backup Codes */}
          {step === "backup" && (
            <div className="space-y-6">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Save Backup Codes
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Store these backup codes in a safe place. You can use them if
                  you lose your authenticator device.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2">
                  {mfaData.backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-600 rounded p-2"
                    >
                      <code className="text-emerald-400 text-sm font-mono">
                        {code}
                      </code>
                      <button
                        onClick={() => copyBackupCode(code, index)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedCodes.has(index) ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  <strong>Important:</strong> Each backup code can only be used
                  once. Save them securely before continuing.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Complete Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MFASetup;
