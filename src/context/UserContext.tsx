"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface User {
    uid: string;
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
        uid: fbUser.uid,
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
        // Check for redirect result first (for mobile/browsers that block popups)
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    setUser(mapFirebaseUser(result.user));
                }
            })
            .catch((err) => {
                console.error("Redirect result error:", err);
            });

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
            // Try popup first (works on desktop)
            await signInWithPopup(auth, googleProvider);
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            console.error("Google sign-in popup error:", firebaseError.code, firebaseError.message);

            // If popup blocked or failed, try redirect method
            if (
                firebaseError.code === "auth/popup-blocked" ||
                firebaseError.code === "auth/popup-closed-by-user" ||
                firebaseError.code === "auth/cancelled-popup-request" ||
                firebaseError.code === "auth/unauthorized-domain"
            ) {
                try {
                    await signInWithRedirect(auth, googleProvider);
                } catch (redirectError) {
                    console.error("Redirect sign-in also failed:", redirectError);
                }
            }
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
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
