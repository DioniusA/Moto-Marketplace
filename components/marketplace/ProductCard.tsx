"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const MotoPlaceholder = () => (
  <svg width="60" height="45" viewBox="0 0 80 60" fill="none" className="opacity-60">
    <ellipse cx="15" cy="45" rx="12" ry="12" stroke="#8A8A8A" strokeWidth="2.5" />
    <ellipse cx="65" cy="45" rx="12" ry="12" stroke="#8A8A8A" strokeWidth="2.5" />
    <path d="M27 45h18l10-22h10l8 10" stroke="#8A8A8A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M45 45l-6-16h14" stroke="#8A8A8A" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

interface ProductCardProps {
  product: Product;
  index?: number;
  onAddToCart?: (productId: string) => void;
}

export default function ProductCard({ product, index, onAddToCart }: ProductCardProps) {
  return (
    <Link href={`/marketplace/${product.id}`}>
      <div className="bg-bg-card rounded-2xl p-4 hover:bg-bg-overlay transition-all duration-200 relative group cursor-pointer h-full">
        {index !== undefined && (
          <span className="absolute top-3 left-3 text-xs text-text-muted font-medium z-10">
            {index + 1}
          </span>
        )}

        {onAddToCart && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product.id);
            }}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-bg-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-primary hover:text-black text-text-muted z-10"
          >
            <ShoppingCart size={14} />
          </button>
        )}

        <div className="w-full h-32 flex items-center justify-center mb-3 rounded-xl overflow-hidden bg-bg-overlay">
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
        <p className="text-text-muted text-xs mt-1">
          {product.category}{" "}
          <span className="text-primary font-medium">{formatPrice(product.price)}</span>
        </p>
      </div>
    </Link>
  );
}
