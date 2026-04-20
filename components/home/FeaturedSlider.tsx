"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { FeaturedListing } from "@/lib/types";
import { formatCountdown } from "@/lib/utils";

interface FeaturedSliderProps {
  listings: FeaturedListing[];
}

const THEMES = {
  green: {
    bg: "from-[#0a2a1a] to-[#0d1f0d]",
    accent: "#00FF7F",
    badgeBg: "#00FF7F",
    badgeText: "#000",
    titleColor: "#00FF7F",
    dot: "#00FF7F",
  },
  red: {
    bg: "from-[#2a0a1a] to-[#1f0d0d]",
    accent: "#E5194B",
    badgeBg: "#E5194B",
    badgeText: "#fff",
    titleColor: "#FF6B9D",
    dot: "#E5194B",
  },
  yellow: {
    bg: "from-[#2a2000] to-[#1f1a00]",
    accent: "#FFC107",
    badgeBg: "#FFC107",
    badgeText: "#000",
    titleColor: "#FFC107",
    dot: "#FFC107",
  },
};

const MOCK_LISTINGS = [
  {
    id: "1",
    product_id: "1",
    auction_end_time: new Date(Date.now() + 3 * 3600 * 1000 + 59 * 60 * 1000 + 59 * 1000).toISOString(),
    color_theme: "green" as const,
    is_active: true,
    product: {
      id: "1",
      title: "H2R",
      category: "Motorcycles" as const,
      brand_id: null,
      price: 15800000,
      cashback_amount: 7200,
      description: "The Ultimate Hyperbike Experience",
      image_url: null,
      rating: 4.5,
      featured: true,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "2",
    product_id: "2",
    auction_end_time: new Date(Date.now() + 24 * 3600 * 1000 + 31 * 60 * 1000 + 10 * 1000).toISOString(),
    color_theme: "red" as const,
    is_active: true,
    product: {
      id: "2",
      title: "H2R",
      category: "Motorcycles" as const,
      brand_id: null,
      price: 18000000,
      cashback_amount: 9000,
      description: "The Ultimate Hyperbike Experience",
      image_url: null,
      rating: 4.8,
      featured: true,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "3",
    product_id: "3",
    auction_end_time: new Date(Date.now() + 6 * 3600 * 1000 + 7 * 60 * 1000 + 36 * 1000).toISOString(),
    color_theme: "yellow" as const,
    is_active: true,
    product: {
      id: "3",
      title: "H2R",
      category: "Motorcycles" as const,
      brand_id: null,
      price: 20000000,
      cashback_amount: 10000,
      description: "The Ultimate Hyperbike Experience",
      image_url: null,
      rating: 4.9,
      featured: true,
      created_at: new Date().toISOString(),
    },
  },
];

function CountdownTimer({ endTime, accentColor }: { endTime: string; accentColor: string }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000));
      setRemaining(diff);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const { hours, minutes, secs } = formatCountdown(remaining);

  return (
    <div
      className="rounded-2xl p-4 text-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)" }}
    >
      <p className="text-text-muted text-xs mb-2">Auction ends in:</p>
      <div className="flex items-center gap-1">
        {[
          { value: hours, label: "Hours" },
          { value: ":", label: "" },
          { value: minutes, label: "Minutes" },
          { value: ":", label: "" },
          { value: secs, label: "Seconds" },
        ].map((item, i) => (
          item.label === "" ? (
            <span key={i} className="text-2xl font-bold text-white mx-1">:</span>
          ) : (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl font-bold" style={{ color: accentColor }}>
                {item.value}
              </span>
              <span className="text-xs text-text-muted">{item.label}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default function FeaturedSlider({ listings }: FeaturedSliderProps) {
  const [active, setActive] = useState(0);
  const data = listings.length > 0 ? listings : MOCK_LISTINGS;

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % data.length), 8000);
    return () => clearInterval(id);
  }, [data.length]);

  const current = data[active];
  const theme = THEMES[current.color_theme as keyof typeof THEMES] ?? THEMES.green;

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${theme.bg} p-8 h-52`}>
      <div className="flex items-center justify-between h-full">
        <div className="flex flex-col justify-center gap-3 z-10">
          <h2
            className="text-5xl font-black italic"
            style={{ color: theme.titleColor }}
          >
            {current.product?.title ?? "H2R"}
          </h2>
          <p className="text-white/80 text-base">
            {current.product?.description ?? "The Ultimate Hyperbike Experience"}
          </p>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full w-fit font-bold text-sm"
            style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
          >
            <Zap size={14} fill="currentColor" />
            EXCLUSIVE
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 z-10">
          <CountdownTimer
            endTime={current.auction_end_time}
            accentColor={theme.accent}
          />
          <div
            className="w-40 h-28 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          >
            {current.product?.image_url ? (
              <img
                src={current.product.image_url}
                alt={current.product.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
                <ellipse cx="15" cy="45" rx="12" ry="12" stroke={theme.accent} strokeWidth="3" />
                <ellipse cx="65" cy="45" rx="12" ry="12" stroke={theme.accent} strokeWidth="3" />
                <path d="M27 45h18l10-22h10l8 10" stroke={theme.accent} strokeWidth="3" strokeLinecap="round" />
                <path d="M45 45l-6-16h14" stroke={theme.accent} strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? "20px" : "8px",
              height: "8px",
              backgroundColor: i === active ? theme.dot : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
