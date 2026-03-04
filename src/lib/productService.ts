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

const COLLECTION = "products";

export interface Product {
    id?: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    category: string;
    price: number;
    originalPrice?: number;
    badge?: string;
    features: string[];
    faqs: { question: string; answer: string }[];
    status: "Active" | "Draft";
    createdAt: Date;
    updatedAt: Date;
}

// Get all products
export async function getProducts(): Promise<Product[]> {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    })) as Product[];
}

// Get single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
    const products = await getProducts();
    return products.find((p) => p.slug === slug) || null;
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
    } as Product;
}

// Create product
export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
    return docRef.id;
}

// Update product
export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}
