"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    ConfirmationResult,
    User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface User {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    photoURL: string;
    phone: string;
}

interface UserContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    sendOTP: (phoneNumber: string) => Promise<boolean>;
    verifyOTP: (otp: string) => Promise<boolean>;
    logout: () => Promise<void>;
    phoneError: string;
    phoneLoading: boolean;
    otpSent: boolean;
    setOtpSent: (v: boolean) => void;
    setPhoneError: (v: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

function mapFirebaseUser(fbUser: FirebaseUser): User {
    return {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.phoneNumber || "User",
        email: fbUser.email || "",
        avatar: (fbUser.displayName || fbUser.phoneNumber || "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        photoURL: fbUser.photoURL || "",
        phone: fbUser.phoneNumber || "",
    };
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [phoneError, setPhoneError] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const confirmationResultRef = useRef<ConfirmationResult | null>(null);
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

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

    const setupRecaptcha = useCallback(() => {
        if (recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current.clear();
            recaptchaVerifierRef.current = null;
        }
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => {
                // reCAPTCHA solved
            },
            "expired-callback": () => {
                setPhoneError("reCAPTCHA expired. Please try again.");
            },
        });
        return recaptchaVerifierRef.current;
    }, []);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            console.error("Google sign-in popup error:", firebaseError.code, firebaseError.message);

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

    const sendOTP = async (phoneNumber: string): Promise<boolean> => {
        setPhoneError("");
        setPhoneLoading(true);
        try {
            const recaptchaVerifier = setupRecaptcha();
            const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
            confirmationResultRef.current = result;
            setOtpSent(true);
            setPhoneLoading(false);
            return true;
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            console.error("Send OTP error:", firebaseError.code, firebaseError.message);
            let msg = "Failed to send OTP. Please try again.";
            if (firebaseError.code === "auth/invalid-phone-number") {
                msg = "Invalid phone number. Use format: +91XXXXXXXXXX";
            } else if (firebaseError.code === "auth/too-many-requests") {
                msg = "Too many requests. Please wait and try again.";
            } else if (firebaseError.code === "auth/captcha-check-failed") {
                msg = "reCAPTCHA verification failed. Please reload.";
            }
            setPhoneError(msg);
            setPhoneLoading(false);
            // Reset recaptcha on error
            if (recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current.clear();
                recaptchaVerifierRef.current = null;
            }
            return false;
        }
    };

    const verifyOTP = async (otp: string): Promise<boolean> => {
        setPhoneError("");
        setPhoneLoading(true);
        try {
            if (!confirmationResultRef.current) {
                setPhoneError("Session expired. Please send OTP again.");
                setPhoneLoading(false);
                return false;
            }
            await confirmationResultRef.current.confirm(otp);
            setPhoneLoading(false);
            setOtpSent(false);
            return true;
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            console.error("Verify OTP error:", firebaseError.code, firebaseError.message);
            let msg = "Invalid OTP. Please try again.";
            if (firebaseError.code === "auth/code-expired") {
                msg = "OTP expired. Please request a new one.";
            }
            setPhoneError(msg);
            setPhoneLoading(false);
            return false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setOtpSent(false);
            confirmationResultRef.current = null;
        } catch (error: unknown) {
            const firebaseError = error as { message?: string };
            console.error("Logout error:", firebaseError.message);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                loginWithGoogle,
                sendOTP,
                verifyOTP,
                logout,
                phoneError,
                phoneLoading,
                otpSent,
                setOtpSent,
                setPhoneError,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
}
