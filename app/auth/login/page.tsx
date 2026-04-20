"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

const MotoIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
    <ellipse cx="6" cy="18" rx="5" ry="5" stroke="#FFC107" strokeWidth="2" />
    <ellipse cx="30" cy="18" rx="5" ry="5" stroke="#FFC107" strokeWidth="2" />
    <path d="M11 18h8l4-10h4l3 4" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
    <path d="M19 18l-2-6h6" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const supabase = createClient();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <nav className="bg-bg-card border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <MotoIcon />
            <span className="text-xl font-bold text-white">Moto Marketplace</span>
          </Link>
          <div className="flex items-center gap-6">
            {["Home", "Marketplace", "Services", "Rentals"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="nav-link"
              >
                {item}
              </Link>
            ))}
            <Link
              href="/auth/signup"
              className="bg-primary hover:bg-primary-hover text-black font-semibold rounded-full px-5 py-2 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex">
        <div className="hidden lg:grid lg:w-1/2 grid-cols-2 gap-2 p-4">
          {[
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
            "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
            "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400",
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800",
          ].map((src, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden bg-bg-card ${i === 4 ? "col-span-2 h-48" : "h-40"}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover opacity-80" />
            </div>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-text-muted mb-8">Sign in to your account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted z-10" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="input-field pl-10"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-accent-red pl-2">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted z-10" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="input-field pl-10"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-accent-red pl-2">{errors.password.message}</p>
                )}
              </div>

              {serverError && (
                <p className="text-accent-red text-sm text-center bg-red-950/30 rounded-xl px-4 py-2">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 text-base"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-center text-text-muted text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
