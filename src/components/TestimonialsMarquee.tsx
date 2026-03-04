"use client";

const testimonials = [
    {
        name: "Arjun Mehta",
        role: "Startup Founder",
        text: "Pranav's AI Content Engine saved us hundreds of hours. The quality of generated content is mind-blowing. Best investment we made this year!",
        avatar: "AM",
    },
    {
        name: "Sarah Chen",
        role: "Marketing Manager",
        text: "The automation kit transformed our entire workflow. What used to take our team a week now happens in hours. Absolutely incredible tools.",
        avatar: "SC",
    },
    {
        name: "Rahul Sharma",
        role: "Freelance Developer",
        text: "The Prompt Mastery Guide is a game-changer. My AI outputs went from mediocre to exceptional overnight. Highly recommended for any developer.",
        avatar: "RS",
    },
    {
        name: "Emily Rodriguez",
        role: "Content Creator",
        text: "I've tried dozens of AI tools but Pranav's products are on another level. The attention to detail and the quality of documentation is outstanding.",
        avatar: "ER",
    },
    {
        name: "Vikram Patel",
        role: "Tech Lead",
        text: "Smart Automation Kit is pure gold. The scripts are well-documented, easy to customize, and actually work. Saved me 15+ hours per week.",
        avatar: "VP",
    },
    {
        name: "Lisa Wang",
        role: "E-commerce Owner",
        text: "The AI Image Toolkit revolutionized our product photography. Professional-quality images in seconds. Our conversion rate jumped 40%.",
        avatar: "LW",
    },
];

export default function TestimonialsMarquee() {
    return (
        <section className="section-padding" style={{ overflow: "hidden", position: "relative" }}>
            <div className="container-custom" style={{ marginBottom: 48 }}>
                <div style={{ textAlign: "center" }}>
                    <p
                        style={{
                            fontSize: "0.85rem",
                            color: "#a855f7",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: 8,
                        }}
                    >
                        Testimonials
                    </p>
                    <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800 }}>
                        Loved by <span className="gradient-text">Creators & Builders</span>
                    </h2>
                </div>
            </div>

            {/* Row 1 - left to right */}
            <div style={{ marginBottom: 20 }}>
                <div
                    style={{
                        display: "flex",
                        gap: 20,
                        animation: "marqueeLeft 35s linear infinite",
                        width: "max-content",
                    }}
                >
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <TestimonialCard key={`r1-${i}`} testimonial={t} />
                    ))}
                </div>
            </div>

            {/* Row 2 - right to left */}
            <div>
                <div
                    style={{
                        display: "flex",
                        gap: 20,
                        animation: "marqueeRight 40s linear infinite",
                        width: "max-content",
                    }}
                >
                    {[...[...testimonials].reverse(), ...[...testimonials].reverse()].map((t, i) => (
                        <TestimonialCard key={`r2-${i}`} testimonial={t} />
                    ))}
                </div>
            </div>

            <style jsx global>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
        </section>
    );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
    return (
        <div
            className="glass-card"
            style={{
                padding: 24,
                minWidth: 320,
                maxWidth: 380,
                flexShrink: 0,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
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
                        fontSize: "0.8rem",
                        color: "white",
                        flexShrink: 0,
                    }}
                >
                    {testimonial.avatar}
                </div>
                <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#f1f5f9" }}>{testimonial.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{testimonial.role}</p>
                </div>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.6, fontStyle: "italic" }}>
                &ldquo;{testimonial.text}&rdquo;
            </p>
            <div style={{ marginTop: 12, color: "#eab308", fontSize: "0.8rem", letterSpacing: 2 }}>★★★★★</div>
        </div>
    );
}
