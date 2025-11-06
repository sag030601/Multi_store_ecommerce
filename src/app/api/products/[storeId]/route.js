// import { prisma } from "../../lib/prisma"; // Assume Prisma client is initialized
import { prisma } from "@/app/lib/prisma";

// GET product by id
export async function GET(request, { params }) {
  const { storeId } = params;

  if (!storeId) {
    return new Response(JSON.stringify({ error: "storeId is required" }), {
      status: 400,
    });
  }

  try {
    const products = await prisma.product.findMany({
      where: { storeId: parseInt(storeId, 10) },
    });
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
    });
  }
}
// POST create new product
export async function POST(req, { params }) {
  const { storeId } = params; // get from URL
  const { name, description, price, stock, imageUrl, categoryId } =
    await req.json();

  if (!storeId) {
    return new Response(JSON.stringify({ message: "StoreId is required" }), {
      status: 400,
    });
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      imageUrl,
      categoryId: parseInt(categoryId),
      storeId: parseInt(storeId), // <- MUST be valid integer
    },
  });

  return new Response(JSON.stringify(newProduct), { status: 201 });
}

// PUT update product by id
export async function PUT({ params, req }) {
  const { id } = params;
  const { name, description, price, stock, imageUrl } = await req.json();
  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id) },
    data: { name, description, price, stock, imageUrl },
  });
  return new Response(JSON.stringify(updatedProduct), { status: 200 });
}

// DELETE product by id
export async function DELETE({ params }) {
  const { id } = params;
  await prisma.product.delete({
    where: { id: parseInt(id) },
  });
  return new Response(null, { status: 204 });
}
