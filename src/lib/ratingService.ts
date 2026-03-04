import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";

export interface Rating {
    id?: string;
    productId: string;
    userId: string;
    userEmail: string;
    userName: string;
    rating: number;
    review: string;
    createdAt: Date;
}

export async function addRating(data: Omit<Rating, "id" | "createdAt">): Promise<void> {
    await addDoc(collection(db, "ratings"), { ...data, createdAt: Timestamp.now() });
}

export async function getProductRatings(productId: string): Promise<Rating[]> {
    const q = query(collection(db, "ratings"), where("productId", "==", productId));
    const s = await getDocs(q);
    return s.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() || new Date() })) as Rating[];
}

export async function getUserPurchases(userEmail: string): Promise<string[]> {
    const q = query(collection(db, "orders"), where("customerEmail", "==", userEmail), where("status", "==", "paid"));
    const s = await getDocs(q);
    return s.docs.map((d) => d.data().productId);
}
