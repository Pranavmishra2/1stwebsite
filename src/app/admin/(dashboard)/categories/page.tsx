"use client";
import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory, Category } from "@/lib/categoryService";

const COLORS = ["#6366f1", "#a855f7", "#22d3ee", "#34d399", "#f472b6", "#facc15", "#f87171", "#fb923c"];

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [form, setForm] = useState({ name: "", type: "blog" as "blog" | "product", color: COLORS[0] });

    const fetchData = async () => { setLoading(true); setCategories(await getCategories()); setLoading(false); };
    useEffect(() => { fetchData(); }, []);

    const handleSave = async () => {
        if (!form.name) return;
        const slug = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        if (editing?.id) {
            await updateCategory(editing.id, { name: form.name, slug, type: form.type, color: form.color });
        } else {
            await createCategory({ name: form.name, slug, type: form.type, color: form.color });
        }
        setShowForm(false); setEditing(null); setForm({ name: "", type: "blog", color: COLORS[0] });
        await fetchData();
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id || !confirm("Delete this category?")) return;
        await deleteCategory(id); await fetchData();
    };

    const blogCats = categories.filter((c) => c.type === "blog");
    const productCats = categories.filter((c) => c.type === "product");

    return (
        <div className="page-transition">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>
                        <span className="gradient-text">Categories</span> Manager
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>{categories.length} categories total</p>
                </div>
                <button className="gradient-btn" onClick={() => { setEditing(null); setForm({ name: "", type: "blog", color: COLORS[0] }); setShowForm(true); }}>+ New Category</button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
                    <div className="glass-card" style={{ width: "100%", maxWidth: 440, padding: 32 }}>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 20 }}>{editing ? "Edit" : "New"} <span className="gradient-text">Category</span></h2>
                        <div style={{ display: "grid", gap: 14 }}>
                            <div><label style={labelStyle}>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Category name" /></div>
                            <div><label style={labelStyle}>Type</label>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {(["blog", "product"] as const).map((t) => (
                                        <button key={t} onClick={() => setForm({ ...form, type: t })} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${form.type === t ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.1)"}`, background: form.type === t ? "rgba(99,102,241,0.1)" : "transparent", color: form.type === t ? "#a5b4fc" : "#64748b", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                                            {t === "blog" ? "📝 Blog" : "📦 Product"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div><label style={labelStyle}>Color</label>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {COLORS.map((c) => (
                                        <div key={c} onClick={() => setForm({ ...form, color: c })} style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: "pointer", border: form.color === c ? "3px solid white" : "3px solid transparent", transition: "all 0.2s" }} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                                <button className="gradient-btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1 }}>Cancel</button>
                                <button className="gradient-btn" onClick={handleSave} style={{ flex: 1 }}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog Categories */}
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#a855f7", marginBottom: 12 }}>📝 Blog Categories</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))", gap: 10, marginBottom: 28 }}>
                {loading ? <p style={{ color: "#475569" }}>Loading...</p> : blogCats.length === 0 ? <p style={{ color: "#475569", fontSize: "0.85rem" }}>No blog categories yet</p> : blogCats.map((cat) => (
                    <div key={cat.id} className="glass-card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 12, height: 12, borderRadius: 4, background: cat.color }} />
                            <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{cat.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => { setEditing(cat); setForm({ name: cat.name, type: cat.type, color: cat.color }); setShowForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "#a5b4fc" }}>✏️</button>
                            <button onClick={() => handleDelete(cat.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "#f87171" }}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Categories */}
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#22d3ee", marginBottom: 12 }}>📦 Product Categories</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))", gap: 10 }}>
                {loading ? <p style={{ color: "#475569" }}>Loading...</p> : productCats.length === 0 ? <p style={{ color: "#475569", fontSize: "0.85rem" }}>No product categories yet</p> : productCats.map((cat) => (
                    <div key={cat.id} className="glass-card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 12, height: 12, borderRadius: 4, background: cat.color }} />
                            <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{cat.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => { setEditing(cat); setForm({ name: cat.name, type: cat.type, color: cat.color }); setShowForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "#a5b4fc" }}>✏️</button>
                            <button onClick={() => handleDelete(cat.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "#f87171" }}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.15)", background: "rgba(15,15,20,0.6)", color: "#f1f5f9", fontSize: "0.88rem", outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" };
