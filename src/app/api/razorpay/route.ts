import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, productName, productId } = body;

        if (!amount || !productName) {
            return NextResponse.json({ error: "Amount and product name are required" }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Razorpay expects paise
            currency: "INR",
            receipt: `order_${productId}_${Date.now()}`,
            notes: {
                productName,
                productId,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error: unknown) {
        console.error("Razorpay order creation error:", error);
        const errorMessage = error instanceof Error ? error.message : "Payment failed";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
