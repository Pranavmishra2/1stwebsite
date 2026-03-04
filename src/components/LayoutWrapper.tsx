"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserProvider } from "@/context/UserContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isAdmin = pathname.startsWith("/admin");
    const isLoginPage = pathname === "/login";

    // Admin pages — render without public Navbar/Footer
    if (isAdmin) {
        return <>{children}</>;
    }

    // Login page — render without Navbar/Footer
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Public pages — show Navbar + Footer (no login required for branding website)
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
