"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";
import { getTimeOfDay } from "@/lib/utils";
import { useEffect, useState } from "react";

const MotoIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
    <ellipse cx="6" cy="18" rx="5" ry="5" stroke="#FFC107" strokeWidth="2" />
    <ellipse cx="30" cy="18" rx="5" ry="5" stroke="#FFC107" strokeWidth="2" />
    <path
      d="M11 18h8l4-10h4l3 4"
      stroke="#FFC107"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 18l-2-6h6"
      stroke="#FFC107"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface NavbarProps {
  profile?: Profile | null;
}

export default function Navbar({ profile }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from("cart_items")
      .select("id", { count: "exact" })
      .eq("user_id", profile.id)
      .then(({ count }) => setCartCount(count ?? 0));
  }, [profile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`nav-link ${pathname === href ? "text-white font-semibold" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-bg-card border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <MotoIcon />
          <span className="text-xl font-bold text-white">Moto Marketplace</span>
        </Link>

        <div className="flex items-center gap-8">
          {navLink("/", "Home")}
          {navLink("/marketplace", "Marketplace")}

          {profile ? (
            <>
              <Link
                href="/cart"
                className={`nav-link relative ${pathname === "/cart" ? "text-white" : ""}`}
              >
                Basket
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-primary text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              {navLink("/about", "About")}
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-bg-overlay overflow-hidden border border-border-subtle flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-text-muted" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs text-text-muted leading-none">
                    {getTimeOfDay()} 🌤
                  </div>
                  <div className="text-sm font-medium text-white leading-tight">
                    {profile.username}
                  </div>
                </div>
              </button>
            </>
          ) : (
            <>
              {navLink("/services", "Services")}
              {navLink("/rentals", "Rentals")}
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-semibold rounded-full px-5 py-2 transition-colors duration-200"
              >
                <User size={16} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
