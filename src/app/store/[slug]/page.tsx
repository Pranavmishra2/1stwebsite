"use client";
import { products } from "@/data/products";
import Link from "next/link";
import { useState, use } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const product = products.find((p) => p.slug === slug);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    if (!product) {
        return (
            <div className="container-custom" style={{ padding: "100px 0", textAlign: "center" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 16 }}>Product Not Found</h1>
                <p style={{ color: "#64748b", marginBottom: 32 }}>The product you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/store" className="gradient-btn">Back to Store</Link>
            </div>
        );
    }

    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
        <>
            {/* Breadcrumb */}
            <section style={{ padding: "30px 0 0" }}>
                <div className="container-custom">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "#475569" }}>
                        <Link href="/store" style={{ textDecoration: "none", color: "#64748b" }}>Store</Link>
                        <span>/</span>
                        <span style={{ color: "#94a3b8" }}>{product.name}</span>
                    </div>
                </div>
            </section>

            {/* Product Hero */}
            <section style={{ padding: "40px 0 60px" }}>
                <div className="container-custom">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "start" }}>
                        {/* Image */}
                        <div>
                            <div
                                className="glass-card"
                                style={{
                                    height: 350,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                <span style={{ fontSize: "5rem", opacity: 0.4 }}>🤖</span>
                                {product.badge && (
                                    <span style={{ position: "absolute", top: 16, right: 16, padding: "6px 16px", borderRadius: 50, fontSize: "0.8rem", fontWeight: 600, background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "white" }}>
                                        {product.badge}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div>
                            <span className="tag-pill" style={{ marginBottom: 16, display: "inline-block" }}>{product.category}</span>
                            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>
                                {product.name}
                            </h1>
                            <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: 28 }}>
                                {product.tagline}
                            </p>

                            {/* Price */}
                            <div className="glass-card" style={{ padding: 24, marginBottom: 28 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                                    <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#22d3ee" }}>${product.price}</span>
                                    {product.originalPrice && (
                                        <>
                                            <span style={{ fontSize: "1.1rem", color: "#475569", textDecoration: "line-through" }}>${product.originalPrice}</span>
                                            <span style={{ padding: "4px 12px", borderRadius: 50, fontSize: "0.75rem", fontWeight: 600, background: "rgba(34, 211, 238, 0.1)", color: "#22d3ee", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
                                                {discount}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                                <button className="gradient-btn" style={{ width: "100%", padding: 16, fontSize: "1rem" }}>
                                    Buy Now — ${product.price}
                                </button>
                                <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#475569", marginTop: 12 }}>
                                    🔒 Secure payment · Instant download · 30-day guarantee
                                </p>
                            </div>

                            {/* Features list preview */}
                            <div>
                                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#e2e8f0", marginBottom: 12 }}>What&apos;s Included</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {product.features.slice(0, 4).map((feature, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                            <span style={{ color: "#22d3ee", fontSize: "1rem", marginTop: 2 }}>✓</span>
                                            <span style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5 }}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Description */}
            <section style={{ padding: "60px 0", background: "rgba(22, 22, 29, 0.4)" }}>
                <div className="container-custom" style={{ maxWidth: 900 }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 20 }}>
                        About This <span className="gradient-text">Product</span>
                    </h2>
                    <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 32 }}>
                        {product.description}
                    </p>

                    <h3 style={{ fontWeight: 700, fontSize: "1.15rem", color: "#e2e8f0", marginBottom: 16 }}>All Features</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                        {product.features.map((feature, i) => (
                            <div
                                key={i}
                                className="glass-card"
                                style={{ padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 12 }}
                            >
                                <span style={{ color: "#a855f7", fontSize: "1.1rem", marginTop: 1 }}>✦</span>
                                <span style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.5 }}>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            {product.faqs.length > 0 && (
                <section style={{ padding: "80px 0" }}>
                    <div className="container-custom" style={{ maxWidth: 750 }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 32, textAlign: "center" }}>
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {product.faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className="glass-card"
                                    style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#e2e8f0" }}>{faq.question}</p>
                                        <span style={{ color: "#a855f7", fontSize: "1.2rem", transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>
                                            ▾
                                        </span>
                                    </div>
                                    {openFaq === i && (
                                        <div style={{ padding: "0 24px 18px", color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bottom CTA */}
            <section style={{ padding: "60px 0 80px", background: "rgba(22, 22, 29, 0.4)" }}>
                <div className="container-custom" style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 16 }}>
                        Ready to Get <span className="gradient-text">{product.name}?</span>
                    </h2>
                    <p style={{ color: "#64748b", maxWidth: 500, margin: "0 auto 32px" }}>
                        Join 1000+ users who are already leveraging this tool to supercharge their workflow.
                    </p>
                    <button className="gradient-btn" style={{ padding: "16px 48px", fontSize: "1.05rem" }}>
                        Buy Now — ${product.price}
                    </button>
                </div>
            </section>
        </>
    );
}
