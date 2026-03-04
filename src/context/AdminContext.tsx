"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AdminContextType {
    isAuthenticated: boolean;
    login: (password: string) => { success: boolean; error?: string };
    logout: () => void;
    loginAttempts: number;
    isLocked: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Simple hash function for client-side password comparison
function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
}

// Generate a session token
function generateSessionToken(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `admin_${timestamp}_${random}`;
}

// Validate session token format
function isValidToken(token: string | null): boolean {
    if (!token) return false;
    return token.startsWith("admin_") && token.length > 20;
}

export function AdminProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        // Check session validity
        const token = localStorage.getItem("admin_session");
        const sessionExpiry = localStorage.getItem("admin_session_expiry");

        if (isValidToken(token) && sessionExpiry) {
            const expiry = parseInt(sessionExpiry, 10);
            if (Date.now() < expiry) {
                setIsAuthenticated(true);
            } else {
                // Session expired — clean up
                localStorage.removeItem("admin_session");
                localStorage.removeItem("admin_session_expiry");
            }
        }

        // Check lockout
        const lockoutUntil = localStorage.getItem("admin_lockout");
        if (lockoutUntil && Date.now() < parseInt(lockoutUntil, 10)) {
            setIsLocked(true);
            const remaining = parseInt(lockoutUntil, 10) - Date.now();
            setTimeout(() => {
                setIsLocked(false);
                localStorage.removeItem("admin_lockout");
                localStorage.removeItem("admin_attempts");
            }, remaining);
        }

        // Restore attempt count
        const savedAttempts = parseInt(localStorage.getItem("admin_attempts") || "0", 10);
        setLoginAttempts(savedAttempts);

        setLoading(false);
    }, []);

    const login = useCallback((password: string): { success: boolean; error?: string } => {
        // Check lockout
        if (isLocked) {
            const lockoutUntil = parseInt(localStorage.getItem("admin_lockout") || "0", 10);
            const remaining = Math.ceil((lockoutUntil - Date.now()) / 60000);
            return { success: false, error: `Account locked. Try again in ${remaining} minute(s).` };
        }

        // Verify password — compare with env or hardcoded fallback
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "pranav@admin2025";
        const isValid = password === adminPassword;

        if (isValid) {
            setIsAuthenticated(true);
            setLoginAttempts(0);
            localStorage.removeItem("admin_attempts");
            localStorage.removeItem("admin_lockout");

            // Set secure session with expiry (8 hours)
            const token = generateSessionToken();
            const expiry = Date.now() + (8 * 60 * 60 * 1000);
            localStorage.setItem("admin_session", token);
            localStorage.setItem("admin_session_expiry", expiry.toString());

            return { success: true };
        }

        // Track failed attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem("admin_attempts", newAttempts.toString());

        // Lock after max attempts
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
            localStorage.setItem("admin_lockout", lockoutUntil.toString());
            setIsLocked(true);
            setTimeout(() => {
                setIsLocked(false);
                setLoginAttempts(0);
                localStorage.removeItem("admin_lockout");
                localStorage.removeItem("admin_attempts");
            }, LOCKOUT_DURATION_MS);
            return { success: false, error: "Too many failed attempts. Account locked for 5 minutes." };
        }

        const remaining = MAX_LOGIN_ATTEMPTS - newAttempts;
        return { success: false, error: `Invalid password. ${remaining} attempt(s) remaining.` };
    }, [isLocked, loginAttempts]);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        localStorage.removeItem("admin_session");
        localStorage.removeItem("admin_session_expiry");
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f14" }}>
                <div className="gradient-text" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Loading...</div>
            </div>
        );
    }

    return (
        <AdminContext.Provider value={{ isAuthenticated, login, logout, loginAttempts, isLocked }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within AdminProvider");
    return context;
}

export function AdminGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAdmin();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/admin/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;
    return <>{children}</>;
}
