import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const { name, description, logoUrl } = await req.json();

    // 1️⃣ Create the store and connect the logged-in user
    const store = await prisma.store.create({
      data: {
        name,
        description,
        logoUrl,
        users: {
          connect: { email: session.user.email },
        },
      },
    });

    // 2️⃣ Update the logged-in user's storeId
    await prisma.user.update({
      where: { email: session.user.email },
      data: { storeId: store.id },
    });

    // 3️⃣ Return the store data
    return new Response(JSON.stringify(store), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create store" }), { status: 500 });
  }
}
