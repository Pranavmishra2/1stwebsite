import { MetadataRoute } from "next";
import { getProducts } from "@/lib/productService";
import { blogPosts } from "@/data/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://1stwebsite-sigma.vercel.app"; // Using the live Vercel domain

    // Fetch dynamic content
    const products = await getProducts();
    const blogs = blogPosts;

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/store/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "weekly" as "weekly",
        priority: 0.8,
    }));

    const blogUrls = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.date),
        changeFrequency: "monthly" as "monthly",
        priority: 0.6,
    }));

    const staticUrls = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "yearly" as "yearly",
            priority: 1,
        },
        {
            url: `${baseUrl}/store`,
            lastModified: new Date(),
            changeFrequency: "weekly" as "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly" as "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly" as "yearly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: "yearly" as "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: "yearly" as "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: new Date(),
            changeFrequency: "yearly" as "yearly",
            priority: 0.3,
        },
    ];

    return [...staticUrls, ...productUrls, ...blogUrls];
}
