// import { prisma } from "../../lib/prisma"; // Assuming Prisma client is initialized

import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcrypt';

// POST create a new user
export async function POST(req) {
  try {
    // Parsing the form data
    const formData = await req.formData();
    
    // Extracting fields from the form data
    const email = formData.get('email');
    const password = formData.get('password');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const role = formData.get('role');
    const phone = formData.get('phone');
    // const storeId = formData.get('storeId');
    const storeId = parseInt(formData.get('storeId'), 10);

    
    // Ensure all required fields are provided
    if (!email || !password || !firstName || !lastName || !role || !phone || !storeId) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        phone,
        storeId,
      },
    });

    // Return the created user response
    return new Response(JSON.stringify(user), { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create user' }),
      { status: 500 }
    );
  }
}
