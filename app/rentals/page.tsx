import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/marketplace/ProductCard";
import { Profile, Product } from "@/lib/types";

export default async function RentalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  const { data: productsRaw } = await supabase
    .from("products")
    .select("*, brand:brands(*)")
    .eq("category", "Motorcycles")
    .order("rating", { ascending: false })
    .limit(8);

  const products = (productsRaw ?? []) as Product[];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">Rentals</h1>
        <p className="text-text-muted mb-8">
          Rent top-rated motorcycles from verified owners.
        </p>
        {products.length === 0 ? (
          <p className="text-text-muted text-center py-16">No rentals available yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
