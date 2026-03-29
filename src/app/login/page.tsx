"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserProvider, useUser } from "@/context/UserContext";

function LoginContent() {
    const {
        loginWithGoogle,
        sendOTP,
        verifyOTP,
        isAuthenticated,
        loading,
        phoneError,
        phoneLoading,
        otpSent,
        setOtpSent,
        setPhoneError,
    } = useUser();
    const router = useRouter();

    const [authMode, setAuthMode] = useState<"google" | "phone">("google");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    const handleSendOTP = async () => {
        const cleaned = phoneNumber.replace(/\s/g, "");
        const fullNumber = cleaned.startsWith("+") ? cleaned : `+91${cleaned}`;
        if (fullNumber.length < 10) {
            setPhoneError("Please enter a valid phone number.");
            return;
        }
        await sendOTP(fullNumber);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, "").slice(0, 6).split("");
            const newOtp = [...otp];
            digits.forEach((d, i) => {
                if (index + i < 6) newOtp[index + i] = d;
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + digits.length, 5);
            otpRefs.current[nextIndex]?.focus();
            return;
        }
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            setPhoneError("Please enter the full 6-digit OTP.");
            return;
        }
        await verifyOTP(code);
    };

    const handleBackToPhone = () => {
        setOtpSent(false);
        setOtp(["", "", "", "", "", ""]);
        setPhoneError("");
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "14px 16px",
        borderRadius: 12,
        border: "1px solid rgba(99, 102, 241, 0.2)",
        background: "rgba(255, 255, 255, 0.04)",
        color: "#f1f5f9",
        fontSize: "1rem",
        fontWeight: 500,
        outline: "none",
        transition: "all 0.3s",
        letterSpacing: "0.5px",
    };

    const primaryBtnStyle: React.CSSProperties = {
        width: "100%",
        padding: "15px 24px",
        borderRadius: 14,
        border: "none",
        background: "linear-gradient(135deg, #6366f1, #a855f7)",
        color: "white",
        fontSize: "0.95rem",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.3s ease",
        letterSpacing: "0.3px",
        boxShadow: "0 4px 20px rgba(99, 102, 241, 0.25)",
    };

    const disabledBtnStyle: React.CSSProperties = {
        ...primaryBtnStyle,
        opacity: 0.5,
        cursor: "not-allowed",
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
            <div className="bg-orb" style={{ width: 500, height: 500, background: "#6366f1", top: -200, right: -200 }} />
            <div className="bg-orb" style={{ width: 400, height: 400, background: "#a855f7", bottom: -150, left: -150 }} />
            <div className="bg-orb" style={{ width: 300, height: 300, background: "#22d3ee", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.08 }} />

            {/* Invisible reCAPTCHA container */}
            <div id="recaptcha-container"></div>

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
                    Welcome to <span className="gradient-text-animated">LaunchPad</span>
                </h1>
                <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 8 }}>
                    AI Developer · Digital Creator · Tech Builder
                </p>
                <p style={{ color: "#475569", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: 32, maxWidth: 340, margin: "0 auto 32px" }}>
                    Sign in to explore AI tools, read premium articles, and access exclusive digital products.
                </p>

                {/* Auth Mode Toggle */}
                <div
                    style={{
                        display: "flex",
                        borderRadius: 12,
                        border: "1px solid rgba(99, 102, 241, 0.12)",
                        background: "rgba(255, 255, 255, 0.02)",
                        padding: 4,
                        marginBottom: 24,
                        gap: 4,
                    }}
                >
                    {[
                        { key: "google" as const, label: "Google", icon: "🌐" },
                        { key: "phone" as const, label: "Phone OTP", icon: "📱" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setAuthMode(tab.key);
                                setPhoneError("");
                                setOtp(["", "", "", "", "", ""]);
                            }}
                            style={{
                                flex: 1,
                                padding: "10px 16px",
                                borderRadius: 9,
                                border: "none",
                                background: authMode === tab.key
                                    ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))"
                                    : "transparent",
                                color: authMode === tab.key ? "#e2e8f0" : "#64748b",
                                fontSize: "0.82rem",
                                fontWeight: authMode === tab.key ? 700 : 500,
                                cursor: "pointer",
                                transition: "all 0.3s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                boxShadow: authMode === tab.key ? "0 2px 12px rgba(99, 102, 241, 0.1)" : "none",
                            }}
                        >
                            <span style={{ fontSize: "0.9rem" }}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ===== GOOGLE AUTH ===== */}
                {authMode === "google" && (
                    <>
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
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            Continue with Google
                        </button>
                    </>
                )}

                {/* ===== PHONE AUTH ===== */}
                {authMode === "phone" && (
                    <>
                        {!otpSent ? (
                            /* Step 1: Phone Number Input */
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div style={{ textAlign: "left" }}>
                                    <label style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600, marginBottom: 6, display: "block" }}>
                                        Phone Number
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <span style={{
                                            position: "absolute",
                                            left: 16,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#a855f7",
                                            fontSize: "0.9rem",
                                            fontWeight: 600,
                                        }}>
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            placeholder="Enter 10-digit number"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                setPhoneNumber(val);
                                                setPhoneError("");
                                            }}
                                            style={{ ...inputStyle, paddingLeft: 52 }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
                                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(168, 85, 247, 0.08)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.2)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSendOTP}
                                    disabled={phoneLoading || phoneNumber.length < 10}
                                    style={phoneLoading || phoneNumber.length < 10 ? disabledBtnStyle : primaryBtnStyle}
                                    onMouseEnter={(e) => {
                                        if (!phoneLoading && phoneNumber.length >= 10)
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    {phoneLoading ? (
                                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                            <span style={{
                                                width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                                                borderTopColor: "white", borderRadius: "50%",
                                                animation: "spin 0.8s linear infinite", display: "inline-block",
                                            }} />
                                            Sending OTP...
                                        </span>
                                    ) : (
                                        "Send OTP →"
                                    )}
                                </button>
                            </div>
                        ) : (
                            /* Step 2: OTP Verification */
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <p style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.5 }}>
                                    OTP sent to <span style={{ color: "#a855f7", fontWeight: 600 }}>+91{phoneNumber}</span>
                                </p>

                                <div style={{ textAlign: "left" }}>
                                    <label style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600, marginBottom: 8, display: "block" }}>
                                        Enter 6-digit OTP
                                    </label>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                ref={(el) => { otpRefs.current[i] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                onPaste={(e) => {
                                                    e.preventDefault();
                                                    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, 6);
                                                    handleOtpChange(0, pasted);
                                                }}
                                                style={{
                                                    width: 48,
                                                    height: 56,
                                                    textAlign: "center",
                                                    fontSize: "1.3rem",
                                                    fontWeight: 700,
                                                    borderRadius: 12,
                                                    border: digit
                                                        ? "1px solid rgba(168, 85, 247, 0.5)"
                                                        : "1px solid rgba(99, 102, 241, 0.2)",
                                                    background: digit
                                                        ? "rgba(168, 85, 247, 0.06)"
                                                        : "rgba(255, 255, 255, 0.04)",
                                                    color: "#f1f5f9",
                                                    outline: "none",
                                                    transition: "all 0.2s",
                                                    caretColor: "#a855f7",
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.7)";
                                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(168, 85, 247, 0.1)";
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = digit
                                                        ? "rgba(168, 85, 247, 0.5)"
                                                        : "rgba(99, 102, 241, 0.2)";
                                                    e.currentTarget.style.boxShadow = "none";
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleVerifyOTP}
                                    disabled={phoneLoading || otp.join("").length !== 6}
                                    style={phoneLoading || otp.join("").length !== 6 ? disabledBtnStyle : primaryBtnStyle}
                                    onMouseEnter={(e) => {
                                        if (!phoneLoading && otp.join("").length === 6)
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    {phoneLoading ? (
                                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                            <span style={{
                                                width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                                                borderTopColor: "white", borderRadius: "50%",
                                                animation: "spin 0.8s linear infinite", display: "inline-block",
                                            }} />
                                            Verifying...
                                        </span>
                                    ) : (
                                        "Verify OTP ✓"
                                    )}
                                </button>

                                {/* Resend & Back */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                                    <button
                                        onClick={handleBackToPhone}
                                        style={{ background: "none", border: "none", color: "#64748b", fontSize: "0.78rem", cursor: "pointer", padding: 0 }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "#a855f7")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                                    >
                                        ← Change Number
                                    </button>
                                    <button
                                        onClick={handleSendOTP}
                                        disabled={phoneLoading}
                                        style={{ background: "none", border: "none", color: "#64748b", fontSize: "0.78rem", cursor: phoneLoading ? "not-allowed" : "pointer", padding: 0, opacity: phoneLoading ? 0.5 : 1 }}
                                        onMouseEnter={(e) => { if (!phoneLoading) e.currentTarget.style.color = "#a855f7"; }}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error message */}
                        {phoneError && (
                            <div style={{
                                marginTop: 14,
                                padding: "10px 14px",
                                borderRadius: 10,
                                background: "rgba(239, 68, 68, 0.08)",
                                border: "1px solid rgba(239, 68, 68, 0.15)",
                                color: "#f87171",
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                textAlign: "left",
                            }}>
                                ⚠️ {phoneError}
                            </div>
                        )}
                    </>
                )}

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0 20px" }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(99, 102, 241, 0.1)" }} />
                    <span style={{ fontSize: "0.75rem", color: "#475569" }}>
                        {authMode === "google" ? "secure login via Google" : "OTP will be sent via SMS"}
                    </span>
                    <div style={{ flex: 1, height: 1, background: "rgba(99, 102, 241, 0.1)" }} />
                </div>

                {/* Trust badges */}
                <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
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

            {/* Spinner animation */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
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
