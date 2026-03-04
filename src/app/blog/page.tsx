"use client";
import Link from "next/link";
import { blogPosts, categories } from "@/data/blogs";
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

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = blogPosts.filter((post) => {
    const matchCategory = activeCategory === "All" || post.category === activeCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "60px 0 40px", position: "relative", overflow: "hidden" }}>
        <div className="bg-orb" style={{ width: 400, height: 400, background: "#a855f7", top: -150, right: -100 }} />
        <div className="container-custom" style={{ position: "relative", zIndex: 2 }}>
          <AnimateOnScroll>
            <p style={{ fontSize: "0.85rem", color: "#a855f7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Blog</p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 12 }}>
              Insights & <span className="gradient-text">Articles</span>
            </h1>
            <p style={{ color: "#64748b", maxWidth: 550, lineHeight: 1.6 }}>
              Deep dives into AI, automation, tech entrepreneurship, and building digital products that matter.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Filters */}
      <section style={{ paddingBottom: 40 }}>
        <div className="container-custom">
          <AnimateOnScroll delay={0.1}>
            <div style={{ marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: 400,
                  padding: "12px 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(99, 102, 241, 0.15)",
                  background: "rgba(22, 22, 29, 0.6)",
                  color: "#f1f5f9",
                  fontSize: "0.9rem",
                  outline: "none",
                  backdropFilter: "blur(10px)",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map((cat) => (
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

      {/* Blog Grid */}
      <section style={{ paddingBottom: 100 }}>
        <div className="container-custom">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
              <p style={{ fontSize: "1.2rem" }}>No articles found</p>
              <p style={{ fontSize: "0.9rem", marginTop: 8 }}>Try a different search or category</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 16 }}>
              {filtered.map((post, i) => (
                <AnimateOnScroll key={post.id} delay={i * 0.1}>
                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                    <article className="glass-card" style={{ padding: 0, overflow: "hidden", height: "100%" }}>
                      <div style={{ height: 160, background: `linear-gradient(135deg, rgba(168,85,247,0.15), rgba(34,211,238,0.15))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "2.5rem", opacity: 0.5 }}>📝</span>
                      </div>
                      <div style={{ padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                          <span className="tag-pill">{post.category}</span>
                          <span style={{ fontSize: "0.75rem", color: "#475569" }}>{post.readingTime}</span>
                          <span style={{ fontSize: "0.75rem", color: "#475569" }}>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 10, lineHeight: 1.4 }}>{post.title}</h2>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6 }}>{post.excerpt}</p>
                        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} style={{ fontSize: "0.7rem", color: "#475569", background: "rgba(99,102,241,0.06)", padding: "3px 10px", borderRadius: 50 }}>#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
