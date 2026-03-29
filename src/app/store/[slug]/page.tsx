"use client";
import Link from "next/link";
import { useState, use, useEffect } from "react";
import { createOrder, updateOrderStatus, getUserOrders } from "@/lib/orderService";
import { getProductBySlug, Product as DbProduct } from "@/lib/productService";
import RatingSection from "@/components/RatingSection";
import { useUser } from "@/context/UserContext";
import { productSchema, faqSchema } from "@/components/JsonLd";

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: { name: string; email: string };
    theme: { color: string };
    modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
    open: () => void;
    on: (event: string, handler: (response: any) => void) => void;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

const baseUrl = "https://1stwebsite-sigma.vercel.app";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { user, loginWithGoogle } = useUser();
    const [product, setProduct] = useState<DbProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [buying, setBuying] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");
    const [hasPurchased, setHasPurchased] = useState(false);

    useEffect(() => {
        getProductBySlug(slug).then((data) => {
            setProduct(data);
            setLoading(false);
        });
    }, [slug]);

    useEffect(() => {
        if (user && user.email && product) {
            // Check if user has already bought this product
            getUserOrders(user.email).then(orders => {
                const alreadyBought = orders.some(o => o.productId === product.id && o.status === "paid");
                setHasPurchased(alreadyBought);
            }).catch(err => console.error("Error checking purchases:", err));
        } else {
            setHasPurchased(false);
        }
    }, [user, product]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p className="gradient-text" style={{ fontSize: "1.2rem", fontWeight: 700 }}>Loading product...</p>
            </div>
        );
    }

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

    const handleBuyNow = async () => {
        if (!user) {
            alert("Please sign in to continue with your purchase.");
            await loginWithGoogle();
            return;
        }

        console.log("handleBuyNow triggered");
        setBuying(true);
        setPaymentStatus("idle");
        try {
            // 1. Create Razorpay order on server
            console.log("Fetching /api/razorpay with amount:", product.price);
            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: product.price, productName: product.name, productId: product.id || "" }),
            });
            const data = await res.json();
            console.log("Server response:", res.status, data);
            if (!res.ok) throw new Error(data.error);

            // 2. Save order in Firestore
            console.log("Saving order to Firestore...");
            const firestoreOrderId = await createOrder({
                orderId: data.orderId,
                productId: product.id || "",
                productName: product.name,
                amount: product.price,
                currency: "INR",
                status: "created",
                customerName: user.name || "Customer",
                customerEmail: user.email,
            });
            console.log("Firestore order created:", firestoreOrderId);

            // 3. Load Razorpay checkout script safely
            console.log("Loading Razorpay SDK...");
            const loadScript = () => new Promise((resolve, reject) => {
                const existingScript = document.getElementById("razorpay-checkout-js");
                if (existingScript) return resolve(true);
                const script = document.createElement("script");
                script.id = "razorpay-checkout-js";
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => resolve(true);
                script.onerror = () => reject(new Error("Failed to load Razorpay SDK. Please check your internet connection or adblocker."));
                document.body.appendChild(script);
            });

            await loadScript();
            console.log("Razorpay SDK loaded.");

            if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                console.error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID");
                alert("Razorpay API Key is missing. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID to your environment.");
                setBuying(false);
                return;
            }

            console.log("Initializing Razorpay with key:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 8) + "...");


            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "LaunchPad",
                description: product.name,
                order_id: data.orderId,
                handler: async (response: RazorpayResponse) => {
                    // 4. Verify payment on server
                    const verifyRes = await fetch("/api/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...response,
                            customerEmail: user?.email,
                            customerName: user?.name,
                            productName: product.name,
                            downloadUrl: product.downloadUrl && product.downloadUrl.startsWith("http")
                                ? product.downloadUrl
                                : `${window.location.origin}${product.downloadUrl ? product.downloadUrl : "/dashboard"}`
                        }),
                    });
                    const verifyData = await verifyRes.json();

                    if (verifyData.verified) {
                        // 5. Update order in Firestore
                        await updateOrderStatus(firestoreOrderId, "paid", {
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        setPaymentStatus("success");
                    } else {
                        await updateOrderStatus(firestoreOrderId, "failed");
                        setPaymentStatus("failed");
                        alert("Payment verification failed! Please contact support if amount was deducted.");
                    }
                    setBuying(false);
                },
                prefill: { name: user.name || "", email: user.email || "" },
                theme: { color: "#6366f1" },
                modal: {
                    ondismiss: () => {
                        setBuying(false);
                    },
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                console.error(response.error);
                setPaymentStatus("failed");
                setBuying(false);
            });
            rzp.open();
        } catch (err: any) {
            console.error("Payment error:", err);
            alert(err.message || "Something went wrong. Please try again.");
            setPaymentStatus("failed");
            setBuying(false);
        }
    };

    // Payment success screen
    if (paymentStatus === "success") {
        return (
            <div className="container-custom" style={{ padding: "100px 0", textAlign: "center", minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "5rem", marginBottom: 24, animation: "bounce 2s infinite" }}>🎉</div>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 12 }}>
                    Payment <span className="gradient-text">Successful!</span>
                </h1>
                <p style={{ color: "#94a3b8", maxWidth: 450, margin: "0 auto 24px", lineHeight: 1.6, fontSize: "1.1rem" }}>
                    Thank you for purchasing <strong style={{ color: "#f1f5f9" }}>{product.name}</strong>. Your order has been confirmed and the product is ready.
                </p>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
                    {product.downloadUrl ? (
                        <a
                            // If base64 or URL, use it directly
                            href={product.downloadUrl}
                            download={product.name}
                            className="gradient-btn"
                            style={{ padding: "16px 32px", fontSize: "1.2rem", boxShadow: "0 10px 30px -10px rgba(168, 85, 247, 0.5)" }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span style={{ marginRight: 10 }}>📥</span>
                            Download Product
                        </a>
                    ) : (
                        <div style={{ padding: "16px 32px", borderRadius: 50, background: "rgba(34,211,238,0.1)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.2)" }}>
                            ✉️ Check your email for access instructions
                        </div>
                    )}
                </div>
                <div style={{ marginTop: 48 }}>
                    <Link href="/store" className="gradient-btn-outline" style={{ border: "none" }}>← Back to Store</Link>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                `}} />
            </div>
        );
    }

    return (
        <>
            {/* Product JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema(product, baseUrl)) }}
            />
            {/* FAQ JSON-LD */}
            {product.faqs && product.faqs.length > 0 && (() => {
                const schema = faqSchema(product.faqs);
                return schema ? (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                    />
                ) : null;
            })()}
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
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(24px, 5vw, 48px)", alignItems: "start" }}>
                        {/* Image */}
                        <div>
                            <div
                                className="glass-card"
                                style={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))", position: "relative", overflow: "hidden" }}
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
                                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#22d3ee" }}>₹{product.price}</span>
                                    {product.originalPrice && (
                                        <>
                                            <span style={{ fontSize: "1.1rem", color: "#475569", textDecoration: "line-through" }}>₹{product.originalPrice}</span>
                                            <span style={{ padding: "4px 12px", borderRadius: 50, fontSize: "0.75rem", fontWeight: 600, background: "rgba(34, 211, 238, 0.1)", color: "#22d3ee", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
                                                {discount}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                                {hasPurchased ? (
                                    <a
                                        href={product.downloadUrl || "/dashboard"}
                                        className="gradient-btn"
                                        style={{ width: "100%", padding: 16, fontSize: "1rem", display: "inline-block", textAlign: "center", textDecoration: "none" }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        📥 Download Again
                                    </a>
                                ) : (
                                    <button
                                        className="gradient-btn w-full shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] hover:shadow-[0_0_60px_-15px_rgba(168,85,247,0.7)]"
                                        onClick={handleBuyNow}
                                        disabled={buying}
                                        style={{ width: "100%", padding: 16, fontSize: "1rem", opacity: buying ? 0.6 : 1, cursor: buying ? "wait" : "pointer" }}
                                    >
                                        {buying ? "⏳ Processing..." : `🛒 Buy Now — ₹${product.price}`}
                                    </button>
                                )}
                                <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#475569", marginTop: 12 }}>
                                    🔒 Secure Razorpay payment · UPI · Cards · Net Banking
                                </p>

                                {paymentStatus === "failed" && (
                                    <div style={{ marginTop: 12, padding: "10px 16px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "0.85rem", textAlign: "center" }}>
                                        ⚠️ Payment failed. Please try again.
                                    </div>
                                )}
                            </div>

                            {/* Features list */}
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
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))", gap: 12 }}>
                        {product.features.map((feature, i) => (
                            <div key={i} className="glass-card" style={{ padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 12 }}>
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
                                <div key={i} className="glass-card" style={{ padding: 0, overflow: "hidden", cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#e2e8f0" }}>{faq.question}</p>
                                        <span style={{ color: "#a855f7", fontSize: "1.2rem", transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>▾</span>
                                    </div>
                                    {openFaq === i && (
                                        <div style={{ padding: "0 24px 18px", color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>{faq.answer}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Ratings & Reviews */}
            <section style={{ padding: "40px 0 80px" }}>
                <div className="container-custom" style={{ maxWidth: 800 }}>
                    <RatingSection productId={product.id || ""} />
                </div>
            </section>

            {/* Bottom CTA */}
            <section style={{ padding: "60px 0 80px", background: "rgba(22, 22, 29, 0.4)" }}>
                <div className="container-custom" style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 16 }}>
                        Ready to Get <span className="gradient-text">{product.name}?</span>
                    </h2>
                    <p style={{ color: "#64748b", maxWidth: 500, margin: "0 auto 32px" }}>
                        Join 1000+ users who are already leveraging this tool to supercharge their workflow.
                    </p>
                    <button className="gradient-btn" onClick={handleBuyNow} disabled={buying} style={{ padding: "16px 48px", fontSize: "1.05rem", opacity: buying ? 0.6 : 1 }}>
                        {buying ? "⏳ Processing..." : `🛒 Buy Now — ₹${product.price}`}
                    </button>
                </div>
            </section>
        </>
    );
}
