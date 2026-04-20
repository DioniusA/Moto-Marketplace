import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileContent from "@/components/profile/ProfileContent";
import { Profile } from "@/lib/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/profile");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = data as Profile;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />
      <ProfileContent profile={profile} userId={user.id} />
      <Footer />
    </div>
  );
}
