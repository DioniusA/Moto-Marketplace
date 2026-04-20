import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Profile } from "@/lib/types";

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-6">About Moto Marketplace</h1>
        <p className="text-text-secondary text-lg leading-relaxed mb-6">
          Moto Marketplace is an ecosystem for motorcyclists. Buy, rent and service
          your motorcycle — all in one place.
        </p>
        <p className="text-text-secondary leading-relaxed">
          We connect riders, owners and verified dealers through a transparent, safe
          marketplace. Every user goes through identity verification, and every
          transaction is protected by our trust system.
        </p>
      </main>
      <Footer />
    </div>
  );
}
