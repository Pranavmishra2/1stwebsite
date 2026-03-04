"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminProvider, useAdmin } from "@/context/AdminContext";

function LoginForm() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, loginAttempts, isLocked } = useAdmin();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked || loading) return;

        setLoading(true);
        setError("");

        // Random delay between 500ms-1500ms to prevent timing attacks
        const delay = 500 + Math.random() * 1000;

        setTimeout(() => {
            const result = login(password);
            if (result.success) {
                router.push("/admin");
            } else {
                setError(result.error || "Invalid password.");
                setPassword("");
                setLoading(false);
            }
        }, delay);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0f0f14",
                padding: 24,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background effects */}
            <div className="bg-orb" style={{ width: 400, height: 400, background: "#6366f1", top: -150, right: -150 }} />
            <div className="bg-orb" style={{ width: 300, height: 300, background: "#a855f7", bottom: -100, left: -100 }} />

            <div
                className="glass-card"
                style={{
                    padding: "clamp(32px, 5vw, 48px)",
                    width: "100%",
                    maxWidth: 420,
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #6366f1, #a855f7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "1.3rem",
                            color: "white",
                            margin: "0 auto 16px",
                        }}
                    >
                        PK
                    </div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 6 }}>
                        Admin <span className="gradient-text">Panel</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                        Restricted access. Authorized personnel only.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: "#94a3b8",
                                marginBottom: 8,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}
                        >
                            🔒 Admin Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            required
                            disabled={isLocked}
                            autoComplete="off"
                            maxLength={64}
                            style={{
                                width: "100%",
                                padding: "14px 18px",
                                borderRadius: 12,
                                border: `1px solid ${isLocked ? "rgba(239, 68, 68, 0.3)" : "rgba(99, 102, 241, 0.2)"}`,
                                background: isLocked ? "rgba(239, 68, 68, 0.05)" : "rgba(15, 15, 20, 0.6)",
                                color: "#f1f5f9",
                                fontSize: "0.95rem",
                                outline: "none",
                                transition: "border-color 0.3s",
                                opacity: isLocked ? 0.5 : 1,
                            }}
                            onFocus={(e) => !isLocked && (e.target.style.borderColor = "rgba(99, 102, 241, 0.5)")}
                            onBlur={(e) => !isLocked && (e.target.style.borderColor = "rgba(99, 102, 241, 0.2)")}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                padding: "12px 16px",
                                borderRadius: 10,
                                background: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                color: "#f87171",
                                fontSize: "0.85rem",
                                marginBottom: 20,
                                textAlign: "center",
                            }}
                        >
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Attempts indicator */}
                    {loginAttempts > 0 && !isLocked && (
                        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 16 }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: i < loginAttempts ? "#f87171" : "rgba(99, 102, 241, 0.15)",
                                        transition: "background 0.3s",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="gradient-btn"
                        disabled={loading || isLocked}
                        style={{
                            width: "100%",
                            padding: 16,
                            fontSize: "0.95rem",
                            opacity: loading || isLocked ? 0.5 : 1,
                            cursor: loading || isLocked ? "not-allowed" : "pointer",
                        }}
                    >
                        {isLocked ? "🔒 Account Locked" : loading ? "Authenticating..." : "Access Dashboard →"}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#475569", marginTop: 20 }}>
                    This is a private admin area. All access is monitored.
                </p>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <AdminProvider>
            <LoginForm />
        </AdminProvider>
    );
}
