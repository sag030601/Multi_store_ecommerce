import { prisma } from "@/app/lib/prisma";

// import { prisma } from "../../lib/prisma";// Assuming Prisma client is initialized


// GET user by id
export async function GET({ params }) {
  const { id } = params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: { store: true },
  });
  return new Response(JSON.stringify(user), { status: 200 });
}


// PUT update user by id
export async function PUT({ params, req }) {
  const { id } = params;
  const { firstName, lastName, phone } = await req.json();

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      firstName,
      lastName,
      phone,
    },
  });

  return new Response(JSON.stringify(updatedUser), { status: 200 });
}



// DELETE user by id
export async function DELETE({ params }) {
  const { id } = params;

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  return new Response(null, { status: 204 });
}
