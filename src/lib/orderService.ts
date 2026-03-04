import { db } from "@/lib/firebase";
import {
    collection, doc, getDocs, addDoc, updateDoc, query, orderBy, where, Timestamp, getDoc,
} from "firebase/firestore";

export interface Order {
    id?: string;
    orderId: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
    productId: string;
    productName: string;
    amount: number;
    currency: string;
    status: "created" | "paid" | "failed" | "refunded";
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    createdAt: Date;
    paidAt?: Date;
}

const COLLECTION = "orders";

export async function getOrders(): Promise<Order[]> {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() || new Date(),
        paidAt: d.data().paidAt?.toDate?.() || null,
    })) as Order[];
}

export async function getUserOrders(email: string): Promise<Order[]> {
    const q = query(collection(db, COLLECTION), where("customerEmail", "==", email), where("status", "==", "paid"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() || new Date(),
        paidAt: d.data().paidAt?.toDate?.() || null,
    })) as Order[];
}

export async function createOrder(data: Omit<Order, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateOrderStatus(
    id: string,
    status: Order["status"],
    paymentDetails?: { razorpayPaymentId: string; razorpayOrderId: string; razorpaySignature: string }
): Promise<void> {
    const updateData: Record<string, unknown> = { status };
    if (paymentDetails) {
        updateData.razorpayPaymentId = paymentDetails.razorpayPaymentId;
        updateData.razorpayOrderId = paymentDetails.razorpayOrderId;
        updateData.razorpaySignature = paymentDetails.razorpaySignature;
        updateData.paidAt = Timestamp.now();
    }
    await updateDoc(doc(db, COLLECTION, id), updateData);
}

export async function getOrderById(id: string): Promise<Order | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data(), createdAt: docSnap.data().createdAt?.toDate?.() || new Date() } as Order;
}
