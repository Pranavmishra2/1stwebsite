import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isValid = expectedSignature === razorpay_signature;

        if (isValid) {
            return NextResponse.json({ verified: true, message: "Payment verified successfully" });
        } else {
            return NextResponse.json({ verified: false, error: "Invalid payment signature" }, { status: 400 });
        }
    } catch (error: unknown) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
