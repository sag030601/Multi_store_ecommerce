import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import StoreForm from "../components/StoreForm";
import AdminDashboard from "../components/StoreAdminDashboard";
// import { useStore } from "../context/page";

export default async function StorePage() {
  // const { storeId, setStoreId } = useStore();
  // Get the current session (server-side)
  const session = await getServerSession(authOptions);

  // If not logged in, redirect to login
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // Fetch user and storeId
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { storeId: true },
  });

  // If user already owns a store, redirect to /category
  if (user?.storeId) {
    // redirect(`/category?storeId=${user.storeId}`);
    // setStoreId(user?.storeId);
    return <AdminDashboard storeId={user?.storeId} />;
  }

  // Otherwise render the StoreForm (client component)
  // and pass any existing storeId (null for now)
  return <StoreForm initialStoreId={user?.storeId || null} />;
}
