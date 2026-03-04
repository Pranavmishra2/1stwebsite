"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProvider, useUser } from "@/context/UserContext";

function LoginContent() {
    const { loginWithGoogle, isAuthenticated, loading } = useUser();
    const router = useRouter();

    // Redirect to home if already logged in
    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push("/");
        }
    }, [loading, isAuthenticated, router]);

    if (loading || isAuthenticated) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f14" }}>
                <div className="gradient-text" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Loading...</div>
            </div>
        );
    }

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
            <div className="bg-orb" style={{ width: 500, height: 500, background: "#6366f1", top: -200, right: -200 }} />
            <div className="bg-orb" style={{ width: 400, height: 400, background: "#a855f7", bottom: -150, left: -150 }} />
            <div className="bg-orb" style={{ width: 300, height: 300, background: "#22d3ee", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.08 }} />

            <div
                className="glass-card"
                style={{
                    padding: "clamp(36px, 6vw, 56px)",
                    width: "100%",
                    maxWidth: 460,
                    position: "relative",
                    zIndex: 2,
                    textAlign: "center",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: 20,
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "1.6rem",
                        color: "white",
                        margin: "0 auto 24px",
                        boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                    }}
                >
                    PK
                </div>

                <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 8 }}>
                    Welcome to <span className="gradient-text-animated">Pranav Kashyap</span>
                </h1>
                <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 8 }}>
                    AI Developer · Digital Creator · Tech Builder
                </p>
                <p style={{ color: "#475569", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: 36, maxWidth: 340, margin: "0 auto 36px" }}>
                    Sign in to explore AI tools, read premium articles, and access exclusive digital products.
                </p>

                {/* Google Sign In Button */}
                <button
                    onClick={loginWithGoogle}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        padding: "16px 24px",
                        borderRadius: 14,
                        border: "1px solid rgba(99, 102, 241, 0.2)",
                        background: "rgba(255, 255, 255, 0.03)",
                        color: "#f1f5f9",
                        fontSize: "1rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        marginBottom: 16,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                        e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.4)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(99, 102, 241, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                        e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.2)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    {/* Google Icon */}
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "20px 0" }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(99, 102, 241, 0.1)" }} />
                    <span style={{ fontSize: "0.75rem", color: "#475569" }}>or</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(99, 102, 241, 0.1)" }} />
                </div>

                {/* Guest hint */}
                <p style={{ color: "#475569", fontSize: "0.78rem", lineHeight: 1.5 }}>
                    Sign in with your Google account to get full access to all products, articles, and tools.
                </p>

                {/* Trust badges */}
                <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 28 }}>
                    {[
                        { icon: "🔒", label: "Secure" },
                        { icon: "⚡", label: "Instant" },
                        { icon: "🛡️", label: "Private" },
                    ].map((badge) => (
                        <div key={badge.label} style={{ textAlign: "center" }}>
                            <span style={{ fontSize: "1.2rem" }}>{badge.icon}</span>
                            <p style={{ fontSize: "0.7rem", color: "#475569", marginTop: 4 }}>{badge.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <UserProvider>
            <LoginContent />
        </UserProvider>
    );
}
