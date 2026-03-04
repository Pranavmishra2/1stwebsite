"use client";
import Link from "next/link";
import { products } from "@/data/products";
import { blogPosts } from "@/data/blogs";
import { useEffect, useRef, useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import TiltCard from "@/components/TiltCard";
import Typewriter from "@/components/Typewriter";
import AnimatedCounter from "@/components/AnimatedCounter";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import NewsletterSection from "@/components/NewsletterSection";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

function AnimateOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    // Fetch real counts from Firestore
    getDocs(collection(db, "subscribers")).then((s) => setUserCount(s.size)).catch(() => { });
    getDocs(collection(db, "orders")).then((s) => setProductCount(s.size)).catch(() => { });
  }, []);

  return (
    <div className="page-transition">
      {/* ===== HERO SECTION ===== */}
      <section
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Particle Background */}
        <ParticleBackground />

        {/* Background orbs */}
        <div className="bg-orb" style={{ width: 500, height: 500, background: "#6366f1", top: -100, right: -200 }} />
        <div className="bg-orb" style={{ width: 400, height: 400, background: "#a855f7", bottom: -100, left: -150 }} />

        <div className="container-custom" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <AnimateOnScroll>
            <div style={{ marginBottom: 16 }}>
              <Typewriter
                texts={[
                  "AI Developer",
                  "Digital Creator",
                  "Tech Builder",
                  "Automation Expert",
                  "Product Maker",
                ]}
                speed={70}
                deleteSpeed={40}
                pauseTime={2000}
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.1}>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "24px",
              }}
            >
              Hey, I&apos;m{" "}
              <span className="gradient-text-animated">Pranav Kashyap</span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.2}>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#94a3b8", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.6 }}>
              I build AI-powered tools, share knowledge through content, and help creators & entrepreneurs leverage technology to grow faster.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.3}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", padding: "0 8px" }}>
              <Link href="/store" className="gradient-btn" style={{ position: "relative", overflow: "hidden" }}>
                <span style={{ position: "relative", zIndex: 1 }}>✦ Explore Products</span>
              </Link>
              <Link href="/blog" className="gradient-btn-outline">
                Read Articles →
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Stats with Animated Counters */}
          <AnimateOnScroll delay={0.45}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "clamp(24px, 5vw, 48px)",
                marginTop: "clamp(40px, 6vw, 64px)",
                flexWrap: "wrap",
              }}
            >
              {[
                { end: products.length, suffix: "", label: "Products Live" },
                { end: productCount, suffix: "", label: "Orders Placed" },
                { end: userCount, suffix: "", label: "Users Joined" },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <p className="gradient-text" style={{ fontSize: "2rem", fontWeight: 800 }}>
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2000} />
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 4 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="section-padding" style={{ position: "relative" }}>
        <div className="container-custom">
          <AnimateOnScroll>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "0.85rem", color: "#a855f7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                About
              </p>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800 }}>
                Building the <span className="gradient-text-animated">Future with AI</span>
              </h2>
            </div>
          </AnimateOnScroll>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(24px, 4vw, 40px)", alignItems: "center" }}>
            <AnimateOnScroll>
              <div>
                <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 20 }}>
                  I&apos;m <strong style={{ color: "#f1f5f9" }}>Pranav Kashyap</strong> — an AI developer, digital creator, and tech entrepreneur focused on building tools that make technology accessible and powerful for everyone.
                </p>
                <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: 28 }}>
                  My vision is to bridge the gap between cutting-edge AI and practical, everyday use cases. Whether it&apos;s automating workflows, generating content, or building intelligent applications — I believe the right tools can 10x anyone&apos;s output.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.15}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { icon: "🤖", label: "Artificial Intelligence" },
                  { icon: "⚡", label: "Automation" },
                  { icon: "💻", label: "Full-Stack Dev" },
                  { icon: "📦", label: "Digital Products" },
                  { icon: "🧠", label: "Machine Learning" },
                  { icon: "🚀", label: "SaaS Building" },
                ].map((skill) => (
                  <div key={skill.label} className="skill-badge" style={{ justifyContent: "flex-start" }}>
                    <span>{skill.icon}</span>
                    <span>{skill.label}</span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS with TiltCards ===== */}
      <section className="section-padding" style={{ background: "rgba(22, 22, 29, 0.4)" }}>
        <div className="container-custom">
          <AnimateOnScroll>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "0.85rem", color: "#a855f7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Products
              </p>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800 }}>
                Featured <span className="gradient-text-animated">AI Tools</span>
              </h2>
              <p style={{ color: "#64748b", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
                Premium digital products designed to supercharge your productivity
              </p>
            </div>
          </AnimateOnScroll>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "16px" }}>
            {products.slice(0, 3).map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i * 0.15}>
                <Link href={`/store/${product.slug}`} style={{ textDecoration: "none" }}>
                  <TiltCard
                    className="glass-card glow-border"
                    style={{ padding: 0, overflow: "hidden" }}
                    glowColor="99, 102, 241"
                  >
                    <div
                      style={{
                        height: 180,
                        background: `linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <span style={{ fontSize: "3rem" }}>
                        {product.slug.includes("content") ? "✍️" : product.slug.includes("automation") ? "⚡" : product.slug.includes("image") ? "🎨" : "🤖"}
                      </span>
                      {product.badge && (
                        <span
                          style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            padding: "4px 12px",
                            borderRadius: 50,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            background: "linear-gradient(135deg, #6366f1, #a855f7)",
                            color: "white",
                          }}
                        >
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: "20px" }}>
                      <p style={{ fontSize: "0.75rem", color: "#a855f7", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {product.category}
                      </p>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>
                        {product.name}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5, marginBottom: 16 }}>
                        {product.tagline}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#22d3ee" }}>₹{product.price}</span>
                        {product.originalPrice && (
                          <span style={{ fontSize: "0.85rem", color: "#475569", textDecoration: "line-through" }}>
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll delay={0.3}>
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/store" className="gradient-btn-outline">
                View All Products →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===== TESTIMONIALS MARQUEE ===== */}
      <TestimonialsMarquee />

      {/* ===== LATEST ARTICLES with TiltCards ===== */}
      <section className="section-padding" style={{ background: "rgba(22, 22, 29, 0.4)" }}>
        <div className="container-custom">
          <AnimateOnScroll>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "0.85rem", color: "#a855f7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Blog
              </p>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800 }}>
                Latest <span className="gradient-text-animated">Articles</span>
              </h2>
              <p style={{ color: "#64748b", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
                Insights on AI, automation, tech, and building digital products
              </p>
            </div>
          </AnimateOnScroll>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "16px" }}>
            {blogPosts.slice(0, 3).map((post, i) => (
              <AnimateOnScroll key={post.id} delay={i * 0.15}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <TiltCard
                    className="glass-card glow-border"
                    style={{ padding: 0, overflow: "hidden" }}
                    glowColor="168, 85, 247"
                  >
                    <div
                      style={{
                        height: 140,
                        background: `linear-gradient(135deg, rgba(168,85,247,0.15), rgba(34,211,238,0.15))`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: "2.5rem" }}>
                        {i === 0 ? "🤖" : i === 1 ? "⚙️" : "💡"}
                      </span>
                    </div>
                    <div style={{ padding: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <span className="tag-pill">{post.category}</span>
                        <span style={{ fontSize: "0.75rem", color: "#475569" }}>{post.readingTime}</span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 8, lineHeight: 1.4 }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
                        {post.excerpt.slice(0, 100)}...
                      </p>
                    </div>
                  </TiltCard>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll delay={0.3}>
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/blog" className="gradient-btn-outline">
                Read All Articles →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <NewsletterSection />

      {/* ===== CTA SECTION ===== */}
      <section className="section-padding" style={{ background: "rgba(22, 22, 29, 0.4)", position: "relative", overflow: "hidden" }}>
        <div className="bg-orb" style={{ width: 300, height: 300, background: "#6366f1", top: -100, left: -100 }} />
        <div className="bg-orb" style={{ width: 200, height: 200, background: "#a855f7", bottom: -80, right: -80 }} />
        <div className="container-custom" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <AnimateOnScroll>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: 16 }}>
              Ready to <span className="gradient-text-animated">Level Up?</span>
            </h2>
            <p style={{ color: "#64748b", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Explore my collection of AI tools and resources designed to take your productivity to the next level.
            </p>
            <Link href="/store" className="gradient-btn" style={{ padding: "14px 40px", fontSize: "1rem" }}>
              ✦ Browse Products
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
