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
    siteName: "LaunchPad",
    tagline: "Your Digital Product Hub",
    heroTitle: "Welcome to LaunchPad",
    heroSubtitle: "Discover premium tools, in-depth tech guides, and resources designed to accelerate your growth.",
    aboutTitle: "Building the Future with AI", // Kept this field
    aboutDescription: "LaunchPad is your all-in-one platform for high-quality digital assets, tech tutorials, and automation tools. Built to help creators and developers build faster and smarter.",
    socialLinks: { github: "#", twitter: "#", linkedin: "#", youtube: "#", instagram: "#" }, // Kept this field
    footerText: "© 2025 LaunchPad. Built for Creators.",
    contactEmail: "hello@launchpad.dev",
    logoText: "PK", // Kept this field
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
