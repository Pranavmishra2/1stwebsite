"use client";
import { useState, useEffect } from "react";
import { getOrders, Order } from "@/lib/orderService";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "paid" | "created" | "failed">("all");

    useEffect(() => {
        getOrders().then((o) => { setOrders(o); setLoading(false); });
    }, []);

    const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
    const totalRevenue = orders.filter((o) => o.status === "paid").reduce((sum, o) => sum + o.amount, 0);
    const paidCount = orders.filter((o) => o.status === "paid").length;
    const pendingCount = orders.filter((o) => o.status === "created").length;

    const statusColor: Record<string, string> = { paid: "#34d399", created: "#facc15", failed: "#f87171", refunded: "#94a3b8" };
    const statusBg: Record<string, string> = { paid: "rgba(16,185,129,0.1)", created: "rgba(250,204,21,0.1)", failed: "rgba(239,68,68,0.1)", refunded: "rgba(148,163,184,0.1)" };

    return (
        <div className="page-transition">
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>
                💰 <span className="gradient-text">Orders</span>
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 24 }}>Track all payments and orders</p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 160px), 1fr))", gap: 12, marginBottom: 24 }}>
                {[
                    { label: "Total Revenue", value: `₹${totalRevenue}`, icon: "💰", color: "#22d3ee" },
                    { label: "Paid Orders", value: paidCount, icon: "✅", color: "#34d399" },
                    { label: "Pending", value: pendingCount, icon: "⏳", color: "#facc15" },
                    { label: "Total Orders", value: orders.length, icon: "📦", color: "#a855f7" },
                ].map((stat) => (
                    <div key={stat.label} className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
                        <p style={{ fontSize: "1.2rem", marginBottom: 4 }}>{stat.icon}</p>
                        <p style={{ fontSize: "1.3rem", fontWeight: 800, color: stat.color }}>{stat.value}</p>
                        <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 2 }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {(["all", "paid", "created", "failed"] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: "6px 16px", borderRadius: 50, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                        border: `1px solid ${filter === f ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.1)"}`,
                        background: filter === f ? "rgba(99,102,241,0.1)" : "transparent",
                        color: filter === f ? "#a5b4fc" : "#64748b",
                    }}>
                        {f === "all" ? `All (${orders.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${orders.filter((o) => o.status === f).length})`}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            {loading ? <div className="glass-card" style={{ padding: 40, textAlign: "center" }}><p className="gradient-text" style={{ fontWeight: 600 }}>Loading orders...</p></div> :
                filtered.length === 0 ? (
                    <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                        <p style={{ fontSize: "1.5rem", marginBottom: 8 }}>📦</p>
                        <p style={{ color: "#64748b" }}>{filter === "all" ? "No orders yet — orders will appear here when customers buy products!" : `No ${filter} orders`}</p>
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                                <thead><tr style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
                                    {["Product", "Customer", "Amount", "Status", "Date", "Payment ID"].map((h) => (
                                        <th key={h} style={{ padding: "12px 14px", fontSize: "0.72rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "left" }}>{h}</th>
                                    ))}
                                </tr></thead>
                                <tbody>{filtered.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: "1px solid rgba(99,102,241,0.05)" }}>
                                        <td style={{ padding: "12px 14px" }}>
                                            <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "#f1f5f9" }}>{order.productName}</p>
                                        </td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{order.customerEmail || "—"}</p>
                                        </td>
                                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#22d3ee", fontSize: "0.9rem" }}>₹{order.amount}</td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <span style={{ padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600, background: statusBg[order.status] || statusBg.created, color: statusColor[order.status] || statusColor.created }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: "0.82rem", color: "#475569" }}>{order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                                        <td style={{ padding: "12px 14px", fontSize: "0.75rem", color: "#475569", fontFamily: "monospace" }}>{order.razorpayPaymentId || "—"}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
