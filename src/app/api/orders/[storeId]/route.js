import { prisma } from "../../../lib/prisma"; // Assuming Prisma client is initialized
import Razorpay from "razorpay";

// import { prisma } from "@/lib/prisma";

// GET order details by id
// import { prisma } from "@/app/lib/prisma";

export async function GET(request, { params }) {
  const { storeId } = params;

  if (!storeId) {
    return new Response(JSON.stringify({ error: "storeId is required" }), {
      status: 400,
    });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { storeId: parseInt(storeId, 10) },
      include: { orderItems: true, payments: true },
    });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}

export async function POST(req,{params}) {
  try {
    const {storeId} = params
    const {
      userId,
      total,
      shippingAddress,
      billingAddress,
      orderItems,
    } = await req.json();
    

    // 1️⃣ Create Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // 2️⃣ Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: total,
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        storeId: storeId.toString(),
      },
    });

    // 3️⃣ Save order in your DB (Prisma)
    const newOrder = await prisma.order.create({
      data: {
        userId,
        storeId,
        total,
        status: "PENDING", // new field for tracking
        shippingAddress,
        billingAddress,
        razorpayOrderId: razorpayOrder.id, // store Razorpay order ID
        orderItems: {
          create: orderItems,
        },
      },
      include: { orderItems: true },
    });

    // 4️⃣ Return the combined data (for frontend checkout)
    return new Response(
      JSON.stringify({
        success: true,
        order: newOrder,
        razorpayOrder,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Order creation failed" }),
      { status: 500 }
    );
  }
}
