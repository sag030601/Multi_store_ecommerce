import { prisma } from "@/app/lib/prisma";

// import { prisma } from "../../lib/prisma"; // Assuming Prisma client is initialized



// POST create a new cart
export async function POST(req) {
  const { userId, storeId } = await req.json();

  const cart = await prisma.cart.create({
    data: {
      userId,
      storeId,
    },
  });

  return new Response(JSON.stringify(cart), { status: 201 });
}
export async function GET (req) {

  const cart = await prisma.cart.findMany();

  return new Response(JSON.stringify(cart), { status: 201 });
}
