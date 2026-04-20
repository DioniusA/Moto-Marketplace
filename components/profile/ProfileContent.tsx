"use client";

import { useState, useRef } from "react";
import { Edit2, Star, Shield, Globe, Youtube, Twitter, Instagram } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";

interface ProfileContentProps {
  profile: Profile;
  userId: string;
}

export default function ProfileContent({ profile: initialProfile, userId }: ProfileContentProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: profile.username ?? "",
    bio: profile.bio ?? "",
  });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const avatarRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaving(true);
    const { data } = await supabase
      .from("profiles")
      .update({ username: form.username, bio: form.bio })
      .eq("id", userId)
      .select()
      .single();
    if (data) setProfile(data as Profile);
    setSaving(false);
    setEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `avatars/${userId}.${ext}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    if (urlData) {
      const { data } = await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", userId)
        .select()
        .single();
      if (data) setProfile(data as Profile);
    }
  };

  const socialLinks = [
    { icon: Globe, url: profile.social_discord },
    { icon: Globe, url: profile.social_meta },
    { icon: Youtube, url: profile.social_youtube },
    { icon: Twitter, url: profile.social_twitter },
    { icon: Instagram, url: profile.social_instagram },
  ].filter((l) => l.url);

  return (
    <main className="flex-1">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 overflow-hidden">
          {profile.banner_url && (
            <img
              src={profile.banner_url}
              alt="Banner"
              className="w-full h-full object-cover opacity-60"
            />
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="relative -mt-12 mb-4 flex items-end justify-between">
            <div className="relative">
              <button
                onClick={() => avatarRef.current?.click()}
                className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-bg-main bg-bg-card flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {profile.username?.[0]?.toUpperCase() ?? "U"}
                  </span>
                )}
              </button>
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              disabled={saving}
              className="flex items-center gap-2 border border-border-subtle text-white px-4 py-2 rounded-full text-sm font-medium hover:border-primary transition-colors disabled:opacity-50"
            >
              <Edit2 size={14} />
              {saving ? "Saving..." : editing ? "Save" : "Edit"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3 mb-6 max-w-md">
              <input
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                className="input-field text-xl font-bold"
                placeholder="Username"
              />
              <input
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="input-field"
                placeholder="Bio"
              />
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-white mb-4">
              {profile.username ?? "Motor Hub User"}
            </h1>
          )}

          <div className="flex items-center gap-8 mb-6">
            <div>
              <div className="flex items-center gap-1 text-primary">
                <Star size={16} fill="currentColor" />
                <span className="text-white font-bold">{profile.rating_as_renter?.toFixed(1) ?? "0.0"}</span>
              </div>
              <p className="text-text-muted text-xs mt-0.5">As Renter</p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-primary">
                <Star size={16} fill="currentColor" />
                <span className="text-white font-bold">{profile.rating_as_owner?.toFixed(1) ?? "0.0"}</span>
              </div>
              <p className="text-text-muted text-xs mt-0.5">As Owner</p>
            </div>
          </div>

          {(profile.bio || profile.is_verified) && (
            <div className="mb-6">
              <p className="text-text-muted text-sm font-medium mb-2">Bio</p>
              {profile.is_verified && (
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  <Shield size={14} fill="currentColor" />
                  Verified Rider
                </div>
              )}
              {profile.bio && (
                <p className="text-text-secondary text-sm mt-1">{profile.bio}</p>
              )}
            </div>
          )}

          {socialLinks.length > 0 && (
            <div>
              <p className="text-text-muted text-sm font-medium mb-2">Links</p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, url }, i) => (
                  <a
                    key={i}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-white transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
