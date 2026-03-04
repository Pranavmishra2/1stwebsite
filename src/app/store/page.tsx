"use client";
import Link from "next/link";
import { products } from "@/data/products";
import { useState, useEffect, useRef } from "react";

function AnimateOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return (
        <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
            {children}
        </div>
    );
}

const storeCategories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

export default function StorePage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

    return (
        <>
            {/* Hero */}
            <section style={{ padding: "60px 0 40px", position: "relative", overflow: "hidden" }}>
                <div className="bg-orb" style={{ width: 500, height: 500, background: "#6366f1", top: -200, left: -200 }} />
                <div className="container-custom" style={{ position: "relative", zIndex: 2 }}>
                    <AnimateOnScroll>
                        <p style={{ fontSize: "0.85rem", color: "#a855f7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Store</p>
                        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 12 }}>
                            Digital <span className="gradient-text">Products</span>
                        </h1>
                        <p style={{ color: "#64748b", maxWidth: 550, lineHeight: 1.6 }}>
                            Premium AI tools, automation kits, and resources to supercharge your productivity and business.
                        </p>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Filters */}
            <section style={{ paddingBottom: 40 }}>
                <div className="container-custom">
                    <AnimateOnScroll delay={0.1}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {storeCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: "8px 20px",
                                        borderRadius: 50,
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        border: "1px solid",
                                        borderColor: activeCategory === cat ? "rgba(168, 85, 247, 0.5)" : "rgba(99, 102, 241, 0.15)",
                                        background: activeCategory === cat ? "rgba(168, 85, 247, 0.15)" : "rgba(22, 22, 29, 0.4)",
                                        color: activeCategory === cat ? "#c084fc" : "#64748b",
                                        cursor: "pointer",
                                        transition: "all 0.3s",
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* Product Grid */}
            <section style={{ paddingBottom: 100 }}>
                <div className="container-custom">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 16 }}>
                        {filtered.map((product, i) => (
                            <AnimateOnScroll key={product.id} delay={i * 0.1}>
                                <Link href={`/store/${product.slug}`} style={{ textDecoration: "none" }}>
                                    <div className="glass-card" style={{ padding: 0, overflow: "hidden", height: "100%" }}>
                                        <div style={{ height: 200, background: `linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                            <span style={{ fontSize: "3.5rem", opacity: 0.5 }}>🤖</span>
                                            {product.badge && (
                                                <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 12px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 600, background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "white" }}>
                                                    {product.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ padding: 24 }}>
                                            <p style={{ fontSize: "0.75rem", color: "#a855f7", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{product.category}</p>
                                            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{product.name}</h3>
                                            <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5, marginBottom: 20 }}>{product.tagline}</p>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#22d3ee" }}>${product.price}</span>
                                                    {product.originalPrice && (
                                                        <span style={{ fontSize: "0.9rem", color: "#475569", textDecoration: "line-through" }}>${product.originalPrice}</span>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#a855f7" }}>View Details →</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </AnimateOnScroll>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
