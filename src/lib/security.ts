// security.ts
import CryptoJS from "crypto-js";
import DOMPurify from "dompurify";
// NOTE: In production, do MFA (speakeasy) on the server.
// If you must keep it here (bundlers allow), we guard usage:
let _speakeasy: typeof import("speakeasy") | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  _speakeasy = require("speakeasy");
} catch {
  _speakeasy = null;
}

type LogEvent =
  | "login"
  | "failed_login"
  | "mfa_enabled"
  | "mfa_disabled"
  | "suspicious_activity";

type SecurityEvent = {
  type: LogEvent;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details?: any;
};

type MFASecret = {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
};

const REQUIRED_ITERATIONS = 100_000; // PBKDF2 iterations
const KEY_SIZE_BITS = 256; // AES-256
const IV_BYTES = 16; // AES block size
const SALT_BYTES = 16;

const BASE64URL = {
  encode(bytes: Uint8Array) {
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  },
  decode(str: string) {
    const pad = str.length % 4 ? 4 - (str.length % 4) : 0;
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  },
};

function getStrongRandomBytes(len: number): Uint8Array {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint8Array(len);
    crypto.getRandomValues(buf);
    return buf;
  }
  // Fallback (not ideal, but keeps app functional)
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 256);
  return arr;
}

function ensureEnvKey(): string {
  const key = process.env.REACT_APP_ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "Missing REACT_APP_ENCRYPTION_KEY. Refusing to run with a default key."
    );
  }
  return key;
}

export class SecurityUtils {
  // ---- AES-256-CBC with PBKDF2 (salted) + random IV ----
  static encrypt(plainText: string): string {
    try {
      const master = ensureEnvKey();

      const salt = CryptoJS.lib.WordArray.random(SALT_BYTES);
      const iv = CryptoJS.lib.WordArray.random(IV_BYTES);

      const key = CryptoJS.PBKDF2(master, salt, {
        keySize: KEY_SIZE_BITS / 32,
        iterations: REQUIRED_ITERATIONS,
      });

      const cipher = CryptoJS.AES.encrypt(plainText, key, { iv });

      // Pack as JSON for self-describing payloads
      const payload = {
        v: 1,
        alg: "AES-256-CBC",
        ks: KEY_SIZE_BITS,
        it: REQUIRED_ITERATIONS,
        salt: CryptoJS.enc.Hex.stringify(salt),
        iv: CryptoJS.enc.Hex.stringify(iv),
        ct: cipher.toString(), // base64
      };

      return btoa(JSON.stringify(payload));
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  static decrypt(encoded: string): string {
    try {
      const master = ensureEnvKey();
      const json = JSON.parse(atob(encoded));

      if (!json || json.v !== 1 || !json.salt || !json.iv || !json.ct) {
        throw new Error("Invalid encrypted payload");
      }

      const salt = CryptoJS.enc.Hex.parse(json.salt);
      const iv = CryptoJS.enc.Hex.parse(json.iv);
      const key = CryptoJS.PBKDF2(master, salt, {
        keySize: (json.ks || KEY_SIZE_BITS) / 32,
        iterations: json.it || REQUIRED_ITERATIONS,
      });

      const bytes = CryptoJS.AES.decrypt(json.ct, key, { iv });
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) throw new Error("Bad decrypt");
      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Failed to decrypt data");
    }
  }

  // ---- XSS Sanitization ----
  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li"],
      ALLOWED_ATTR: [],
    });
  }

  // ---- Secure Token ----
  static generateSecureToken(length = 32): string {
    // URL-safe base64 token from strong RNG
    const bytes = getStrongRandomBytes(length);
    return BASE64URL.encode(bytes);
  }

  // ---- Email Validation ----
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ---- Password Strength ----
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    if (password.length < 12) {
      errors.push("Password must be at least 12 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    return { isValid: errors.length === 0, errors };
  }

  // ---- MFA (prefer server-side) ----
  static generateMFASecret(userEmail: string): MFASecret {
    if (!_speakeasy) {
      // Frontend fallback: generate label only, do the rest on server
      throw new Error(
        "MFA generation must be done on the server for security and compatibility."
      );
    }

    const secret = _speakeasy.generateSecret({
      name: `Sovereign Assets (${userEmail})`,
      issuer: "Sovereign Assets Capital",
      length: 32,
    });

    // Generate one-time backup codes (store hashed on server)
    const backupCodes = Array.from({ length: 10 }, () =>
      SecurityUtils.generateSecureToken(8).toUpperCase()
    );

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url || "",
      backupCodes,
    };
  }

  static verifyMFAToken(token: string, secretBase32: string): boolean {
    if (!_speakeasy) {
      throw new Error("MFA verification must be done on the server.");
    }
    try {
      return _speakeasy.totp.verify({
        secret: secretBase32,
        encoding: "base32",
        token,
        window: 2,
      });
    } catch (error) {
      console.error("MFA verification error:", error);
      return false;
    }
  }

  // ---- Security Event Logging (server-first; minimal local fallback) ----
  static async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const logEntry = {
      ...event,
      timestamp: new Date().toISOString(),
      id: SecurityUtils.generateSecureToken(16),
      userAgent:
        event.userAgent ||
        (typeof navigator !== "undefined" ? navigator.userAgent : undefined),
    };

    try {
      // Prefer Beacon for reliability on unload
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([JSON.stringify(logEntry)], {
          type: "application/json",
        });
        const ok = (navigator as any).sendBeacon?.("/api/security/logs", blob);
        if (ok) return;
      }

      // Fallback to fetch
      await fetch("/api/security/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(logEntry),
      });
    } catch (e) {
      // Minimal local buffer as last resort (non-authoritative)
      if (typeof window !== "undefined") {
        const buf = JSON.parse(
          localStorage.getItem("security_logs_buf") || "[]"
        );
        buf.push(logEntry);
        if (buf.length > 100) buf.splice(0, buf.length - 100);
        localStorage.setItem("security_logs_buf", JSON.stringify(buf));
      }
    }
  }

  // ---- Suspicious Activity (client hint; real check must be server-side) ----
  static async detectSuspiciousActivity(
    userId: string,
    activity: string
  ): Promise<boolean> {
    try {
      const res = await fetch("/api/security/rate-limit/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, activity }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.suspicious) {
          await SecurityUtils.logSecurityEvent({
            type: "suspicious_activity",
            userId,
            details: { activity, serverFlag: true },
          });
          return true;
        }
        return false;
      }
    } catch {
      // Fallback: soft client-side rate limit using sessionStorage (clears on tab close)
      const key = `act_${userId}_${activity}`;
      const now = Date.now();
      const windowMs = 5 * 60 * 1000;
      const maxAttempts = 10;

      if (typeof window !== "undefined") {
        const attempts: number[] = JSON.parse(
          sessionStorage.getItem(key) || "[]"
        ).filter((t: number) => now - t < windowMs);
        if (attempts.length >= maxAttempts) {
          SecurityUtils.logSecurityEvent({
            type: "suspicious_activity",
            userId,
            details: { activity, attempts: attempts.length, clientFlag: true },
          });
          return true;
        }
        attempts.push(now);
        sessionStorage.setItem(key, JSON.stringify(attempts));
      }
    }
    return false;
  }
}

// ---------------- CSRF ----------------

export class CSRFProtection {
  private static tokens = new Map<string, number>(); // in-memory (per tab)
  private static TTL_MS = 60 * 60 * 1000; // 1 hour

  static generateToken(): string {
    // Strong random token (base64url)
    const token = BASE64URL.encode(getStrongRandomBytes(32));
    const now = Date.now();
    this.tokens.set(token, now);

    // Also mirror in sessionStorage so reloads keep the token (optional)
    if (typeof window !== "undefined") {
      const store = JSON.parse(sessionStorage.getItem("csrf_tokens") || "{}");
      store[token] = now;
      sessionStorage.setItem("csrf_tokens", JSON.stringify(store));
    }
    return token;
  }

  static validateToken(token: string): boolean {
    const now = Date.now();
    let timestamp = this.tokens.get(token);

    // Try to recover from sessionStorage (page reload)
    if (!timestamp && typeof window !== "undefined") {
      const store = JSON.parse(sessionStorage.getItem("csrf_tokens") || "{}");
      timestamp = store[token];
      if (timestamp) this.tokens.set(token, timestamp);
    }

    if (!timestamp) return false;

    const isValid = now - timestamp < this.TTL_MS;
    if (!isValid) this.revokeToken(token);
    return isValid;
  }

  static revokeToken(token: string): void {
    this.tokens.delete(token);
    if (typeof window !== "undefined") {
      const store = JSON.parse(sessionStorage.getItem("csrf_tokens") || "{}");
      delete store[token];
      sessionStorage.setItem("csrf_tokens", JSON.stringify(store));
    }
  }

  static cleanExpiredTokens(): void {
    const now = Date.now();
    for (const [token, ts] of this.tokens.entries()) {
      if (now - ts >= this.TTL_MS) this.tokens.delete(token);
    }
    if (typeof window !== "undefined") {
      const store = JSON.parse(sessionStorage.getItem("csrf_tokens") || "{}");
      for (const [token, ts] of Object.entries<number>(store)) {
        if (now - ts >= this.TTL_MS) delete store[token];
      }
      sessionStorage.setItem("csrf_tokens", JSON.stringify(store));
    }
  }

  // Helper to attach header to fetch requests
  static attachToRequest(init: RequestInit = {}, token?: string): RequestInit {
    const t = token || CSRFProtection.generateToken();
    return {
      ...init,
      headers: { ...(init.headers || {}), "X-CSRF-Token": t },
    };
  }
}
