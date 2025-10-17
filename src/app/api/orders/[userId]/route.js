// import { prisma } from "@/lib/prisma";
import { prisma } from "../../../lib/prisma"; // Assuming Prisma client is initialized


// GET order details by id
export async function GET({ params }) {
  const { id } = params;
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { orderItems: true, payments: true },
  });
  return new Response(JSON.stringify(order), { status: 200 });
}

// POST create new order
export async function POST(req) {
  const { userId, storeId, total, shippingAddress, billingAddress, orderItems } = await req.json();
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
