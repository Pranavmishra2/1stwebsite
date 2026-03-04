"use client";
import { blogPosts } from "@/data/blogs";
import Link from "next/link";
import { use } from "react";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { sanitizeHTML } from "@/lib/sanitize";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return (
            <div className="container-custom" style={{ padding: "100px 0", textAlign: "center" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 16 }}>Article Not Found</h1>
                <p style={{ color: "#64748b", marginBottom: 32 }}>The article you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/blog" className="gradient-btn">Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="page-transition">
            <ScrollProgressBar />
            {/* Hero */}
            <section style={{ padding: "60px 0 40px", position: "relative", overflow: "hidden" }}>
                <div className="bg-orb" style={{ width: 400, height: 400, background: "#6366f1", top: -200, right: -100 }} />
                <div className="container-custom" style={{ maxWidth: 800, position: "relative", zIndex: 2 }}>
                    <Link href="/blog" style={{ textDecoration: "none", color: "#64748b", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
                        ← Back to Blog
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                        <span className="tag-pill">{post.category}</span>
                        <span style={{ fontSize: "0.8rem", color: "#475569" }}>{post.readingTime} read</span>
                        <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                    </div>

                    <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                        {post.title}
                    </h1>

                    <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: 24 }}>
                        {post.excerpt}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                color: "white",
                            }}
                        >
                            PK
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#f1f5f9" }}>{post.author}</p>
                            <p style={{ fontSize: "0.75rem", color: "#475569" }}>AI Developer & Creator</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="container-custom" style={{ maxWidth: 800 }}>
                <div style={{ height: 1, background: "rgba(99, 102, 241, 0.1)", margin: "0 0 40px" }} />
            </div>

            {/* Content */}
            <section style={{ paddingBottom: 80 }}>
                <div className="container-custom" style={{ maxWidth: 800 }}>
                    <div className="prose-custom" dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }} />

                    {/* Tags */}
                    <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(99,102,241,0.1)" }}>
                        <p style={{ fontSize: "0.8rem", color: "#475569", marginBottom: 12 }}>Tags</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {post.tags.map((tag) => (
                                <span key={tag} className="tag-pill">{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Back to blog */}
                    <div style={{ marginTop: 48, textAlign: "center" }}>
                        <Link href="/blog" className="gradient-btn-outline">← Back to All Articles</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
