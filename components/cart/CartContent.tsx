"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Gift, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface CartContentProps {
  initialItems: CartItem[];
  userId: string;
}

const MotoPlaceholder = () => (
  <svg width="60" height="45" viewBox="0 0 80 60" fill="none">
    <ellipse cx="15" cy="45" rx="12" ry="12" stroke="#8A8A8A" strokeWidth="2.5" />
    <ellipse cx="65" cy="45" rx="12" ry="12" stroke="#8A8A8A" strokeWidth="2.5" />
    <path d="M27 45h18l10-22h10l8 10" stroke="#8A8A8A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M45 45l-6-16h14" stroke="#8A8A8A" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export default function CartContent({ initialItems, userId }: CartContentProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const updateQuantity = async (itemId: string, delta: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      await removeItem(itemId);
      return;
    }
    await supabase.from("cart_items").update({ quantity: newQty }).eq("id", itemId);
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
    );
  };

  const removeItem = async (itemId: string) => {
    await supabase.from("cart_items").delete().eq("id", itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
    0
  );
  const totalCashback = items.reduce(
    (sum, i) => sum + (i.product?.cashback_amount ?? 0) * i.quantity,
    0
  );

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    const { data: order } = await supabase
      .from("orders")
      .insert({ user_id: userId, total_amount: subtotal, status: "pending" })
      .select()
      .single();

    if (order) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.product?.price ?? 0,
      }));
      await supabase.from("order_items").insert(orderItems);
      await supabase.from("cart_items").delete().eq("user_id", userId);
      setItems([]);
    }
    setCheckoutLoading(false);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-bg-card rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={32} className="text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-text-muted mb-6">Add some motorcycles or accessories to get started.</p>
        <Link href="/marketplace" className="btn-primary px-8 py-3">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Shopping Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-bg-card rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-32 h-24 bg-bg-overlay rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
              {item.product?.image_url ? (
                <img
                  src={item.product.image_url}
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MotoPlaceholder />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">
                {item.product?.title}
              </p>
              {item.product?.cashback_amount && item.product.cashback_amount > 0 && (
                <div className="flex items-center gap-1.5 mt-1 text-primary text-sm">
                  <Gift size={12} />
                  <span>{formatPrice(item.product.cashback_amount)} cashback</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-bg-overlay rounded-full px-3 py-1">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="text-text-muted hover:text-white transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="text-white text-sm font-medium w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="text-text-muted hover:text-white transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>

              <div className="text-right">
                <p className="text-primary font-bold text-lg">
                  {formatPrice((item.product?.price ?? 0) * item.quantity)}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-text-muted hover:text-accent-red transition-colors ml-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-bg-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between text-base">
          <span className="text-text-secondary font-medium">Subtotal</span>
          <span className="text-white font-bold">{formatPrice(subtotal)}</span>
        </div>

        {totalCashback > 0 && (
          <div className="flex items-center justify-between bg-[#3d2e00] rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-primary">
              <Gift size={16} />
              <span className="font-medium italic">Total cashback</span>
            </div>
            <span className="text-primary font-bold">{formatPrice(totalCashback)}</span>
          </div>
        )}

        <div className="border-t border-border-subtle pt-4 flex items-center justify-between">
          <span className="text-white font-semibold text-lg">Total</span>
          <span className="text-white font-bold text-2xl">{formatPrice(subtotal)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          className="w-full btn-primary py-4 text-base font-bold disabled:opacity-50"
        >
          {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
}
