import { db } from "@/lib/firebase";
import {
    collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp, where,
} from "firebase/firestore";

export interface Subscriber {
    id?: string;
    email: string;
    name?: string;
    status: "active" | "unsubscribed";
    subscribedAt: Date;
}

export interface Coupon {
    id?: string;
    code: string;
    discount: number;
    type: "percentage" | "fixed";
    maxUses: number;
    usedCount: number;
    active: boolean;
    expiresAt: Date | null;
    createdAt: Date;
}

export interface Notification {
    id?: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "order";
    read: boolean;
    createdAt: Date;
}

// ===== NEWSLETTER =====
export async function getSubscribers(): Promise<Subscriber[]> {
    const q = query(collection(db, "subscribers"), orderBy("subscribedAt", "desc"));
    const s = await getDocs(q);
    return s.docs.map((d) => ({ id: d.id, ...d.data(), subscribedAt: d.data().subscribedAt?.toDate?.() || new Date() })) as Subscriber[];
}

export async function addSubscriber(email: string, name?: string): Promise<string> {
    const docRef = await addDoc(collection(db, "subscribers"), {
        email, name: name || "", status: "active", subscribedAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateSubscriberStatus(id: string, status: "active" | "unsubscribed"): Promise<void> {
    await updateDoc(doc(db, "subscribers", id), { status });
}

export async function deleteSubscriber(id: string): Promise<void> {
    await deleteDoc(doc(db, "subscribers", id));
}

// ===== COUPONS =====
export async function getCoupons(): Promise<Coupon[]> {
    const q = query(collection(db, "coupons"), orderBy("createdAt", "desc"));
    const s = await getDocs(q);
    return s.docs.map((d) => ({
        id: d.id, ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() || new Date(),
        expiresAt: d.data().expiresAt?.toDate?.() || null,
    })) as Coupon[];
}

export async function createCoupon(data: Omit<Coupon, "id" | "createdAt" | "usedCount">): Promise<string> {
    const docRef = await addDoc(collection(db, "coupons"), {
        ...data, usedCount: 0, expiresAt: data.expiresAt ? Timestamp.fromDate(data.expiresAt) : null,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<void> {
    await updateDoc(doc(db, "coupons", id), data);
}

export async function deleteCoupon(id: string): Promise<void> {
    await deleteDoc(doc(db, "coupons", id));
}

// ===== NOTIFICATIONS =====
export async function getNotifications(): Promise<Notification[]> {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const s = await getDocs(q);
    return s.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() || new Date() })) as Notification[];
}

export async function addNotification(data: Omit<Notification, "id" | "createdAt" | "read">): Promise<void> {
    await addDoc(collection(db, "notifications"), { ...data, read: false, createdAt: Timestamp.now() });
}

export async function markNotificationRead(id: string): Promise<void> {
    await updateDoc(doc(db, "notifications", id), { read: true });
}

export async function markAllNotificationsRead(): Promise<void> {
    const q = query(collection(db, "notifications"), where("read", "==", false));
    const s = await getDocs(q);
    const promises = s.docs.map((d) => updateDoc(doc(db, "notifications", d.id), { read: true }));
    await Promise.all(promises);
}

export async function deleteNotification(id: string): Promise<void> {
    await deleteDoc(doc(db, "notifications", id));
}
