"use client";
import { useState, useEffect } from "react";
import { Rating, addRating, getProductRatings, getUserPurchases } from "@/lib/ratingService";
import { useUser } from "@/context/UserContext";

export default function RatingSection({ productId }: { productId: string }) {
    const { user } = useUser();
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [loading, setLoading] = useState(true);

    const [ratingValue, setRatingValue] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Load ratings
        getProductRatings(productId).then((data) => {
            setRatings(data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
            setLoading(false);
        });

        // Check if user has purchased
        if (user && user.email) {
            getUserPurchases(user.email).then((purchases) => {
                if (purchases.includes(productId)) {
                    setHasPurchased(true);
                }
            });
        }
    }, [productId, user]);

    const averageRating = ratings.length > 0
        ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
        : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.email) return;
        setSubmitting(true);
        try {
            await addRating({
                productId,
                userId: user.uid,
                userEmail: user.email,
                userName: user.name || "Anonymous",
                rating: ratingValue,
                review: reviewText
            });
            setSubmitted(true);
            // Refresh ratings
            const updated = await getProductRatings(productId);
            setRatings(updated.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
        } catch (err) {
            console.error("Error submitting review", err);
            alert("Failed to submit review.");
        }
        setSubmitting(false);
    };

    const hasUserReviewed = user && ratings.some(r => r.userId === user.uid);

    return (
        <div style={{ marginTop: 64 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800 }}>
                    Reviews <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "1.2rem" }}>({ratings.length})</span>
                </h2>
                {ratings.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ display: "flex", gap: 4, color: "#fbbf24", fontSize: "1.2rem" }}>
                            {"★".repeat(Math.round(Number(averageRating)))}
                            {"☆".repeat(5 - Math.round(Number(averageRating)))}
                        </div>
                        <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f8fafc" }}>{averageRating}</span>
                        <span style={{ color: "#94a3b8" }}>/ 5.0</span>
                    </div>
                )}
            </div>

            {loading ? (
                <p style={{ color: "#64748b" }}>Loading reviews...</p>
            ) : (
                <>
                    {/* Review Form for Buyers */}
                    {user ? (
                        hasPurchased ? (
                            !hasUserReviewed ? (
                                !submitted ? (
                                    <div className="glass-card" style={{ padding: 24, marginBottom: 40, border: "1px solid rgba(168,85,247,0.2)" }}>
                                        <h3 style={{ fontWeight: 700, marginBottom: 16, color: "#e2e8f0" }}>Leave a Review</h3>
                                        <form onSubmit={handleSubmit}>
                                            <div style={{ marginBottom: 16 }}>
                                                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: 8 }}>Rating</label>
                                                <div style={{ display: "flex", gap: 8, fontSize: "1.8rem", cursor: "pointer" }}>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            onClick={() => setRatingValue(star)}
                                                            style={{ color: star <= ratingValue ? "#fbbf24" : "#475569", transition: "color 0.2s" }}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: 16 }}>
                                                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: 8 }}>Your Review</label>
                                                <textarea
                                                    required
                                                    value={reviewText}
                                                    onChange={e => setReviewText(e.target.value)}
                                                    placeholder="What did you think about this product?"
                                                    style={{ width: "100%", padding: 16, borderRadius: 12, background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.05)", color: "white", outline: "none", minHeight: 100, resize: "vertical" }}
                                                />
                                            </div>
                                            <button type="submit" className="gradient-btn" disabled={submitting} style={{ padding: "10px 24px", opacity: submitting ? 0.7 : 1 }}>
                                                {submitting ? "Submitting..." : "Submit Review"}
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="glass-card" style={{ padding: 24, marginBottom: 40, textAlign: "center", border: "1px solid rgba(34,211,238,0.2)" }}>
                                        <h3 style={{ color: "#22d3ee", fontWeight: 700, marginBottom: 8 }}>Thank you for your feedback! ✨</h3>
                                        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Your review helps others make better decisions.</p>
                                    </div>
                                )
                            ) : (
                                <div style={{ padding: "16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", marginBottom: 40, border: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem" }}>
                                    You have already reviewed this product.
                                </div>
                            )
                        ) : (
                            <div style={{ padding: "16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", marginBottom: 40, border: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem" }}>
                                🔒 You can leave a review after purchasing this product.
                            </div>
                        )
                    ) : (
                        <div style={{ padding: "16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", marginBottom: 40, border: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem" }}>
                            Please log in and purchase this product to leave a review.
                        </div>
                    )}

                    {/* Display Reviews */}
                    {ratings.length > 0 ? (
                        <div style={{ display: "grid", gap: 16 }}>
                            {ratings.map((r, i) => (
                                <div key={r.id || i} className="glass-card" style={{ padding: 20 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-start" }}>
                                        <div>
                                            <h4 style={{ fontWeight: 600, color: "#e2e8f0" }}>{r.userName}</h4>
                                            <div style={{ display: "flex", gap: 2, color: "#fbbf24", fontSize: "0.9rem", marginTop: 4 }}>
                                                {"★".repeat(r.rating)}
                                                <span style={{ color: "#475569" }}>{"★".repeat(5 - r.rating)}</span>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                            {r.createdAt && r.createdAt.toLocaleDateString ? r.createdAt.toLocaleDateString() : "Recently"}
                                        </span>
                                    </div>
                                    <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6 }}>{r.review}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
                            <div style={{ fontSize: "3rem", marginBottom: 12, opacity: 0.5 }}>⭐</div>
                            <p>No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
