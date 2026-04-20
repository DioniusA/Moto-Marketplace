import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartContent from "@/components/cart/CartContent";
import { Profile, CartItem } from "@/lib/types";

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/cart");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as Profile;

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, product:products(*, brand:brands(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <CartContent
          initialItems={(cartItems ?? []) as CartItem[]}
          userId={user.id}
        />
      </main>
      <Footer />
    </div>
  );
}
