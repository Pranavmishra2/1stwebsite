"use client";
import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, Product } from "@/lib/productService";

const categoryOptions = ["AI Tools", "Automation", "Guides", "Templates", "SaaS"];

export default function AdminProductsPage() {
    const [productList, setProductList] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "", slug: "", tagline: "", description: "", category: "AI Tools", price: "", originalPrice: "", features: "", downloadUrl: "",
    });
    const [productFile, setProductFile] = useState<File | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProductList(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const openNewProduct = () => {
        setEditingProduct(null);
        setForm({ name: "", slug: "", tagline: "", description: "", category: "AI Tools", price: "", originalPrice: "", features: "", downloadUrl: "" });
        setShowEditor(true);
    };

    const openEditProduct = (product: Product) => {
        setEditingProduct(product);
        setForm({
            name: product.name, slug: product.slug, tagline: product.tagline, description: product.description || "",
            category: product.category, price: product.price.toString(), originalPrice: product.originalPrice?.toString() || "",
            features: product.features?.join("\n") || "", downloadUrl: product.downloadUrl || "",
        });
        setProductFile(null);
        setShowEditor(true);
    };

    const [saveError, setSaveError] = useState("");

    const handleSave = async () => {
        if (!form.name || !form.price) { alert("Name and Price are required!"); return; }
        setSaving(true);
        setSaveError("");
        try {
            let downloadUrl = form.downloadUrl;
            if (productFile) {
                if (productFile.size > 1024 * 1024) {
                    setSaveError("File too large! Max 1MB. Use Download URL for bigger files.");
                    setSaving(false);
                    return;
                }
                // Convert small file to base64 and store in Firestore
                downloadUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject("File read failed");
                    reader.readAsDataURL(productFile);
                });
            }

            const productData = {
                name: form.name,
                slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                tagline: form.tagline,
                description: form.description,
                category: form.category,
                price: Number(form.price),
                features: form.features.split("\n").filter(Boolean),
                faqs: [],
                status: "Active" as const,
                downloadUrl,
            };

            const finalData = form.originalPrice
                ? { ...productData, originalPrice: Number(form.originalPrice) }
                : productData;

            if (editingProduct?.id) {
                await updateProduct(editingProduct.id, finalData);
            } else {
                await createProduct(finalData);
            }
            await fetchProducts();
            setShowEditor(false);
        } catch (err) {
            console.error("Error saving product:", err);
            setSaveError("Failed to save product. Try again or check console.");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            await fetchProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    const handleToggleStatus = async (product: Product) => {
        if (!product.id) return;
        await updateProduct(product.id, { status: product.status === "Active" ? "Draft" : "Active" });
        await fetchProducts();
    };

    return (
        <div className="page-transition">
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>
                        Digital <span className="gradient-text">Products</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                        {loading ? "Loading..." : `${productList.length} products in database`}
                    </p>
                </div>
                <button className="gradient-btn" onClick={openNewProduct}>+ New Product</button>
            </div>

            {/* Editor Modal */}
            {showEditor && (
                <div
                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowEditor(false); }}
                >
                    <div className="glass-card" style={{ width: "100%", maxWidth: 650, maxHeight: "90vh", overflow: "auto", padding: 32 }}>
                        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 24 }}>
                            {editingProduct ? "Edit" : "New"} <span className="gradient-text">Product</span>
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <InputField label="Product Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v, slug: v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} />
                            <InputField label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />

                            <div>
                                <label style={labelStyle}>Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, background: "rgba(15,15,20,0.9)" }}>
                                    {categoryOptions.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Price (₹ INR) *</label>
                                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="499" style={{ ...inputStyle, color: "#22d3ee", fontWeight: 700 }} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Original Price (₹)</label>
                                    <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="999 (optional)" style={{ ...inputStyle, textDecoration: "line-through", color: "#475569" }} />
                                </div>
                            </div>

                            <TextAreaField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={4} />
                            <TextAreaField label="Features (one per line)" value={form.features} onChange={(v) => setForm({ ...form, features: v })} rows={4} mono />

                            {/* File Upload */}
                            <div>
                                <label style={labelStyle}>📁 Product File (Upload from PC/Phone)</label>
                                <div style={{ ...inputStyle, padding: 0, overflow: "hidden", display: "flex", alignItems: "center" }}>
                                    <input
                                        type="file"
                                        onChange={(e) => setProductFile(e.target.files?.[0] || null)}
                                        style={{ width: "100%", padding: "12px 16px", cursor: "pointer" }}
                                    />
                                </div>
                                {productFile && <p style={{ fontSize: "0.78rem", color: "#34d399", marginTop: 6 }}>✅ {productFile.name} ({(productFile.size / 1024).toFixed(0)} KB)</p>}
                                {!productFile && form.downloadUrl && <p style={{ fontSize: "0.78rem", color: "#a5b4fc", marginTop: 6 }}>📎 File already uploaded</p>}
                                <p style={{ fontSize: "0.72rem", color: "#475569", marginTop: 4 }}>Upload the product file users will download after payment</p>
                            </div>

                            <InputField label="Or Enter Download URL" value={form.downloadUrl} onChange={(v) => setForm({ ...form, downloadUrl: v })} />


                            {saveError && (
                                <div style={{ padding: "10px 16px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "0.85rem" }}>
                                    ⚠️ {saveError}
                                </div>
                            )}

                            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                                <button className="gradient-btn-outline" onClick={() => setShowEditor(false)} style={{ padding: "10px 24px" }}>Cancel</button>
                                <button className="gradient-btn" onClick={handleSave} disabled={saving} style={{ padding: "10px 24px", opacity: saving ? 0.6 : 1 }}>
                                    {saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            {loading ? (
                <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                    <p className="gradient-text" style={{ fontWeight: 600 }}>Loading from Firestore...</p>
                </div>
            ) : productList.length === 0 ? (
                <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                    <p style={{ fontSize: "1.3rem", marginBottom: 8 }}>📦</p>
                    <p style={{ color: "#64748b", marginBottom: 16 }}>No products yet. Add your first one!</p>
                    <button className="gradient-btn" onClick={openNewProduct}>+ Add First Product</button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {productList.map((product) => (
                        <div key={product.id} className="glass-card" style={{ padding: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                                <span className="tag-pill">{product.category}</span>
                                <span
                                    style={{
                                        padding: "3px 10px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 600, cursor: "pointer",
                                        background: product.status === "Active" ? "rgba(16,185,129,0.1)" : "rgba(234,179,8,0.1)",
                                        color: product.status === "Active" ? "#34d399" : "#facc15",
                                        border: `1px solid ${product.status === "Active" ? "rgba(16,185,129,0.2)" : "rgba(234,179,8,0.2)"}`,
                                    }}
                                    onClick={() => handleToggleStatus(product)}
                                >
                                    {product.status}
                                </span>
                            </div>

                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{product.name}</h3>
                            <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: 16, lineHeight: 1.4 }}>{product.tagline}</p>

                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#22d3ee" }}>₹{product.price}</span>
                                {product.originalPrice && <span style={{ fontSize: "0.85rem", color: "#475569", textDecoration: "line-through" }}>₹{product.originalPrice}</span>}
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => openEditProduct(product)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.06)", color: "#a5b4fc", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>✏️ Edit</button>
                                <button onClick={() => handleDelete(product.id)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#f87171", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>🗑️ Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.2)", background: "rgba(15,15,20,0.6)", color: "#f1f5f9", fontSize: "0.9rem", outline: "none" };

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
        </div>
    );
}

function TextAreaField({ label, value, onChange, rows = 4, mono = false }: { label: string; value: string; onChange: (v: string) => void; rows?: number; mono?: boolean }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} style={{ ...inputStyle, resize: "vertical" as const, fontFamily: mono ? "monospace" : "inherit" }} />
        </div>
    );
}
