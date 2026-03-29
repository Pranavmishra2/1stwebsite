/* eslint-disable @typescript-eslint/no-explicit-any */

interface JsonLdProps {
    data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// ===== Schema Generators =====

export function websiteSchema(baseUrl: string) {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "LaunchPad",
        url: baseUrl,
        description: "Your hub for premium digital products, AI tools, tutorials, and insights on building with automation.",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${baseUrl}/blog?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function organizationSchema(baseUrl: string) {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "LaunchPad",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: [],
        contactPoint: {
            "@type": "ContactPoint",
            email: "launchpadaidev@gmail.com",
            contactType: "customer support",
        },
    };
}

export function articleSchema(post: {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    author: string;
    readingTime: string;
    category: string;
    tags: string[];
    metaDescription: string;
}, baseUrl: string) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.metaDescription || post.excerpt,
        url: `${baseUrl}/blog/${post.slug}`,
        datePublished: post.date,
        dateModified: post.date,
        author: {
            "@type": "Person",
            name: post.author,
        },
        publisher: {
            "@type": "Organization",
            name: "LaunchPad",
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/logo.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${baseUrl}/blog/${post.slug}`,
        },
        keywords: post.tags.join(", "),
        articleSection: post.category,
    };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function productSchema(product: {
    name: string;
    tagline: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    slug: string;
    badge?: string;
}, baseUrl: string) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || product.tagline,
        url: `${baseUrl}/store/${product.slug}`,
        category: product.category,
        brand: {
            "@type": "Brand",
            name: "LaunchPad",
        },
        offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${baseUrl}/store/${product.slug}`,
            ...(product.originalPrice ? {
                priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
            } : {}),
        },
    };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
    if (!faqs || faqs.length === 0) return null;
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}
