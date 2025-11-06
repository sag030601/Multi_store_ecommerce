// import { prisma } from "../../lib/prisma";// Assuming Prisma client is initialized
import { prisma } from "../../lib/prisma"; // Assuming Prisma client is initialized

// POST create a new category
export async function POST(req) {
  const { name, description, storeId, parentId } = await req.json();

  const category = await prisma.category.create({
    data: {
      name,
      description,
      storeId,
      parentId,
    },
  });

  return new Response(JSON.stringify(category), { status: 201 });
}

// GET categories by store ID
export async function GET(req) {
  try {
    // Create a URL object from the request
    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId");

    if (!storeId) {
      return new Response(JSON.stringify({ error: "storeId is required" }), {
        status: 400,
      });
    }

    const categories = await prisma.category.findMany({
      where: { storeId: parseInt(storeId, 10) },
    });

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch categories" }),
      {
        status: 500,
      }
    );
  }
}
