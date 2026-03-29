import { Metadata } from "next";

const baseUrl = "https://1stwebsite-sigma.vercel.app";

export const metadata: Metadata = {
    title: "Blog — AI, Automation & Tech Insights | LaunchPad",
    description:
        "Read expert articles on AI, automation, Python, digital products, and tech entrepreneurship. Learn how to build faster and smarter with LaunchPad.",
    keywords: [
        "AI blog", "automation tutorials", "Python automation", "tech insights",
        "digital products blog", "AI tools", "LaunchPad blog", "machine learning articles",
    ],
    alternates: {
        canonical: `${baseUrl}/blog`,
    },
    openGraph: {
        title: "Blog — AI, Automation & Tech Insights | LaunchPad",
        description: "Expert articles on AI, automation, and building digital products.",
        url: `${baseUrl}/blog`,
        siteName: "LaunchPad",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog — AI, Automation & Tech Insights | LaunchPad",
        description: "Expert articles on AI, automation, and building digital products.",
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
