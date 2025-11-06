import crypto from "crypto";
import { NextResponse } from "next/server";
// Optional: import your Prisma client if you want to save orders
// import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      cartItems,
      total,
      shippingAddress,
      billingAddress,
    } = await req.json();

    // 1️⃣ Generate expected signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 2️⃣ Compare signatures
    if (generated_signature === razorpay_signature) {
      // ✅ Payment is valid

      // Optional: Save order to database
      
      const newOrder = await prisma.order.create({
        data: {
          userId,
          total,
          shippingAddress,
          billingAddress,
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          paymentStatus: "PAID",
        },
        include: { orderItems: true },
      });
      

      return NextResponse.json({ success: true, message: "Payment verified!" });
    } else {
      return NextResponse.json({ success: false, message: "Payment verification failed!" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
