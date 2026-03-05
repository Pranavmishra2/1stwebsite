import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "LaunchPad — Digital Products & AI Tools",
  description:
    "LaunchPad is your hub for premium digital products, AI tools, tutorials, and insights on building with automation.",
  keywords: ["LaunchPad", "Digital Products", "AI Tools", "Tech Builder", "Templates"],
  metadataBase: new URL("https://1stwebsite-sigma.vercel.app"), // Using the live Vercel domain
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
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
