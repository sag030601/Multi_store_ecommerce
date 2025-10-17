import { prisma } from "../../lib/prisma"; // Assuming Prisma client is initialized

// GET cart by userId
export async function GET({ params }) {
  const { userId } = params;

  const cart = await prisma.cart.findUnique({
    where: { userId: parseInt(userId) },
    include: { cartItems: true },
  });

  return new Response(JSON.stringify(cart), { status: 200 });
}
