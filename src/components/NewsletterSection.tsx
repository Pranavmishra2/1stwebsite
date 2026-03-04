"use client";
import { useState } from "react";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail("");
        }
    };

    return (
        <section style={{ padding: "80px 0" }}>
            <div className="container-custom">
                <div
                    className="glass-card"
                    style={{
                        padding: "clamp(32px, 5vw, 60px)",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08))",
                        border: "1px solid rgba(99, 102, 241, 0.12)",
                    }}
                >
                    {/* Decorative orbs */}
                    <div
                        className="bg-orb"
                        style={{ width: 200, height: 200, background: "#6366f1", top: -80, right: -80, opacity: 0.2 }}
                    />
                    <div
                        className="bg-orb"
                        style={{ width: 150, height: 150, background: "#a855f7", bottom: -60, left: -60, opacity: 0.2 }}
                    />

                    <div style={{ position: "relative", zIndex: 2 }}>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "6px 16px",
                                borderRadius: 50,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                background: "rgba(168, 85, 247, 0.1)",
                                color: "#c084fc",
                                border: "1px solid rgba(168, 85, 247, 0.2)",
                                marginBottom: 20,
                            }}
                        >
                            ✉️ Newsletter
                        </span>

                        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, marginBottom: 12 }}>
                            Get <span className="gradient-text">Weekly AI Insights</span>
                        </h2>
                        <p style={{ color: "#64748b", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
                            Join 1,000+ developers and creators getting actionable AI tips, tool recommendations, and tech insights every week.
                        </p>

                        {submitted ? (
                            <div
                                style={{
                                    padding: "16px 32px",
                                    borderRadius: 12,
                                    background: "rgba(34, 197, 94, 0.1)",
                                    border: "1px solid rgba(34, 197, 94, 0.3)",
                                    color: "#4ade80",
                                    fontWeight: 600,
                                    display: "inline-block",
                                }}
                            >
                                🎉 You&apos;re in! Check your inbox.
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                style={{
                                    display: "flex",
                                    gap: 12,
                                    maxWidth: 460,
                                    margin: "0 auto",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                }}
                            >
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        flex: "1 1 250px",
                                        padding: "14px 20px",
                                        borderRadius: 12,
                                        border: "1px solid rgba(99, 102, 241, 0.2)",
                                        background: "rgba(15, 15, 20, 0.6)",
                                        color: "#f1f5f9",
                                        fontSize: "0.95rem",
                                        outline: "none",
                                        backdropFilter: "blur(10px)",
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="gradient-btn"
                                    style={{ padding: "14px 32px", flexShrink: 0 }}
                                >
                                    Subscribe
                                </button>
                            </form>
                        )}

                        <p style={{ fontSize: "0.72rem", color: "#475569", marginTop: 16 }}>
                            No spam, unsubscribe anytime. We respect your inbox.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
