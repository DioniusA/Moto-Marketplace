"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onFilterClick,
  placeholder = "Search motorcycles, parts etc...",
}: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <Search size={18} className="absolute left-4 text-text-muted z-10" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg-card text-white placeholder-text-muted rounded-2xl pl-12 pr-14 py-4 focus:outline-none focus:ring-1 focus:ring-border-subtle transition-colors duration-200"
      />
      <button
        onClick={onFilterClick}
        className="absolute right-4 text-text-muted hover:text-white transition-colors duration-200"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={18} />
      </button>
    </div>
  );
}
