import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface SiteSettings {
    siteName: string;
    tagline: string;
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutDescription: string;
    socialLinks: { github?: string; twitter?: string; linkedin?: string; youtube?: string; instagram?: string };
    footerText: string;
    contactEmail: string;
    logoText: string;
}

const DOC_ID = "site_settings";

const defaultSettings: SiteSettings = {
    siteName: "Pranav Kashyap",
    tagline: "AI Developer | Digital Creator | Tech Builder",
    heroTitle: "Hey, I'm Pranav Kashyap",
    heroSubtitle: "I build AI-powered tools, share knowledge through content, and help creators & entrepreneurs leverage technology to grow faster.",
    aboutTitle: "Building the Future with AI",
    aboutDescription: "I'm Pranav Kashyap — an AI developer, digital creator, and tech entrepreneur focused on building tools that make technology accessible and powerful for everyone.",
    socialLinks: { github: "#", twitter: "#", linkedin: "#", youtube: "#", instagram: "#" },
    footerText: "© 2025 Pranav Kashyap. All rights reserved.",
    contactEmail: "hello@pranavkashyap.com",
    logoText: "PK",
};

export async function getSiteSettings(): Promise<SiteSettings> {
    const docRef = doc(db, "settings", DOC_ID);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return defaultSettings;
    return { ...defaultSettings, ...docSnap.data() } as SiteSettings;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
    const docRef = doc(db, "settings", DOC_ID);
    await setDoc(docRef, data, { merge: true });
}
