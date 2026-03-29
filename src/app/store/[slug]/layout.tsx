import { Metadata } from "next";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

const baseUrl = "https://1stwebsite-sigma.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    // Products are fetched from Firestore (client-side), so we generate a descriptive base metadata
    const readableTitle = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return {
        title: `${readableTitle} — AI Tool | LaunchPad Store`,
        description: `Get ${readableTitle} on LaunchPad — a premium AI-powered digital product to boost your productivity. Secure payment via Razorpay.`,
        alternates: {
            canonical: `${baseUrl}/store/${slug}`,
        },
        openGraph: {
            title: `${readableTitle} | LaunchPad Store`,
            description: `Premium AI tool: ${readableTitle}. Buy now on LaunchPad.`,
            url: `${baseUrl}/store/${slug}`,
            siteName: "LaunchPad",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${readableTitle} | LaunchPad Store`,
            description: `Premium AI tool: ${readableTitle}. Buy now on LaunchPad.`,
        },
    };
}

export default async function StoreSlugLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const readableTitle = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return (
        <>
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Home", url: baseUrl },
                    { name: "Store", url: `${baseUrl}/store` },
                    { name: readableTitle, url: `${baseUrl}/store/${slug}` },
                ])}
            />
            {children}
        </>
    );
}
