import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import JsonLd, { websiteSchema, organizationSchema } from "@/components/JsonLd";

const baseUrl = "https://1stwebsite-sigma.vercel.app";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: {
    default: "LaunchPad — Premium Digital Products & AI Tools",
    template: "%s | LaunchPad",
  },
  description:
    "LaunchPad is your hub for premium digital products, AI tools, tutorials, and insights on building with automation. Explore AI-powered tools, read expert articles, and supercharge your productivity.",
  keywords: [
    "LaunchPad", "Digital Products", "AI Tools", "Tech Builder", "Templates",
    "AI automation", "productivity tools", "buy AI tools India", "digital product store",
    "Python automation", "tech blog", "AI tutorials", "machine learning tools",
    "Pranav Kashyap", "LaunchPad AI", "premium digital products",
  ],
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://1stwebsite-sigma.vercel.app",
    siteName: "LaunchPad",
    title: "LaunchPad — Digital Products & AI Tools",
    description: "Explore premium digital products, AI tools, and tech insights on LaunchPad.",
    images: [
      {
        url: "/og-image.png", // We will create a placeholder for this or use a default image path
        width: 1200,
        height: 630,
        alt: "Pranav Kashyap — Personal Brand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPad — Digital Products & AI Tools",
    description: "Explore premium digital products, AI tools, and tech insights on LaunchPad.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LaunchPad",
  },
  icons: {
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0f0f14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={websiteSchema(baseUrl)} />
        <JsonLd data={organizationSchema(baseUrl)} />
      </head>
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
