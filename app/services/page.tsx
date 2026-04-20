import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Profile } from "@/lib/types";
import { Wrench, Shield, Truck } from "lucide-react";

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  const services = [
    { icon: Wrench, title: "Maintenance", desc: "Expert servicing for all brands." },
    { icon: Shield, title: "Insurance", desc: "Protect your ride with flexible coverage." },
    { icon: Truck, title: "Delivery", desc: "Fast, safe delivery across the country." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">Services</h1>
        <p className="text-text-muted mb-8">Everything you need to keep riding.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-bg-card rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-4">
                <Icon size={22} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-text-muted text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
