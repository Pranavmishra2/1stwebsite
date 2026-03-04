"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserProvider, useUser } from "@/context/UserContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, loading } = useUser();

    const isAdmin = pathname.startsWith("/admin");
    const isLoginPage = pathname === "/login";

    // Redirect to login if not authenticated (except for admin & login pages)
    useEffect(() => {
        if (!loading && !isAuthenticated && !isAdmin && !isLoginPage) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, isAdmin, isLoginPage, router]);

    // Admin pages — render without public Navbar/Footer
    if (isAdmin) {
        return <>{children}</>;
    }

    // Login page — render without Navbar/Footer
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Loading state
    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f14" }}>
                <div className="gradient-text" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Loading...</div>
            </div>
        );
    }

    // Not authenticated — show nothing while redirecting
    if (!isAuthenticated) {
        return null;
    }

    // Authenticated - show full site
    return (
        <>
            <Navbar />
            <main style={{ minHeight: "100vh", paddingTop: "80px" }}>{children}</main>
            <Footer />
        </>
    );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <LayoutContent>{children}</LayoutContent>
        </UserProvider>
    );
}
