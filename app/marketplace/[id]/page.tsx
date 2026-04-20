import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/marketplace/AddToCartButton";
import { Star, Gift } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Profile, Product } from "@/lib/types";

const MotoHero = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <svg width="200" height="150" viewBox="0 0 200 150" fill="none">
      <ellipse cx="38" cy="112" rx="30" ry="30" stroke="#8A8A8A" strokeWidth="4" />
      <ellipse cx="162" cy="112" rx="30" ry="30" stroke="#8A8A8A" strokeWidth="4" />
      <path d="M68 112h45l25-55h25l20 25" stroke="#8A8A8A" strokeWidth="4" strokeLinecap="round" />
      <path d="M113 112l-15-40h35" stroke="#8A8A8A" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </div>
);

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const { data: product } = await supabase
    .from("products")
    .select("*, brand:brands(*)")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  const p = product as Product;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />

      <main className="flex-1">
        <div className="w-full bg-bg-card">
          {p.image_url ? (
            <img
              src={p.image_url}
              alt={p.title}
              className="w-full h-72 object-cover"
            />
          ) : (
            <MotoHero />
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-accent-red text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  {p.category}
                </span>
                <div className="flex items-center gap-1 text-primary">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-medium text-white">{p.rating}</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">{p.title}</h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(p.price)}
                </span>
                {p.cashback_amount > 0 && (
                  <div className="flex items-center gap-2 bg-[#3d2e00] text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                    <Gift size={14} />
                    Cashback{" "}
                    <span className="font-bold">{formatPrice(p.cashback_amount)}</span>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
                <p className="text-text-secondary leading-relaxed">
                  {p.description ??
                    "In the world of hypersport machines, only one creature dominates the asphalt dimension — the H2R. Forged from aerospace metal and engineered by racing craftsmen, it is feared and admired as the fastest species ever born from Earth's technology."}
                </p>
              </div>
            </div>

            <div>
              <AddToCartButton product={p} userId={user?.id} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
