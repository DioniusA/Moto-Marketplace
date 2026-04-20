"use client";

import { Package, Bike, Settings, Star } from "lucide-react";
import { ProductCategory } from "@/lib/types";

type Tab = "All" | ProductCategory;

const TABS: { label: Tab; icon: React.ReactNode }[] = [
  { label: "All", icon: <Package size={14} /> },
  { label: "Motorcycles", icon: <Bike size={14} /> },
  { label: "Parts", icon: <Settings size={14} /> },
  { label: "Accessories", icon: <Star size={14} /> },
];

interface CategoryTabsProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {TABS.map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            active === label
              ? "bg-accent-red text-white"
              : "bg-bg-card text-text-secondary hover:text-white hover:bg-bg-overlay"
          }`}
        >
          {icon}
          {label}
          {active === label && <span className="ml-0.5">✓</span>}
        </button>
      ))}
    </div>
  );
}
