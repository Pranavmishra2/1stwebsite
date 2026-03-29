import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://1stwebsite-sigma.vercel.app"; // Using the live Vercel domain

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/dashboard/", "/login/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
