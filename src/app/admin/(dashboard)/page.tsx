"use client";
import { useEffect, useState } from "react";
import { getProducts, Product } from "@/lib/productService";
import { getOrders, Order } from "@/lib/orderService";
import { getSubscribers } from "@/lib/adminServices";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        productsCount: 0,
        usersCount: 0,
        revenue: 0,
        ordersCount: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                // Fetch all data in parallel
                const [allProducts, allOrders, allSubscribers] = await Promise.all([
                    getProducts(),
                    getOrders(),
                    getSubscribers()
                ]);

                // Calculate total revenue (only from paid orders)
                const paidOrders = allOrders.filter(o => o.status === "paid");
                const totalRevenue = paidOrders.reduce((sum, order) => sum + order.amount, 0);

                // Assuming registered users via orders + subscribers minus duplicates
                const uniqueEmails = new Set([
                    ...allOrders.map(o => o.customerEmail),
                    ...allSubscribers.map(s => s.email)
                ]);

                setStats({
                    productsCount: allProducts.length,
                    usersCount: uniqueEmails.size,
                    revenue: totalRevenue,
                    ordersCount: allOrders.length
                });

                // Top 5 most recent orders
                setRecentOrders(allOrders.slice(0, 5));
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const displayStats = [
        { label: "Total Products", value: stats.productsCount, icon: "📦", color: "#6366f1" },
        { label: "Total Users", value: stats.usersCount, icon: "👥", color: "#a855f7" },
        { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: "💰", color: "#22d3ee" },
        { label: "Total Orders", value: stats.ordersCount, icon: "🛒", color: "#10b981" },
    ];

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                <p>Loading real-time dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="page-transition">
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 6 }}>
                    Welcome back, <span className="gradient-text">Admin</span> 👋
                </h1>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    Here&apos;s what&apos;s happening with your products and content.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
                {displayStats.map((stat) => (
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
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: "1px solid rgba(99,102,241,0.05)", transition: "background 0.2s" }}>
                                        <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#a5b4fc", fontWeight: 600 }}>{order.orderId || order.id?.substring(0, 8)}</td>
                                        <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#f1f5f9" }}>{order.productName}</td>
                                        <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#94a3b8" }}>{order.customerEmail}</td>
                                        <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#22d3ee", fontWeight: 600 }}>₹{order.amount.toLocaleString('en-IN')}</td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span
                                                style={{
                                                    padding: "4px 12px",
                                                    borderRadius: 50,
                                                    fontSize: "0.72rem",
                                                    fontWeight: 600,
                                                    background: order.status === "paid" ? "rgba(16, 185, 129, 0.1)" : "rgba(234, 179, 8, 0.1)",
                                                    color: order.status === "paid" ? "#34d399" : "#facc15",
                                                    border: `1px solid ${order.status === "paid" ? "rgba(16,185,129,0.2)" : "rgba(234,179,8,0.2)"}`,
                                                    textTransform: "capitalize"
                                                }}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#475569" }}>
                                            {order.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))
                            )}
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
