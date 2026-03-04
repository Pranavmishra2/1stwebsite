"use client";
import { useState, useEffect } from "react";
import { getBlogs } from "@/lib/blogService";
import { getProducts } from "@/lib/productService";
import { getSubscribers } from "@/lib/adminServices";

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState({ blogs: 0, products: 0, subscribers: 0, activeProducts: 0, draftPosts: 0, publishedPosts: 0, totalRevenue: 0 });
    const [loading, setLoading] = useState(true);
    const [blogsByCategory, setBlogsByCategory] = useState<Record<string, number>>({});
    const [productsByCategory, setProductsByCategory] = useState<Record<string, number>>({});

    useEffect(() => {
        async function fetchStats() {
            try {
                const [blogs, products, subscribers] = await Promise.all([getBlogs(), getProducts(), getSubscribers()]);
                const published = blogs.filter((b) => b.status === "Published").length;
                const drafts = blogs.filter((b) => b.status === "Draft").length;
                const active = products.filter((p) => p.status === "Active").length;
                const revenue = products.reduce((sum, p) => sum + p.price, 0);

                const blogCats: Record<string, number> = {};
                blogs.forEach((b) => { blogCats[b.category] = (blogCats[b.category] || 0) + 1; });
                const prodCats: Record<string, number> = {};
                products.forEach((p) => { prodCats[p.category] = (prodCats[p.category] || 0) + 1; });

                setStats({ blogs: blogs.length, products: products.length, subscribers: subscribers.length, activeProducts: active, draftPosts: drafts, publishedPosts: published, totalRevenue: revenue });
                setBlogsByCategory(blogCats);
                setProductsByCategory(prodCats);
            } catch (err) { console.error("Error loading analytics:", err); }
            setLoading(false);
        }
        fetchStats();
    }, []);

    if (loading) return <div className="glass-card" style={{ padding: 48, textAlign: "center" }}><p className="gradient-text" style={{ fontWeight: 600 }}>Loading analytics...</p></div>;

    return (
        <div className="page-transition">
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>
                <span className="gradient-text">Analytics</span> Dashboard
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 28 }}>Real-time stats from your Firestore database</p>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 180px), 1fr))", gap: 12, marginBottom: 28 }}>
                {[
                    { label: "Total Blogs", value: stats.blogs, icon: "📝", color: "#a855f7" },
                    { label: "Published", value: stats.publishedPosts, icon: "✅", color: "#34d399" },
                    { label: "Drafts", value: stats.draftPosts, icon: "📋", color: "#facc15" },
                    { label: "Products", value: stats.products, icon: "📦", color: "#22d3ee" },
                    { label: "Active Products", value: stats.activeProducts, icon: "🟢", color: "#34d399" },
                    { label: "Subscribers", value: stats.subscribers, icon: "📧", color: "#f472b6" },
                    { label: "Portfolio Value", value: `$${stats.totalRevenue}`, icon: "💰", color: "#facc15" },
                ].map((stat) => (
                    <div key={stat.label} className="glass-card" style={{ padding: "18px 16px", textAlign: "center" }}>
                        <p style={{ fontSize: "1.4rem", marginBottom: 6 }}>{stat.icon}</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: 800, color: stat.color }}>{stat.value}</p>
                        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 4 }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 16 }}>
                {/* Blog categories chart */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#a855f7" }}>📝 Blogs by Category</h3>
                    {Object.keys(blogsByCategory).length === 0 ? <p style={{ color: "#475569", fontSize: "0.85rem" }}>No data yet — seed your database first</p> :
                        Object.entries(blogsByCategory).map(([cat, count]) => (
                            <div key={cat} style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{cat}</span>
                                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#f1f5f9" }}>{count}</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 3, background: "rgba(99,102,241,0.1)", overflow: "hidden" }}>
                                    <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #6366f1, #a855f7)", width: `${(count / stats.blogs) * 100}%`, transition: "width 0.5s ease" }} />
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Product categories chart */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#22d3ee" }}>📦 Products by Category</h3>
                    {Object.keys(productsByCategory).length === 0 ? <p style={{ color: "#475569", fontSize: "0.85rem" }}>No data yet — add some products first</p> :
                        Object.entries(productsByCategory).map(([cat, count]) => (
                            <div key={cat} style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{cat}</span>
                                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#f1f5f9" }}>{count}</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 3, background: "rgba(34,211,238,0.1)", overflow: "hidden" }}>
                                    <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #22d3ee, #6366f1)", width: `${(count / stats.products) * 100}%`, transition: "width 0.5s ease" }} />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
