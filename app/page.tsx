import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeaturedSlider from "@/components/home/FeaturedSlider";
import BrandGrid from "@/components/home/BrandGrid";
import TopDeals from "@/components/home/TopDeals";
import Link from "next/link";
import { Profile, Product, FeaturedListing, Brand } from "@/lib/types";

export default async function HomePage() {
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

  const { data: featuredRaw } = await supabase
    .from("featured_listings")
    .select("*, product:products(*, brand:brands(*))")
    .eq("is_active", true)
    .limit(3);

  const { data: productsRaw } = await supabase
    .from("products")
    .select("*, brand:brands(*)")
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: brandsRaw } = await supabase
    .from("brands")
    .select("*")
    .limit(8);

  const featured = (featuredRaw ?? []) as FeaturedListing[];
  const products = (productsRaw ?? []) as Product[];
  const brands = (brandsRaw ?? []) as Brand[];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Featured</h2>
            <Link href="/marketplace?featured=true" className="see-all">
              See All
            </Link>
          </div>
          <FeaturedSlider listings={featured} />
        </section>

        <section>
          <BrandGrid brands={brands} />
        </section>

        <section>
          <TopDeals products={products} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
