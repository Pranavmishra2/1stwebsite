"use client";
import Link from "next/link";

const socialLinks = [
    { label: "Twitter", href: "https://twitter.com/pranavkashyap", icon: "𝕏" },
    { label: "GitHub", href: "https://github.com/pranavkashyap", icon: "⌘" },
    { label: "LinkedIn", href: "https://linkedin.com/in/pranavkashyap", icon: "in" },
    { label: "YouTube", href: "https://youtube.com/@pranavkashyap", icon: "▶" },
];

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Store", href: "/store" },
];

export default function Footer() {
    return (
        <footer
            style={{
                borderTop: "1px solid rgba(99, 102, 241, 0.1)",
                background: "rgba(15, 15, 20, 0.8)",
                padding: "60px 0 30px",
            }}
        >
            <div className="container-custom">
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "40px",
                        marginBottom: "40px",
                    }}
                >
                    {/* Brand */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    fontSize: "1rem",
                                    color: "white",
                                }}
                            >
                                PK
                            </div>
                            <span style={{ fontWeight: 700, fontSize: "1.15rem", color: "#f1f5f9" }}>
                                Pranav <span style={{ color: "#a855f7" }}>Kashyap</span>
                            </span>
                        </div>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 280 }}>
                            AI Developer, Digital Creator & Tech Builder. Building tools and content that empower creators and entrepreneurs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontWeight: 600, fontSize: "0.95rem", color: "#e2e8f0", marginBottom: "16px" }}>Quick Links</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{ textDecoration: "none", color: "#64748b", fontSize: "0.9rem", transition: "color 0.3s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#a855f7")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontWeight: 600, fontSize: "0.95rem", color: "#e2e8f0", marginBottom: "16px" }}>Contact</h4>
                        <a
                            href="mailto:hello@pranavkashyap.com"
                            style={{ color: "#a855f7", textDecoration: "none", fontSize: "0.9rem" }}
                        >
                            hello@pranavkashyap.com
                        </a>
                        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                            {socialLinks.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: 10,
                                        background: "rgba(99, 102, 241, 0.08)",
                                        border: "1px solid rgba(99, 102, 241, 0.15)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#94a3b8",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        transition: "all 0.3s",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)";
                                        e.currentTarget.style.color = "#a5b4fc";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(99, 102, 241, 0.08)";
                                        e.currentTarget.style.color = "#94a3b8";
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        borderTop: "1px solid rgba(99, 102, 241, 0.08)",
                        paddingTop: "24px",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <p style={{ color: "#475569", fontSize: "0.8rem" }}>
                        © {new Date().getFullYear()} Pranav Kashyap. All rights reserved.
                    </p>
                    <p style={{ color: "#475569", fontSize: "0.8rem" }}>
                        Built & Managed by <span style={{ color: "#a855f7" }}>Pranav Kashyap</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
