"use client";
import { AdminProvider, AdminGuard, useAdmin } from "@/context/AdminContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
    { href: "/admin/blogs", label: "Blog Posts", icon: "📝" },
    { href: "/admin/products", label: "Products", icon: "📦" },
    { href: "/admin/orders", label: "Orders", icon: "💰" },
    { href: "/admin/categories", label: "Categories", icon: "🗂️" },
    { href: "/admin/newsletter", label: "Newsletter", icon: "📧" },
    { href: "/admin/coupons", label: "Coupons", icon: "🏷️" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAdmin();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/admin/login");
    };

    return (
        <aside
            style={{
                width: 260,
                minHeight: "100vh",
                background: "rgba(22, 22, 29, 0.8)",
                borderRight: "1px solid rgba(99, 102, 241, 0.1)",
                padding: "24px 0",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 50,
            }}
        >
            {/* Logo */}
            <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                            fontSize: "0.9rem",
                            color: "white",
                        }}
                    >
                        PK
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f1f5f9" }}>Admin Panel</p>
                        <p style={{ fontSize: "0.7rem", color: "#64748b" }}>Pranav Kashyap</p>
                    </div>
                </div>
            </div>

            {/* Nav links */}
            <nav style={{ padding: "16px 12px", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 16px",
                                    borderRadius: 10,
                                    fontSize: "0.9rem",
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? "#f1f5f9" : "#64748b",
                                    background: isActive ? "rgba(99, 102, 241, 0.1)" : "transparent",
                                    border: isActive ? "1px solid rgba(99, 102, 241, 0.15)" : "1px solid transparent",
                                    transition: "all 0.2s",
                                }}
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom actions */}
            <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(99,102,241,0.08)" }}>
                <Link
                    href="/"
                    style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 16px",
                        fontSize: "0.85rem",
                        color: "#64748b",
                        borderRadius: 8,
                        marginBottom: 4,
                    }}
                >
                    🌐 View Website
                </Link>
                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 16px",
                        fontSize: "0.85rem",
                        color: "#f87171",
                        background: "rgba(239, 68, 68, 0.06)",
                        border: "1px solid rgba(239, 68, 68, 0.1)",
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                >
                    🚪 Logout
                </button>
            </div>
        </aside>
    );
}

function AdminLayoutContent({ children }: { children: ReactNode }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f14" }}>
            <AdminSidebar />
            <main style={{ flex: 1, marginLeft: 260, padding: "32px 40px", minHeight: "100vh" }}>
                {children}
            </main>

            <style jsx global>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
          main { margin-left: 0 !important; padding: 20px !important; }
        }
      `}</style>
        </div>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AdminProvider>
            <AdminGuard>
                <AdminLayoutContent>{children}</AdminLayoutContent>
            </AdminGuard>
        </AdminProvider>
    );
}
