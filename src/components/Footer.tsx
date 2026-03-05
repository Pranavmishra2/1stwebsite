"use client";
import Link from "next/link";
import Image from "next/image";

const socialLinks = [
    { label: "Twitter", href: "https://twitter.com/pranavkashyap", icon: "𝕏" },
    { label: "Instagram", href: "https://www.instagram.com/launchpadaidev", icon: "📸" },
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
                            <Link
                                href="/"
                                style={{
                                    textDecoration: "none",
                                    fontSize: "1.5rem",
                                    fontWeight: 800,
                                    color: "white",
                                    letterSpacing: "-0.025em",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                }}
                            >
                                <Image src="/logo.png" alt="LaunchPad" width={40} height={40} style={{ borderRadius: 10, boxShadow: "0 4px 14px 0 rgba(168, 85, 247, 0.39)" }} />
                                Launch<span style={{ color: "#a855f7" }}>Pad</span>
                            </Link>

                        </div>

                        <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, marginTop: "16px" }}>
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
                        <p style={{ color: "#94a3b8", lineHeight: 1.6, marginBottom: "16px", fontSize: "0.95rem" }}>
                            Have questions or need support? We&apos;re here to help.
                        </p>
                        <a
                            href="mailto:launchpadaidev@gmail.com"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "#22d3ee",
                                textDecoration: "none",
                                fontWeight: 500,
                                fontSize: "0.95rem"
                            }}
                        >
                            ✉️ launchpadaidev@gmail.com
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
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "8px", width: "100%" }}>
                        <Link href="/privacy-policy" style={{ color: "#64748b", fontSize: "0.85rem", textDecoration: "none" }} className="hover:text-purple-400">Privacy Policy</Link>
                        <Link href="/terms" style={{ color: "#64748b", fontSize: "0.85rem", textDecoration: "none" }} className="hover:text-purple-400">Terms & Conditions</Link>
                        <Link href="/disclaimer" style={{ color: "#64748b", fontSize: "0.85rem", textDecoration: "none" }} className="hover:text-purple-400">Disclaimer</Link>
                        <Link href="/contact" style={{ color: "#64748b", fontSize: "0.85rem", textDecoration: "none" }} className="hover:text-purple-400">Contact Us</Link>
                    </div>

                    <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                        © {new Date().getFullYear()} LaunchPad. Built for Creators.
                    </p>
                    <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0, marginTop: "8px" }}>
                        Built & Managed by <span style={{ color: "#a855f7" }}>LaunchPad Team</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
