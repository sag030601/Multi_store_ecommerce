import { prisma } from "../../../lib/prisma"; // Assuming Prisma client is initialized

export async function GET(req, { params }) {
  console.log("Request URL:", req.url); // Log the full request URL
  console.log("Received params:", params); // Log the  // Should log { id: "some-id" }
  if (!params || !params.id) {
    return new Response(
      JSON.stringify({ error: "ID is missing in the request" }),
      { status: 400 }
    );
  }

  const { id } = params;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: parseInt(id),
      },
      include: {
        product: true, // Include product details, if necessary
      },
    });

    return new Response(JSON.stringify(cartItems), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch cart items" }),
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  const { id } = params;
  const { productId, quantity } = await req.json(); // Expecting productId and quantity in the request body

  if (!productId || !quantity) {
    return new Response(
      JSON.stringify({ error: "Product ID and quantity are required" }),
      { status: 400 }
    );
  }

  try {
    // Check if the cart item already exists in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: parseInt(id),
        productId: parseInt(productId),
      },
    });

    if (existingCartItem) {
      // Update quantity if the product already exists in the cart
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });

      return new Response(JSON.stringify(updatedCartItem), { status: 200 });
    } else {
      // Create a new cart item if it doesn't exist
      const newCartItem = await prisma.cartItem.create({
        data: {
          cartId: parseInt(id),
          productId: parseInt(productId),
          quantity,
        },
      });

      return new Response(JSON.stringify(newCartItem), { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to add cart item" }), {
      status: 500,
    });
  }
}

export async function DELETE({ params }) {
  const { cartId, cartItemId } = params;

  try {
    // Delete the cart item from the cart
    const deletedCartItem = await prisma.cartItem.delete({
      where: {
        id: parseInt(cartItemId),
        cartId: parseInt(cartId), // Ensure the cartItem belongs to the correct cart
      },
    });

    return new Response(
      JSON.stringify({ message: "Item removed successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to remove cart item" }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { cartId, cartItemId } = params;
  const { quantity } = await req.json(); // Expecting new quantity in the request body

  if (!quantity || quantity <= 0) {
    return new Response(
      JSON.stringify({ error: "Quantity must be greater than zero" }),
      { status: 400 }
    );
  }

  try {
    // Find the cart item and update its quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: parseInt(cartItemId),
        cartId: parseInt(cartId), // Ensure the cartItem belongs to the correct cart
      },
      data: {
        quantity,
      },
    });

    return new Response(JSON.stringify(updatedCartItem), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to update cart item" }),
      { status: 500 }
    );
  }
}
