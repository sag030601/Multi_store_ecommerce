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
  const { storeId } = req.url.searchParams;
  
  const categories = await prisma.category.findMany({
    where: { storeId: parseInt(storeId) },
  });

  return new Response(JSON.stringify(categories), { status: 200 });
}
