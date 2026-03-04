import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://pranavkashyap.com"; // Change to actual domain

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/dashboard/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
