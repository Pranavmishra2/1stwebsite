"use client";
import { useState } from "react";
import { AdminProvider, AdminGuard } from "@/context/AdminContext";
import { seedAll, seedBlogs, seedProducts } from "@/lib/seedData";

function SeedContent() {
    const [log, setLog] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

    const runSeed = async (type: "all" | "blogs" | "products") => {
        setLoading(true);
        setLog([]);
        addLog(`🚀 Starting ${type} seed...`);
        try {
            if (type === "all") {
                addLog("📝 Seeding blogs...");
                await seedBlogs();
                addLog("✅ Blogs seeded!");
                addLog("📦 Seeding products...");
                await seedProducts();
                addLog("✅ Products seeded!");
            } else if (type === "blogs") {
                await seedBlogs();
                addLog("✅ Blogs seeded!");
            } else {
                await seedProducts();
                addLog("✅ Products seeded!");
            }
            addLog("🎉 Seed complete! Check your Firebase Console.");
        } catch (err) {
            addLog(`❌ Error: ${err}`);
        }
        setLoading(false);
    };

    return (
        <div className="page-transition" style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>
                🌱 Database <span className="gradient-text">Seeder</span>
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 32 }}>
                Seed your Firestore database with initial blog posts and products from mock data.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
                <button className="gradient-btn" onClick={() => runSeed("all")} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
                    {loading ? "Seeding..." : "🌱 Seed All Data"}
                </button>
                <button className="gradient-btn-outline" onClick={() => runSeed("blogs")} disabled={loading}>
                    📝 Seed Blogs Only
                </button>
                <button className="gradient-btn-outline" onClick={() => runSeed("products")} disabled={loading}>
                    📦 Seed Products Only
                </button>
            </div>

            {log.length > 0 && (
                <div className="glass-card" style={{ padding: 20, fontFamily: "monospace", fontSize: "0.82rem" }}>
                    {log.map((line, i) => (
                        <div key={i} style={{ color: line.includes("❌") ? "#f87171" : line.includes("✅") || line.includes("🎉") ? "#34d399" : "#94a3b8", marginBottom: 6 }}>
                            {line}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SeedPage() {
    return (
        <AdminProvider>
            <AdminGuard>
                <SeedContent />
            </AdminGuard>
        </AdminProvider>
    );
}
