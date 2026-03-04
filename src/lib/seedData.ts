import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { blogPosts } from "@/data/blogs";
import { products } from "@/data/products";

/**
 * Seed initial data to Firestore from mock data files.
 * Run this once to populate the database, then use Firestore services.
 * Call seedAll() from browser console or a temporary page.
 */
export async function seedBlogs() {
    console.log("🌱 Seeding blogs...");
    for (const post of blogPosts) {
        await addDoc(collection(db, "blogs"), {
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            tags: post.tags,
            author: post.author,
            readingTime: post.readingTime,
            status: "Published",
            createdAt: Timestamp.fromDate(new Date(post.date)),
            updatedAt: Timestamp.now(),
        });
        console.log(`  ✅ ${post.title}`);
    }
    console.log("✅ All blogs seeded!");
}

export async function seedProducts() {
    console.log("🌱 Seeding products...");
    for (const product of products) {
        await addDoc(collection(db, "products"), {
            name: product.name,
            slug: product.slug,
            tagline: product.tagline,
            description: product.description,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice || null,
            badge: product.badge || null,
            features: product.features,
            faqs: product.faqs,
            status: "Active",
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        console.log(`  ✅ ${product.name}`);
    }
    console.log("✅ All products seeded!");
}

export async function seedAll() {
    await seedBlogs();
    await seedProducts();
    console.log("🎉 Database seeded successfully!");
}
