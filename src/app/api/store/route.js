import { prisma } from "../../lib/prisma"; // Assuming Prisma client is initialized

export async function POST(req) {
  try {
    const body = await req.json(); // ✅ Parse JSON instead of formData

    const { name, description, logoUrl } = body;

    const store = await prisma.store.create({
      data: { name, description, logoUrl },
    });

    return new Response(JSON.stringify(store), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to parse JSON data' }), { status: 400 });
  }
}
