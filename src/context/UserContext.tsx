"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface User {
    name: string;
    email: string;
    avatar: string;
    photoURL: string;
}

interface UserContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

function mapFirebaseUser(fbUser: FirebaseUser): User {
    return {
        name: fbUser.displayName || "User",
        email: fbUser.email || "",
        avatar: (fbUser.displayName || "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        photoURL: fbUser.photoURL || "",
    };
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for Firebase auth state changes (auto-login on refresh)
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(mapFirebaseUser(firebaseUser));
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // onAuthStateChanged will handle setting the user
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            console.error("Google sign-in error:", firebaseError.message);
            // Don't throw - let the UI handle gracefully
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // onAuthStateChanged will handle clearing the user
        } catch (error: unknown) {
            const firebaseError = error as { message?: string };
            console.error("Logout error:", firebaseError.message);
        }
    };

    return (
        <UserContext.Provider value={{ user, isAuthenticated: !!user, loading, loginWithGoogle, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
}
