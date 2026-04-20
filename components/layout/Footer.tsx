"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MotoIcon = () => (
  <svg width="32" height="22" viewBox="0 0 36 24" fill="none">
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

const SocialIcon = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-bg-overlay flex items-center justify-center text-text-muted hover:text-white hover:bg-border-subtle transition-colors duration-200"
  >
    {children}
  </a>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const supabase = createClient();

  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    setStatus("loading");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });
    setStatus(error ? "error" : "success");
  };

  return (
    <footer className="bg-bg-card border-t border-border-subtle mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <MotoIcon />
              <span className="text-lg font-bold text-white">Moto Marketplace</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              Moto marketplace UI created with Figma.
            </p>
            <p className="text-text-secondary text-sm mb-3">Join our community</p>
            <div className="flex items-center gap-2">
              <SocialIcon href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.034.053a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Explore</h3>
            <ul className="space-y-3">
              {["Home", "Marketplace", "Services", "Rentals"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-text-muted hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Join Our Weekly Digest
            </h3>
            <p className="text-text-muted text-sm mb-4">
              Get exclusive promotions & updates straight to your inbox.
            </p>
            {status === "success" ? (
              <p className="text-accent-green text-sm font-medium">
                ✓ Subscribed successfully!
              </p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email here"
                  className="flex-1 bg-white text-black placeholder-gray-400 rounded-full px-4 py-3 text-sm focus:outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                />
                <button
                  onClick={handleSubscribe}
                  disabled={status === "loading"}
                  className="bg-primary hover:bg-primary-hover text-black font-semibold rounded-full px-5 py-3 text-sm transition-colors duration-200 whitespace-nowrap disabled:opacity-50"
                >
                  Subscribe
                </button>
              </div>
            )}
            {status === "error" && (
              <p className="mt-2 text-accent-red text-xs">
                This email may already be subscribed.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-border-subtle mt-10 pt-6">
          <p className="text-text-muted text-sm">© Moto Market.</p>
        </div>
      </div>
    </footer>
  );
}
