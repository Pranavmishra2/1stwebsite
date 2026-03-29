import { Metadata } from "next";

const baseUrl = "https://1stwebsite-sigma.vercel.app";

export const metadata: Metadata = {
    title: "Store — Premium AI Tools & Digital Products | LaunchPad",
    description:
        "Browse and buy premium AI tools, automation kits, templates, and digital products on LaunchPad. Supercharge your productivity with cutting-edge resources.",
    keywords: [
        "AI tools", "digital products", "automation kits", "premium templates",
        "AI productivity tools", "LaunchPad store", "buy AI tools India",
    ],
    alternates: {
        canonical: `${baseUrl}/store`,
    },
    openGraph: {
        title: "Store — Premium AI Tools & Digital Products | LaunchPad",
        description: "Browse premium AI tools, automation kits, and digital products.",
        url: `${baseUrl}/store`,
        siteName: "LaunchPad",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Store — Premium AI Tools & Digital Products | LaunchPad",
        description: "Browse premium AI tools, automation kits, and digital products.",
    },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
