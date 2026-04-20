"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, FileText, CreditCard, Camera, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const step1Schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Step1Data = z.infer<typeof step1Schema>;

const MotoIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
    <ellipse cx="6" cy="18" rx="5" ry="5" stroke="#FFC107" strokeWidth="2" />
    <ellipse cx="30" cy="18" rx="5" ry="5" stroke="#FFC107" strokeWidth="2" />
    <path d="M11 18h8l4-10h4l3 4" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
    <path d="M19 18l-2-6h6" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const STEP_DOTS = [1, 2, 3];

const DOCS = [
  { icon: FileText, label: "Driver's license", sub: "Category A/M" },
  { icon: CreditCard, label: "ID / Passport", sub: "Government-issue" },
  { icon: Camera, label: "Live Selfie", sub: "For verification" },
];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [serverError, setServerError] = useState("");
  const [userId, setUserId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });

  const onStep1 = async (data: Step1Data) => {
    setServerError("");
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { username: data.username } },
    });
    if (error) { setServerError(error.message); return; }
    if (authData.user) {
      await supabase.from("profiles").upsert({
        id: authData.user.id,
        username: data.username,
        rating_as_renter: 0,
        rating_as_owner: 0,
        is_verified: false,
      });
      setUserId(authData.user.id);
    }
    setStep(2);
  };

  const toggleDoc = (i: number) => {
    setSelectedDocs((p) => p.includes(i) ? p.filter((d) => d !== i) : [...p, i]);
  };

  const handleDocSubmit = () => setStep(3);

  const handleFinish = () => {
    router.push("/");
    router.refresh();
  };

  const progressWidth = `${((step - 1) / 2) * 100}%`;

  const renderStep = () => {
    if (step === 1) {
      return (
        <form onSubmit={handleSubmit(onStep1)} className="space-y-4">
          {[
            { icon: User, field: "username" as const, type: "text", placeholder: "Username" },
            { icon: Mail, field: "email" as const, type: "email", placeholder: "Email Address" },
            { icon: Lock, field: "password" as const, type: "password", placeholder: "Password" },
            { icon: Lock, field: "confirmPassword" as const, type: "password", placeholder: "Confirm Password" },
          ].map(({ icon: Icon, field, type, placeholder }) => (
            <div key={field}>
              <div className="relative">
                <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted z-10" />
                <input
                  {...register(field)}
                  type={type}
                  placeholder={placeholder}
                  className="input-field pl-10"
                />
              </div>
              {errors[field] && (
                <p className="mt-1 text-xs text-accent-red pl-2">{errors[field]?.message}</p>
              )}
            </div>
          ))}

          {serverError && (
            <p className="text-accent-red text-sm text-center bg-red-950/30 rounded-xl px-4 py-2">
              {serverError}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3">
            {isSubmitting ? "Creating Account..." : "Continue"}
          </button>
        </form>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <div className="bg-bg-overlay rounded-2xl p-4 flex items-start gap-3">
            <Shield size={20} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Why we need this</p>
              <p className="text-text-muted text-sm mt-1">
                We verify all users to ensure a safe marketplace for everyone
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-text-muted text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Verification takes &lt;24hours
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {DOCS.map(({ icon: Icon, label, sub }, i) => (
              <button
                key={i}
                onClick={() => toggleDoc(i)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-colors duration-200 ${
                  selectedDocs.includes(i)
                    ? "border-primary bg-primary/10"
                    : "border-border-subtle bg-bg-overlay hover:border-primary/50"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-bg-card flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-text-muted" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-medium text-sm">{label}</p>
                  <p className="text-text-muted text-xs">{sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedDocs.includes(i) ? "border-primary bg-primary" : "border-border-subtle"
                }`}>
                  {selectedDocs.includes(i) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L4 7L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button onClick={handleDocSubmit} className="w-full btn-primary py-3">
            Submit Document
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="relative w-24 h-24 mb-6">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="44" stroke="#333" strokeWidth="6" fill="none" />
            <circle
              cx="48" cy="48" r="44"
              stroke="#FFC107"
              strokeWidth="6"
              fill="none"
              strokeDasharray="276.46"
              strokeDashoffset="69.12"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="8" y="4" width="16" height="24" rx="2" stroke="#FFC107" strokeWidth="2" />
              <path d="M12 14L15 17L20 11" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Verification Pending</h2>

        <div className="w-full space-y-3 mb-8">
          {DOCS.map(({ label }, i) => {
            const status = i < selectedDocs.length ? "done" : i === selectedDocs.length ? "pending" : "waiting";
            return (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  status === "done" ? "border-primary bg-primary" : "border-border-subtle"
                }`}>
                  {status === "done" && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L4 7L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className={status === "done" ? "text-white" : "text-text-muted"}>
                  Document {status === "done" ? "Received" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>

        <button onClick={handleFinish} className="w-full btn-primary py-3">
          Go to Home
        </button>
      </div>
    );
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
              <Link key={item} href={item === "Home" ? "/" : `/${item.toLowerCase()}`} className="nav-link">
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
            <h1 className="text-4xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-text-secondary mb-2">Create Your Trust Profile</p>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-text-muted text-sm">Step {step} of 3</span>
              <div className="flex-1 h-1 bg-border-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>

            {renderStep()}

            {step === 1 && (
              <p className="text-center text-text-muted text-sm mt-4">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
