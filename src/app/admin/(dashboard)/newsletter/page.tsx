"use client";
import { useState, useEffect } from "react";
import { getSubscribers, addSubscriber, updateSubscriberStatus, deleteSubscriber, Subscriber } from "@/lib/adminServices";

export default function AdminNewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");

    const fetchData = async () => { setLoading(true); setSubscribers(await getSubscribers()); setLoading(false); };
    useEffect(() => { fetchData(); }, []);

    const handleAdd = async () => {
        if (!newEmail) return;
        await addSubscriber(newEmail, newName);
        setNewEmail(""); setNewName(""); setShowAdd(false);
        await fetchData();
    };

    const handleToggle = async (sub: Subscriber) => {
        if (!sub.id) return;
        await updateSubscriberStatus(sub.id, sub.status === "active" ? "unsubscribed" : "active");
        await fetchData();
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id || !confirm("Remove this subscriber?")) return;
        await deleteSubscriber(id); await fetchData();
    };

    const active = subscribers.filter((s) => s.status === "active").length;

    return (
        <div className="page-transition">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>
                        📧 <span className="gradient-text">Newsletter</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>{active} active · {subscribers.length - active} unsubscribed</p>
                </div>
                <button className="gradient-btn" onClick={() => setShowAdd(true)}>+ Add Subscriber</button>
            </div>

            {showAdd && (
                <div className="glass-card" style={{ padding: 20, marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
                    <div style={{ flex: 1, minWidth: 180 }}><label style={labelStyle}>Email *</label><input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@example.com" style={inputStyle} /></div>
                    <div style={{ flex: 1, minWidth: 140 }}><label style={labelStyle}>Name</label><input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name (optional)" style={inputStyle} /></div>
                    <button className="gradient-btn" onClick={handleAdd} style={{ height: 42 }}>Add</button>
                    <button className="gradient-btn-outline" onClick={() => setShowAdd(false)} style={{ height: 42 }}>Cancel</button>
                </div>
            )}

            {loading ? <div className="glass-card" style={{ padding: 40, textAlign: "center" }}><p className="gradient-text" style={{ fontWeight: 600 }}>Loading subscribers...</p></div> :
                subscribers.length === 0 ? <div className="glass-card" style={{ padding: 48, textAlign: "center" }}><p style={{ fontSize: "1.3rem", marginBottom: 8 }}>📧</p><p style={{ color: "#64748b" }}>No subscribers yet</p></div> :
                    <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                                <thead><tr style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
                                    {["Email", "Name", "Status", "Date", "Actions"].map((h) => (
                                        <th key={h} style={{ padding: "12px 16px", fontSize: "0.72rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "left" }}>{h}</th>
                                    ))}
                                </tr></thead>
                                <tbody>{subscribers.map((sub) => (
                                    <tr key={sub.id} style={{ borderBottom: "1px solid rgba(99,102,241,0.05)" }}>
                                        <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 600, color: "#f1f5f9" }}>{sub.email}</td>
                                        <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#94a3b8" }}>{sub.name || "—"}</td>
                                        <td style={{ padding: "12px 16px" }}>
                                            <span onClick={() => handleToggle(sub)} style={{ padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", background: sub.status === "active" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: sub.status === "active" ? "#34d399" : "#f87171", border: `1px solid ${sub.status === "active" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#475569" }}>{sub.subscribedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                                        <td style={{ padding: "12px 16px" }}><button onClick={() => handleDelete(sub.id)} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#f87171", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>Delete</button></td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
            }
        </div>
    );
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.15)", background: "rgba(15,15,20,0.6)", color: "#f1f5f9", fontSize: "0.88rem", outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase" };
