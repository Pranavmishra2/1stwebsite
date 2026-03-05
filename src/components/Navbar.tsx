"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/store", label: "Store" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useUser();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [pathname]);

    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: scrolled ? "12px 0" : "20px 0",
                background: scrolled ? "rgba(15, 15, 20, 0.85)" : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(99, 102, 241, 0.1)" : "none",
                transition: "all 0.3s ease",
            }}
        >
            <div className="container-custom" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* Logo */}
                <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", fontSize: "1.25rem", fontWeight: "bold", color: "white", letterSpacing: "-0.025em" }}>
                    <Image src="/logo.png" alt="LaunchPad" width={32} height={32} style={{ borderRadius: 8, boxShadow: "0 4px 14px 0 rgba(168, 85, 247, 0.39)" }} />
                    Launch<span style={{ color: "#a855f7" }}>Pad</span>
                </Link>

                {/* Desktop Links */}
                <div style={{ display: "flex", alignItems: "center", gap: "28px" }} className="desktop-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                textDecoration: "none",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                                color: pathname === link.href ? "#a855f7" : "#94a3b8",
                                transition: "color 0.3s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#a855f7")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = pathname === link.href ? "#a855f7" : "#94a3b8")}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/store" className="gradient-btn" style={{ padding: "8px 22px", fontSize: "0.85rem" }}>
                        Explore Products
                    </Link>

                    {/* User profile button */}
                    {user && (
                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "6px 12px 6px 6px",
                                    borderRadius: 50,
                                    border: "1px solid rgba(99, 102, 241, 0.15)",
                                    background: "rgba(99, 102, 241, 0.06)",
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                }}
                            >
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.name} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                                ) : (
                                    <div
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #6366f1, #a855f7)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                            fontSize: "0.7rem",
                                            color: "white",
                                        }}
                                    >
                                        {user.avatar || user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#94a3b8" }}>
                                    {user.name.split(" ")[0]}
                                </span>
                                <span style={{ fontSize: "0.6rem", color: "#64748b", transform: profileOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>▼</span>
                            </button>

                            {/* Dropdown */}
                            {profileOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 8px)",
                                        right: 0,
                                        width: 220,
                                        background: "rgba(22, 22, 29, 0.95)",
                                        backdropFilter: "blur(20px)",
                                        border: "1px solid rgba(99, 102, 241, 0.15)",
                                        borderRadius: 12,
                                        padding: 8,
                                        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                                    }}
                                >
                                    <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(99,102,241,0.08)", marginBottom: 4 }}>
                                        <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#f1f5f9" }}>{user.name}</p>
                                        <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 2 }}>{user.email}</p>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "10px 14px",
                                            borderRadius: 8,
                                            border: "none",
                                            background: "transparent",
                                            color: "#e2e8f0",
                                            fontSize: "0.82rem",
                                            fontWeight: 500,
                                            textDecoration: "none",
                                            transition: "background 0.2s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        🛍️ My Purchases
                                    </Link>
                                    <button
                                        onClick={logout}
                                        style={{
                                            width: "100%",
                                            padding: "10px 14px",
                                            borderRadius: 8,
                                            border: "none",
                                            background: "rgba(239, 68, 68, 0.06)",
                                            color: "#f87171",
                                            fontSize: "0.82rem",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            textAlign: "left",
                                            transition: "background 0.2s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
                                    >
                                        🚪 Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="mobile-nav-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
                    aria-label="Toggle menu"
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: mobileOpen ? 0 : 5, transition: "all 0.3s" }}>
                        <span style={{ display: "block", width: 24, height: 2, background: "#f1f5f9", borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translateY(1px)" : "none" }} />
                        {!mobileOpen && <span style={{ display: "block", width: 24, height: 2, background: "#f1f5f9", borderRadius: 2 }} />}
                        <span style={{ display: "block", width: 24, height: 2, background: "#f1f5f9", borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translateY(-1px)" : "none" }} />
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "rgba(15, 15, 20, 0.95)",
                        backdropFilter: "blur(20px)",
                        borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
                        padding: "20px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    {/* User info in mobile */}
                    {user && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                            ) : (
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: "0.8rem",
                                        color: "white",
                                    }}
                                >
                                    {user.avatar || user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#f1f5f9" }}>{user.name}</p>
                                <p style={{ fontSize: "0.7rem", color: "#64748b" }}>{user.email}</p>
                            </div>
                        </div>
                    )}

                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                textDecoration: "none",
                                fontSize: "1rem",
                                fontWeight: 500,
                                color: pathname === link.href ? "#a855f7" : "#94a3b8",
                                padding: "8px 0",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <Link href="/store" className="gradient-btn" style={{ textAlign: "center", marginTop: 8 }}>
                        Explore Products
                    </Link>

                    {user && (
                        <>
                            <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />
                            <Link
                                href="/dashboard"
                                style={{
                                    textDecoration: "none",
                                    fontSize: "1rem",
                                    fontWeight: 500,
                                    color: pathname === "/dashboard" ? "#a855f7" : "#94a3b8",
                                    padding: "8px 0",
                                }}
                            >
                                🛍️ My Purchases
                            </Link>
                        </>
                    )}

                    {user && (
                        <button
                            onClick={logout}
                            style={{
                                padding: "10px 0",
                                border: "none",
                                background: "none",
                                color: "#f87171",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                textAlign: "left",
                            }}
                        >
                            🚪 Sign Out
                        </button>
                    )}
                </div>
            )}

            <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: flex !important; }
        }
      `}</style>
        </nav>
    );
}
