"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/marketplace/ProductCard";
import SearchBar from "@/components/marketplace/SearchBar";
import CategoryTabs from "@/components/marketplace/CategoryTabs";
import FilterPopup from "@/components/marketplace/FilterPopup";
import { createClient } from "@/lib/supabase/client";
import { Product, MarketplaceFilters, ProductCategory, Profile } from "@/lib/types";

type Tab = "All" | ProductCategory;

const DEFAULT_FILTERS: MarketplaceFilters = {
  category: "All",
  brand: "",
  priceMin: 0,
  priceMax: 15000000,
  sort: "newest",
  accessoryTypes: [],
  search: "",
};

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    ...DEFAULT_FILTERS,
    brand: searchParams.get("brand") ?? "",
    category: (searchParams.get("category") as ProductCategory) ?? "All",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [gridView, setGridView] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => setProfile(data));
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select("*, brand:brands(*)");

    if (filters.category !== "All") {
      query = query.eq("category", filters.category);
    }
    if (filters.brand) {
      query = query.eq("brands.name", filters.brand);
    }
    if (filters.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }
    if (filters.priceMax < 15000000) {
      query = query.lte("price", filters.priceMax);
    }

    switch (filters.sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "popular":
        query = query.order("rating", { ascending: false });
        break;
    }

    const { data } = await query.limit(20);
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (productId: string) => {
    if (!profile) {
      window.location.href = "/auth/login?redirect=/marketplace";
      return;
    }
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", profile.id)
      .eq("product_id", productId)
      .single();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("cart_items")
        .insert({ user_id: profile.id, product_id: productId, quantity: 1 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Browse Marketplace</h1>
          <p className="text-text-muted">
            Browse through more than 50,000 motorcycle parts and accessories in our marketplace.
          </p>
        </div>

        <div className="mb-6">
          <SearchBar
            value={filters.search}
            onChange={(v) => setFilters((f) => ({ ...f, search: v }))}
            onFilterClick={() => setShowFilter(true)}
          />
        </div>

        <div className="mb-6">
          <CategoryTabs
            active={filters.category as Tab}
            onChange={(tab) => setFilters((f) => ({ ...f, category: tab }))}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Marketplace</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGridView(true)}
              className={`p-2 rounded-lg transition-colors ${gridView ? "text-primary" : "text-text-muted hover:text-white"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`p-2 rounded-lg transition-colors ${!gridView ? "text-primary" : "text-text-muted hover:text-white"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className={`grid gap-4 ${gridView ? "grid-cols-4" : "grid-cols-1"}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-bg-card rounded-2xl h-52 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-bg-card rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="24" viewBox="0 0 80 60" fill="none">
                <ellipse cx="15" cy="45" rx="12" ry="12" stroke="#8A8A8A" strokeWidth="2.5" />
                <ellipse cx="65" cy="45" rx="12" ry="12" stroke="#8A8A8A" strokeWidth="2.5" />
                <path d="M27 45h18l10-22h10l8 10" stroke="#8A8A8A" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-text-muted text-lg">No products found</p>
            <p className="text-text-muted text-sm mt-1">Try adjusting your filters</p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="mt-4 btn-primary text-sm px-5 py-2"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 ${gridView ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1"}`}>
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {showFilter && (
        <FilterPopup
          filters={filters}
          onApply={(partial) => setFilters((f) => ({ ...f, ...partial }))}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}
