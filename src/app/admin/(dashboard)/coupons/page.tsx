"use client";
import { useState, useEffect } from "react";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, Coupon } from "@/lib/adminServices";

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ code: "", discount: "", type: "percentage" as "percentage" | "fixed", maxUses: "100", expiresAt: "" });

    const fetchData = async () => { setLoading(true); setCoupons(await getCoupons()); setLoading(false); };
    useEffect(() => { fetchData(); }, []);

    const handleCreate = async () => {
        if (!form.code || !form.discount) return;
        await createCoupon({
            code: form.code.toUpperCase().replace(/\s/g, ""),
            discount: Number(form.discount),
            type: form.type,
            maxUses: Number(form.maxUses) || 100,
            active: true,
            expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
        });
        setForm({ code: "", discount: "", type: "percentage", maxUses: "100", expiresAt: "" });
        setShowForm(false); await fetchData();
    };

    const toggleActive = async (coupon: Coupon) => {
        if (!coupon.id) return;
        await updateCoupon(coupon.id, { active: !coupon.active }); await fetchData();
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id || !confirm("Delete this coupon?")) return;
        await deleteCoupon(id); await fetchData();
    };

    return (
        <div className="page-transition">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>🏷️ <span className="gradient-text">Coupons</span></h1>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>{coupons.filter((c) => c.active).length} active coupons</p>
                </div>
                <button className="gradient-btn" onClick={() => setShowForm(true)}>+ New Coupon</button>
            </div>

            {showForm && (
                <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16 }}>Create <span className="gradient-text">Coupon</span></h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: 12 }}>
                        <div><label style={labelStyle}>Code *</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="SAVE20" style={{ ...inputStyle, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em" }} /></div>
                        <div><label style={labelStyle}>Discount *</label><input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="20" style={inputStyle} /></div>
                        <div><label style={labelStyle}>Type</label>
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })} style={{ ...inputStyle, background: "rgba(15,15,20,0.9)" }}>
                                <option value="percentage">% Percentage</option>
                                <option value="fixed">$ Fixed Amount</option>
                            </select>
                        </div>
                        <div><label style={labelStyle}>Max Uses</label><input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Expires (optional)</label><input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} style={inputStyle} /></div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                        <button className="gradient-btn" onClick={handleCreate}>Create Coupon</button>
                        <button className="gradient-btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {loading ? <div className="glass-card" style={{ padding: 40, textAlign: "center" }}><p className="gradient-text" style={{ fontWeight: 600 }}>Loading coupons...</p></div> :
                coupons.length === 0 ? <div className="glass-card" style={{ padding: 48, textAlign: "center" }}><p style={{ fontSize: "1.3rem", marginBottom: 8 }}>🏷️</p><p style={{ color: "#64748b" }}>No coupons yet</p></div> :
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 12 }}>
                        {coupons.map((coupon) => (
                            <div key={coupon.id} className="glass-card" style={{ padding: 20 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                                    <code style={{ fontSize: "1.1rem", fontWeight: 800, color: "#22d3ee", background: "rgba(34,211,238,0.08)", padding: "4px 12px", borderRadius: 6, letterSpacing: "0.1em" }}>{coupon.code}</code>
                                    <span onClick={() => toggleActive(coupon)} style={{ padding: "3px 10px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", background: coupon.active ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: coupon.active ? "#34d399" : "#f87171" }}>
                                        {coupon.active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>
                                    {coupon.type === "percentage" ? `${coupon.discount}%` : `$${coupon.discount}`}
                                    <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "#64748b", marginLeft: 8 }}>off</span>
                                </p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", color: "#475569", marginBottom: 12 }}>
                                    <span>Used: {coupon.usedCount}/{coupon.maxUses}</span>
                                    <span>{coupon.expiresAt ? `Exp: ${coupon.expiresAt.toLocaleDateString()}` : "No expiry"}</span>
                                </div>
                                <div style={{ height: 4, borderRadius: 2, background: "rgba(99,102,241,0.1)", overflow: "hidden", marginBottom: 14 }}>
                                    <div style={{ height: "100%", borderRadius: 2, background: coupon.usedCount / coupon.maxUses > 0.8 ? "#f87171" : "#34d399", width: `${Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)}%` }} />
                                </div>
                                <button onClick={() => handleDelete(coupon.id)} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.04)", color: "#f87171", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>🗑️ Delete</button>
                            </div>
                        ))}
                    </div>
            }
        </div>
    );
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.15)", background: "rgba(15,15,20,0.6)", color: "#f1f5f9", fontSize: "0.88rem", outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase" };
