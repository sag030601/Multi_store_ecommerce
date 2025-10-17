import { prisma } from "../../lib/prisma"; // Assuming Prisma client is initialized


export async function POST(req) {
  try {
    // Parsing form data from the request
    const formData = await req.formData(); // Get all form data
    
    // Extracting fields from the form data
    const name = formData.get('name');
    const description = formData.get('description');
    const logoUrl = formData.get('logoUrl');
    
    // Handle the store creation logic with Prisma
    const store = await prisma.store.create({
      data: {
        name,
        description,
        logoUrl,
      },
    });

    // Return success response
    return new Response(JSON.stringify(store), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to parse form data' }),
      { status: 400 }
    );
  }
}
