import { prisma } from "../../../lib/prisma"; // Assuming Prisma client is initialized
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

// POST create new order
export async function POST(req) {
  const {
    userId,
    storeId,
    total,
    shippingAddress,
    billingAddress,
    orderItems,
  } = await req.json();
  const newOrder = await prisma.order.create({
    data: {
      userId,
      storeId,
      total,
      shippingAddress,
      billingAddress,
      orderItems: {
        create: orderItems,
      },
    },
    include: { orderItems: true },
  });
  return new Response(JSON.stringify(newOrder), { status: 201 });
}
