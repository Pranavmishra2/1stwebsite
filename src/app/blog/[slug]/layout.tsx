import { Metadata } from "next";
import { blogPosts } from "@/data/blogs";
import JsonLd, { articleSchema, breadcrumbSchema } from "@/components/JsonLd";

const baseUrl = "https://1stwebsite-sigma.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Article Not Found | LaunchPad",
            description: "The article you're looking for doesn't exist.",
        };
    }

    return {
        title: post.metaTitle || `${post.title} | LaunchPad`,
        description: post.metaDescription || post.excerpt,
        keywords: post.tags,
        alternates: {
            canonical: `${baseUrl}/blog/${post.slug}`,
        },
        openGraph: {
            title: post.metaTitle || post.title,
            description: post.metaDescription || post.excerpt,
            url: `${baseUrl}/blog/${post.slug}`,
            siteName: "LaunchPad",
            type: "article",
            publishedTime: post.date,
            authors: [post.author],
            tags: post.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: post.metaTitle || post.title,
            description: post.metaDescription || post.excerpt,
        },
        authors: [{ name: post.author }],
    };
}

export default async function BlogSlugLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    return (
        <>
            {post && (
                <>
                    <JsonLd data={articleSchema(post, baseUrl)} />
                    <JsonLd
                        data={breadcrumbSchema([
                            { name: "Home", url: baseUrl },
                            { name: "Blog", url: `${baseUrl}/blog` },
                            { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
                        ])}
                    />
                </>
            )}
            {children}
        </>
    );
}
