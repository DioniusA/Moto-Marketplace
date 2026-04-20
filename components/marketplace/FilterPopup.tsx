"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { MarketplaceFilters, FilterSort } from "@/lib/types";

const ACCESSORY_TYPES = [
  "Helmets", "Jackets", "Gloves", "Boots", "Bags", "Electronics", "Security", "Tools",
];

const SORT_OPTIONS: { label: string; value: FilterSort }[] = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Most Popular", value: "popular" },
];

interface FilterPopupProps {
  filters: MarketplaceFilters;
  onApply: (filters: Partial<MarketplaceFilters>) => void;
  onClose: () => void;
}

export default function FilterPopup({ filters, onApply, onClose }: FilterPopupProps) {
  const [priceMax, setPriceMax] = useState(filters.priceMax || 15000000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(filters.accessoryTypes || []);
  const [sort, setSort] = useState<FilterSort>(filters.sort || "newest");

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleApply = () => {
    onApply({ priceMax, accessoryTypes: selectedTypes, sort });
    onClose();
  };

  const handleClear = () => {
    setPriceMax(15000000);
    setSelectedTypes([]);
    setSort("newest");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-bg-card rounded-3xl p-6 w-full max-w-sm mx-4 z-10 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleClear}
            className="text-accent-red text-sm font-medium hover:opacity-80"
          >
            Clear All
          </button>
          <h2 className="text-white font-bold text-lg">Filters</h2>
          <button
            onClick={handleApply}
            className="text-accent-red text-sm font-medium hover:opacity-80"
          >
            Apply
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Price Range</h3>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-text-muted">₸ 0</span>
            <span className="text-accent-red">₸ {priceMax.toLocaleString("ru-RU")}</span>
          </div>
          <input
            type="range"
            min={0}
            max={15000000}
            step={100000}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #E5194B ${(priceMax / 15000000) * 100}%, #333 ${(priceMax / 15000000) * 100}%)`,
            }}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Accessory Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {ACCESSORY_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedTypes.includes(type)
                    ? "bg-accent-red text-white"
                    : "bg-bg-overlay text-text-secondary hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Sort by</h3>
          <div className="space-y-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSort(option.value)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  sort === option.value
                    ? "text-white font-bold"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
