import { prisma } from "../../../lib/prisma"; // Assuming Prisma client is initialized

export async function GET(request, { params }) {
  const { storeId } = params;

  if (!storeId) {
    return new Response(JSON.stringify({ error: "storeId is required" }), {
      status: 400,
    });
  }

  try {
    const category = await prisma.category.findMany({
      where: { storeId: parseInt(storeId, 10) },
      include: { products: true },
    });

    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}



export async function POST(req, context) {
  const params = await context.params;
  const { storeId } = params;

  if (!storeId) {
    return new Response(JSON.stringify({ message: "StoreId is required" }), {
      status: 400,
    });
  }

  const { name, description, parentId } = await req.json();

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        description: description || null,
        storeId: Number(storeId),
        parentId: parentId ? Number(parentId) : null,
      },
    });

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}
