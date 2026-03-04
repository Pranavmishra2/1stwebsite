"use client";
import { blogPosts } from "@/data/blogs";
import { products } from "@/data/products";

export default function AdminDashboard() {
    const totalRevenue = products.reduce((sum, p) => sum + p.price, 0) * 12; // Simulated
    const stats = [
        { label: "Total Products", value: products.length, icon: "📦", color: "#6366f1" },
        { label: "Blog Posts", value: blogPosts.length, icon: "📝", color: "#a855f7" },
        { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: "💰", color: "#22d3ee" },
        { label: "Active Users", value: "1,247", icon: "👥", color: "#10b981" },
    ];

    const recentOrders = [
        { id: "#ORD-001", product: "AI Content Engine", buyer: "arjun@gmail.com", amount: "$49", status: "Completed", date: "Mar 3, 2026" },
        { id: "#ORD-002", product: "Smart Automation Kit", buyer: "sarah@gmail.com", amount: "$39", status: "Completed", date: "Mar 2, 2026" },
        { id: "#ORD-003", product: "AI Image Toolkit", buyer: "rahul@outlook.com", amount: "$59", status: "Pending", date: "Mar 2, 2026" },
        { id: "#ORD-004", product: "Prompt Mastery Guide", buyer: "emily@yahoo.com", amount: "$29", status: "Completed", date: "Mar 1, 2026" },
        { id: "#ORD-005", product: "AI Content Engine", buyer: "vikram@gmail.com", amount: "$49", status: "Completed", date: "Mar 1, 2026" },
    ];

    return (
        <div className="page-transition">
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 6 }}>
                    Welcome back, <span className="gradient-text">Pranav</span> 👋
                </h1>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    Here&apos;s what&apos;s happening with your products and content.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="glass-card"
                        style={{
                            padding: 24,
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: `${stat.color}15`,
                                border: `1px solid ${stat.color}25`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.3rem",
                                flexShrink: 0,
                            }}
                        >
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                                {stat.label}
                            </p>
                            <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f1f5f9" }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(99,102,241,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Recent Orders</h2>
                    <span style={{ fontSize: "0.8rem", color: "#a855f7", fontWeight: 600 }}>View All</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
                                {["Order ID", "Product", "Buyer", "Amount", "Status", "Date"].map((h) => (
                                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: "1px solid rgba(99,102,241,0.05)", transition: "background 0.2s" }}>
                                    <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#a5b4fc", fontWeight: 600 }}>{order.id}</td>
                                    <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#f1f5f9" }}>{order.product}</td>
                                    <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#94a3b8" }}>{order.buyer}</td>
                                    <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#22d3ee", fontWeight: 600 }}>{order.amount}</td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span
                                            style={{
                                                padding: "4px 12px",
                                                borderRadius: 50,
                                                fontSize: "0.72rem",
                                                fontWeight: 600,
                                                background: order.status === "Completed" ? "rgba(16, 185, 129, 0.1)" : "rgba(234, 179, 8, 0.1)",
                                                color: order.status === "Completed" ? "#34d399" : "#facc15",
                                                border: `1px solid ${order.status === "Completed" ? "rgba(16,185,129,0.2)" : "rgba(234,179,8,0.2)"}`,
                                            }}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#475569" }}>{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16, marginTop: 32 }}>
                <a
                    href="/admin/blogs"
                    className="glass-card"
                    style={{
                        padding: 24,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        cursor: "pointer",
                    }}
                >
                    <span style={{ fontSize: "1.5rem" }}>✍️</span>
                    <div>
                        <p style={{ fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>Write New Post</p>
                        <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Create a new blog article</p>
                    </div>
                </a>
                <a
                    href="/admin/products"
                    className="glass-card"
                    style={{
                        padding: 24,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        cursor: "pointer",
                    }}
                >
                    <span style={{ fontSize: "1.5rem" }}>📦</span>
                    <div>
                        <p style={{ fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>Add New Product</p>
                        <p style={{ fontSize: "0.8rem", color: "#64748b" }}>List a new digital product</p>
                    </div>
                </a>
            </div>
        </div>
    );
}
