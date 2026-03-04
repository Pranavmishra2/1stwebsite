import { db } from "@/lib/firebase";
import {
    collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp,
} from "firebase/firestore";

export interface Category {
    id?: string;
    name: string;
    slug: string;
    type: "blog" | "product";
    color: string;
    count?: number;
    createdAt: Date;
}

const COLLECTION = "categories";

export async function getCategories(type?: "blog" | "product"): Promise<Category[]> {
    const q = query(collection(db, COLLECTION), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    })) as Category[];
    return type ? categories.filter((c) => c.type === type) : categories;
}

export async function createCategory(data: Omit<Category, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...data, createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}
