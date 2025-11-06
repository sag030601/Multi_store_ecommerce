// import { prisma } from "../../lib/prisma";// Assume Prisma client is initialized

import { prisma } from "@/app/lib/prisma";

// import { prisma } from "../../lib/prisma"; // Assuming Prisma client is initialized


// // GET product by id
// export async function GET({ params }) {
//   const { id } = params;
//   const product = await prisma.product.findUnique({
//     where: { id: parseInt(id) },
//   });
//   return new Response(JSON.stringify(product), { status: 200 });
// }

// POST create new product
export async function POST(req) {
  const { name, description, price, stock, imageUrl, categoryId, storeId } =
    await req.json();
  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
      storeId,
    },
  });
  return new Response(JSON.stringify(newProduct), { status: 201 });
}


export async function GET() {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany();

    // Return the products as a JSON response
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
    });
  }
}

// // PUT update product by id
// export async function PUT({ params, req }) {
//   const { id } = params;
//   const { name, description, price, stock, imageUrl } = await req.json();
//   const updatedProduct = await prisma.product.update({
//     where: { id: parseInt(id) },
//     data: { name, description, price, stock, imageUrl },
//   });
//   return new Response(JSON.stringify(updatedProduct), { status: 200 });
// }

// // DELETE product by id
// export async function DELETE({ params }) {
//   const { id } = params;
//   await prisma.product.delete({
//     where: { id: parseInt(id) },
//   });
//   return new Response(null, { status: 204 });
// }
