import { prisma } from "../../lib/prisma";// Assuming Prisma client is initialized

// POST create a new payment
export async function POST(req) {
  const { orderId, paymentMethod, amount, transactionId } = await req.json();

  const payment = await prisma.payment.create({
    data: {
      orderId,
      paymentMethod,
      amount,
      transactionId,
    },
  });

  return new Response(JSON.stringify(payment), { status: 201 });
}



// GET orders by user ID
export async function GET({ params }) {
  const { userId } = params;

  const orders = await prisma.order.findMany({
    where: { userId: parseInt(userId) },
    include: { orderItems: true },
  });

  return new Response(JSON.stringify(orders), { status: 200 });
}
