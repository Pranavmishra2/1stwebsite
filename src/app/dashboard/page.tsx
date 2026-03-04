"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getUserOrders, Order } from "@/lib/orderService";
import { getProductById, Product } from "@/lib/productService";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EnrichedOrder extends Order {
    productDetails?: Product | null;
}

export default function UserDashboard() {
    const { user, loading, loginWithGoogle } = useUser();
    const router = useRouter();
    const [orders, setOrders] = useState<EnrichedOrder[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
            return;
        }

        if (user && user.email) {
            fetchOrders();
        }
    }, [user, loading, router]);

    const fetchOrders = async () => {
        setFetching(true);
        try {
            const userOrders = await getUserOrders(user!.email!);

            // Fetch product details for each order to get
            // the download URL and image/category details if we wanted to
            const enriched = await Promise.all(
                userOrders.map(async (o) => {
                    const productDetails = await getProductById(o.productId);
                    return { ...o, productDetails };
                })
            );

            setOrders(enriched);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setFetching(false);
        }
    };

    if (loading || fetching) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#94a3b8" }}>Loading dashboard...</p>
            </div>
        );
    }

    if (!user) return null; // handled by router push

    return (
        <div className="container-custom" style={{ paddingTop: 100, paddingBottom: 100, minHeight: "100vh" }}>
            <div style={{ marginBottom: 40, display: "flex", alignItems: "center", gap: 20 }}>
                {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid #a855f7" }} />
                ) : (
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold" }}>
                        {user.avatar}
                    </div>
                )}
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Welcome, {user.name}</h1>
                    <p style={{ color: "#94a3b8" }}>{user.email}</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 40, minHeight: 400 }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>
                    My Purchases
                </h2>

                {orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <div style={{ fontSize: "4rem", opacity: 0.5, marginBottom: 16 }}>🛍️</div>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>No purchases yet</h3>
                        <p style={{ color: "#94a3b8", marginBottom: 24 }}>When you buy digital products, they will appear here forever.</p>
                        <Link href="/store" className="gradient-btn-outline" style={{ display: "inline-block" }}>
                            Explore Store
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                        {orders.map((order) => (
                            <div key={order.id} style={{ padding: 20, borderRadius: 16, background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                                <div>
                                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                                        {order.productName}
                                    </h3>
                                    <div style={{ display: "flex", gap: 16, fontSize: "0.85rem", color: "#64748b" }}>
                                        <span>Order Date: {order.createdAt.toLocaleDateString()}</span>
                                        <span>Amount: ₹{order.amount}</span>
                                        <span style={{ color: "#22c55e" }}>Paid ✓</span>
                                    </div>
                                </div>
                                <div>
                                    {order.productDetails?.downloadUrl ? (
                                        <a
                                            href={order.productDetails.downloadUrl}
                                            className="gradient-btn"
                                            style={{ padding: "10px 20px", display: "inline-block", fontSize: "0.95rem" }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            📥 Download Again
                                        </a>
                                    ) : (
                                        <span style={{ fontSize: "0.9rem", color: "#fbbf24", padding: "8px 16px", borderRadius: 8, background: "rgba(251, 191, 36, 0.1)" }}>
                                            Contact Support for Link
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
