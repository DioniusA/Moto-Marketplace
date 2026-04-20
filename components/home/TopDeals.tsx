"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const BRANDS = ["All", "Yamaha", "Honda", "Kawasaki", "Suzuki", "Harley", "Ducati", "BMW"];

const MotoPlaceholder = () => (
  <svg width="60" height="45" viewBox="0 0 80 60" fill="none" className="opacity-70">
    <ellipse cx="15" cy="45" rx="12" ry="12" stroke="#8A8A8A" strokeWidth="2.5" />
    <ellipse cx="65" cy="45" rx="12" ry="12" stroke="#8A8A8A" strokeWidth="2.5" />
    <path d="M27 45h18l10-22h10l8 10" stroke="#8A8A8A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M45 45l-6-16h14" stroke="#8A8A8A" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

interface TopDealsProps {
  products: Product[];
}

export default function TopDeals({ products }: TopDealsProps) {
  const [activeBrand, setActiveBrand] = useState("All");

  const filtered =
    activeBrand === "All"
      ? products
      : products.filter((p) => p.brand?.name === activeBrand);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Top Deals</h2>
        <Link href="/marketplace" className="see-all">
          See All
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {BRANDS.map((brand) => (
          <button
            key={brand}
            onClick={() => setActiveBrand(brand)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeBrand === brand
                ? "bg-accent-red text-white"
                : "bg-bg-card text-text-secondary hover:text-white hover:bg-bg-overlay"
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          No products found for this brand.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filtered.slice(0, 8).map((product, i) => (
            <Link key={product.id} href={`/marketplace/${product.id}`}>
              <div className="bg-bg-card rounded-2xl p-4 hover:bg-bg-overlay transition-colors duration-200 relative group cursor-pointer">
                <span className="absolute top-3 left-3 text-xs text-text-muted font-medium">
                  {i + 1}
                </span>
                <div className="w-full h-28 flex items-center justify-center mb-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <MotoPlaceholder />
                  )}
                </div>
                <p className="text-white font-semibold text-sm truncate">{product.title}</p>
                <p className="text-text-muted text-xs mt-0.5">
                  {product.category}{" "}
                  <span className="text-primary font-medium">
                    {formatPrice(product.price)}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
