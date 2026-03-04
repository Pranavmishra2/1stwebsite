import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Pranav Kashyap — AI Developer | Digital Creator | Tech Builder",
  description:
    "Pranav Kashyap's personal brand website — AI tools, digital products, tutorials, and insights on building with AI and automation.",
  keywords: ["Pranav Kashyap", "AI Developer", "Digital Products", "Tech Builder", "AI Tools"],
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
