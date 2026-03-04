"use client";
import { useState, useEffect } from "react";
import { getBlogs, createBlog, updateBlog, deleteBlog, BlogPost } from "@/lib/blogService";

const categoryOptions = ["AI & ML", "Automation", "Development", "Tech Trends", "Tutorials"];

export default function AdminBlogsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "", slug: "", category: "AI & ML", content: "", excerpt: "", tags: "", metaTitle: "", metaDescription: "",
    });

    // Fetch blogs from Firestore
    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const data = await getBlogs();
            setPosts(data);
        } catch (err) {
            console.error("Error fetching blogs:", err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchBlogs(); }, []);

    const openNewPost = () => {
        setEditingPost(null);
        setForm({ title: "", slug: "", category: "AI & ML", content: "", excerpt: "", tags: "", metaTitle: "", metaDescription: "" });
        setShowEditor(true);
    };

    const openEditPost = (post: BlogPost) => {
        setEditingPost(post);
        setForm({
            title: post.title, slug: post.slug, category: post.category, content: post.content || "",
            excerpt: post.excerpt || "", tags: post.tags?.join(", ") || "", metaTitle: post.metaTitle || "", metaDescription: post.metaDescription || "",
        });
        setShowEditor(true);
    };

    const handleSave = async () => {
        if (!form.title) return;
        setSaving(true);
        try {
            const blogData = {
                title: form.title,
                slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                category: form.category,
                content: form.content,
                excerpt: form.excerpt,
                tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
                author: "Pranav Kashyap",
                readingTime: `${Math.max(1, Math.ceil(form.content.split(/\s+/).length / 200))} min`,
                metaTitle: form.metaTitle,
                metaDescription: form.metaDescription,
                status: "Published" as const,
            };

            if (editingPost?.id) {
                await updateBlog(editingPost.id, blogData);
            } else {
                await createBlog(blogData);
            }
            await fetchBlogs();
            setShowEditor(false);
        } catch (err) {
            console.error("Error saving blog:", err);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await deleteBlog(id);
            await fetchBlogs();
        } catch (err) {
            console.error("Error deleting blog:", err);
        }
    };

    return (
        <div className="page-transition">
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>
                        Blog <span className="gradient-text">Posts</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                        {loading ? "Loading..." : `${posts.length} articles in database`}
                    </p>
                </div>
                <button className="gradient-btn" onClick={openNewPost}>+ New Article</button>
            </div>

            {/* Editor Modal */}
            {showEditor && (
                <div
                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowEditor(false); }}
                >
                    <div className="glass-card" style={{ width: "100%", maxWidth: 700, maxHeight: "90vh", overflow: "auto", padding: 32 }}>
                        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 24 }}>
                            {editingPost ? "Edit" : "New"} <span className="gradient-text">Article</span>
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <InputField label="Title *" value={form.title} onChange={(v) => setForm({ ...form, title: v, slug: v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} placeholder="Enter article title" />
                            <InputField label="URL Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="auto-generated-from-title" />

                            <div>
                                <label style={labelStyle}>Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, background: "rgba(15,15,20,0.9)" }}>
                                    {categoryOptions.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <TextAreaField label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} placeholder="Brief summary..." rows={2} />
                            <TextAreaField label="Content (HTML)" value={form.content} onChange={(v) => setForm({ ...form, content: v })} placeholder="<h2>Your content...</h2>" rows={10} mono />
                            <InputField label="Tags (comma-separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="AI, Automation, Tools" />

                            <div style={{ padding: 16, borderRadius: 12, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)" }}>
                                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#a855f7", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>🔍 SEO Settings</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <input type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="Meta Title" style={inputStyle} />
                                    <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Meta Description" rows={2} style={{ ...inputStyle, resize: "vertical" as const }} />
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                                <button className="gradient-btn-outline" onClick={() => setShowEditor(false)} style={{ padding: "10px 24px" }}>Cancel</button>
                                <button className="gradient-btn" onClick={handleSave} disabled={saving} style={{ padding: "10px 24px", opacity: saving ? 0.6 : 1 }}>
                                    {saving ? "Saving..." : editingPost ? "Update Article" : "Publish Article"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Posts Table */}
            {loading ? (
                <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                    <p className="gradient-text" style={{ fontWeight: 600 }}>Loading from Firestore...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
                    <p style={{ fontSize: "1.3rem", marginBottom: 8 }}>📝</p>
                    <p style={{ color: "#64748b", marginBottom: 16 }}>No blog posts yet. Create your first one!</p>
                    <button className="gradient-btn" onClick={openNewPost}>+ Create First Post</button>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
                                    {["Title", "Category", "Status", "Date", "Actions"].map((h) => (
                                        <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post.id} style={{ borderBottom: "1px solid rgba(99,102,241,0.05)" }}>
                                        <td style={{ padding: "14px 16px" }}>
                                            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#f1f5f9", marginBottom: 2 }}>{post.title}</p>
                                            <p style={{ fontSize: "0.72rem", color: "#475569" }}>/{post.slug}</p>
                                        </td>
                                        <td style={{ padding: "14px 16px" }}><span className="tag-pill">{post.category}</span></td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span style={{ padding: "4px 12px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600, background: post.status === "Published" ? "rgba(16,185,129,0.1)" : "rgba(234,179,8,0.1)", color: post.status === "Published" ? "#34d399" : "#facc15", border: `1px solid ${post.status === "Published" ? "rgba(16,185,129,0.2)" : "rgba(234,179,8,0.2)"}` }}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#475569" }}>
                                            {post.createdAt instanceof Date ? post.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button onClick={() => openEditPost(post)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.06)", color: "#a5b4fc", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>Edit</button>
                                                <button onClick={() => handleDelete(post.id)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#f87171", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// Reusable styled components
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.2)", background: "rgba(15,15,20,0.6)", color: "#f1f5f9", fontSize: "0.9rem", outline: "none" };

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
        </div>
    );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4, mono = false }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; rows?: number; mono?: boolean }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...inputStyle, resize: "vertical" as const, fontFamily: mono ? "monospace" : "inherit" }} />
        </div>
    );
}
