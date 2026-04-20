"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  userId?: string;
}

export default function AddToCartButton({ product, userId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAddToCart = async () => {
    if (!userId) {
      router.push(`/auth/login?redirect=/marketplace/${product.id}`);
      return;
    }

    setLoading(true);
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", product.id)
      .single();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: userId,
        product_id: product.id,
        quantity,
      });
    }

    setLoading(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    router.refresh();
  };

  return (
    <div className="bg-bg-card rounded-2xl p-6 space-y-6 sticky top-24">
      <div>
        <p className="text-text-muted text-sm mb-2">Quantity</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-full bg-bg-overlay flex items-center justify-center hover:bg-border-subtle transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="text-white font-semibold text-lg w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 rounded-full bg-bg-overlay flex items-center justify-center hover:bg-border-subtle transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
      >
        <ShoppingCart size={18} />
        {loading ? "Adding..." : added ? "✓ Added!" : "Add to Cart"}
      </button>
    </div>
  );
}
