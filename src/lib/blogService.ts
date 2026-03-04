import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp,
} from "firebase/firestore";

const COLLECTION = "blogs";

export interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    author: string;
    readingTime: string;
    metaTitle?: string;
    metaDescription?: string;
    status: "Published" | "Draft";
    createdAt: Date;
    updatedAt: Date;
}

// Get all blog posts
export async function getBlogs(): Promise<BlogPost[]> {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    })) as BlogPost[];
}

// Get single blog post by slug
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
    const blogs = await getBlogs();
    return blogs.find((b) => b.slug === slug) || null;
}

// Get single blog post by ID
export async function getBlogById(id: string): Promise<BlogPost | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
    } as BlogPost;
}

// Create blog post
export async function createBlog(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return docRef.id;
}

// Update blog post
export async function updateBlog(id: string, data: Partial<BlogPost>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

// Delete blog post
export async function deleteBlog(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}
