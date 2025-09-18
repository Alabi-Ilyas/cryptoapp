import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  Activity,
  Eye,
  Clock,
  User,
} from "lucide-react";
import { SecurityUtils } from "../lib/security";
import { format } from "date-fns";

interface SecurityEvent {
  id: string;
  type:
    | "login"
    | "failed_login"
    | "mfa_enabled"
    | "mfa_disabled"
    | "suspicious_activity";
  userId?: string;
  ip?: string;
  userAgent?: string;
  details?: any;
  timestamp: string;
}

const SecurityMonitor: React.FC = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [filter, setFilter] = useState<"all" | "suspicious" | "failed_login">(
    "all"
  );
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    loadSecurityEvents();

    // Simulate real-time monitoring
    const interval = setInterval(() => {
      if (isMonitoring) {
        loadSecurityEvents();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const loadSecurityEvents = () => {
    try {
      const logs = JSON.parse(localStorage.getItem("security_logs") || "[]");
      setSecurityEvents(logs.reverse()); // Show newest first
    } catch (error) {
      console.error("Error loading security events:", error);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return <User className="w-4 h-4 text-green-400" />;
      case "failed_login":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "suspicious_activity":
        return <Shield className="w-4 h-4 text-yellow-400" />;
      case "mfa_enabled":
      case "mfa_disabled":
        return <Shield className="w-4 h-4 text-blue-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "login":
        return "border-green-500/20 bg-green-500/10";
      case "failed_login":
        return "border-red-500/20 bg-red-500/10";
      case "suspicious_activity":
        return "border-yellow-500/20 bg-yellow-500/10";
      case "mfa_enabled":
      case "mfa_disabled":
        return "border-blue-500/20 bg-blue-500/10";
      default:
        return "border-gray-500/20 bg-gray-500/10";
    }
  };

  const filteredEvents = securityEvents.filter((event) => {
    if (filter === "all") return true;
    if (filter === "suspicious") return event.type === "suspicious_activity";
    if (filter === "failed_login") return event.type === "failed_login";
    return true;
  });

  const suspiciousCount = securityEvents.filter(
    (e) => e.type === "suspicious_activity"
  ).length;
  const failedLoginCount = securityEvents.filter(
    (e) => e.type === "failed_login"
  ).length;

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="w-6 h-6 text-emerald-400 mr-2" />
          <h3 className="text-xl font-bold text-white">Security Monitor</h3>
          <div
            className={`ml-3 w-3 h-3 rounded-full ${
              isMonitoring ? "bg-green-400 animate-pulse" : "bg-gray-400"
            }`}
          ></div>
        </div>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isMonitoring
              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              : "bg-gray-600 text-gray-300 hover:bg-gray-500"
          }`}
        >
          {isMonitoring ? "Monitoring Active" : "Start Monitoring"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {securityEvents.length}
          </div>
          <div className="text-gray-400 text-sm">Total Events</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {suspiciousCount}
          </div>
          <div className="text-gray-400 text-sm">Suspicious</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {failedLoginCount}
          </div>
          <div className="text-gray-400 text-sm">Failed Logins</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: "all", label: "All Events" },
          { key: "suspicious", label: "Suspicious" },
          { key: "failed_login", label: "Failed Logins" },
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterOption.key
                ? "bg-emerald-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Eye className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No security events to display</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-4 ${getEventColor(event.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{getEventIcon(event.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-medium capitalize">
                        {event.type.replace("_", " ")}
                      </span>
                      {event.userId && (
                        <span className="text-gray-400 text-sm">
                          User: {event.userId.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                    {event.details && (
                      <div className="text-gray-300 text-sm">
                        {typeof event.details === "object"
                          ? JSON.stringify(event.details, null, 2)
                          : event.details}
                      </div>
                    )}
                    {event.ip && (
                      <div className="text-gray-400 text-xs mt-1">
                        IP: {event.ip}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-gray-400 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {format(new Date(event.timestamp), "MMM dd, HH:mm:ss")}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Real-time Status */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-400">
            <Activity className="w-4 h-4 mr-2" />
            Last updated: {format(new Date(), "HH:mm:ss")}
          </div>
          <div className="text-emerald-400">System Status: Secure</div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitor;
