"use client";

import Link from "next/link";
import { Brand } from "@/lib/types";

const BRAND_LOGOS: Record<string, React.ReactNode> = {
  Yamaha: (
    <svg viewBox="0 0 60 60" className="w-10 h-10" fill="white">
      <circle cx="30" cy="30" r="26" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M30 8 L38 26 L56 26 L42 37 L47 55 L30 44 L13 55 L18 37 L4 26 L22 26 Z" fill="white"/>
    </svg>
  ),
  Honda: (
    <svg viewBox="0 0 80 40" className="w-16 h-8" fill="none">
      <path d="M8 8h6v10h8V8h6v24h-6V24h-8v8H8V8z" fill="#E00"/>
      <path d="M32 8h16c4 0 6 2 6 6v4c0 3-2 5-5 5h-11v7h-6V8zm6 10h8c1 0 2-1 2-2V14c0-1-1-2-2-2h-8v6z" fill="#E00"/>
      <path d="M58 8h6v24h-6z" fill="#E00"/>
    </svg>
  ),
  Kawasaki: (
    <svg viewBox="0 0 60 60" className="w-10 h-10" fill="none">
      <rect width="60" height="60" rx="4" fill="none"/>
      <path d="M10 15h8L30 30 18 45h-8L22 30z" fill="white"/>
      <path d="M22 15h8L42 30 30 45h-8L34 30z" fill="white" opacity="0.6"/>
      <path d="M34 15h8L54 30 42 45h-8L46 30z" fill="white" opacity="0.3"/>
    </svg>
  ),
  Suzuki: (
    <svg viewBox="0 0 80 40" className="w-16 h-8" fill="none">
      <path d="M10 30 L30 10 L50 10 L30 30 L50 30 L70 10" stroke="#005BAA" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  BMW: (
    <svg viewBox="0 0 60 60" className="w-10 h-10" fill="none">
      <circle cx="30" cy="30" r="26" stroke="white" strokeWidth="2"/>
      <path d="M30 4 L30 30 L4 30" fill="#0066B2"/>
      <path d="M30 30 L56 30 L30 56" fill="#0066B2"/>
      <path d="M30 4 L56 30 L30 30 L30 4" fill="white"/>
      <path d="M4 30 L30 56 L30 30 L4 30" fill="white"/>
      <circle cx="30" cy="30" r="8" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  ),
  Ducati: (
    <svg viewBox="0 0 80 40" className="w-16 h-8" fill="none">
      <rect x="5" y="10" width="30" height="20" rx="3" fill="#CC0000"/>
      <text x="5" y="26" fontSize="14" fontWeight="bold" fill="white" fontFamily="Arial">DUCATI</text>
    </svg>
  ),
  Harley: (
    <svg viewBox="0 0 80 50" className="w-16 h-10" fill="none">
      <ellipse cx="40" cy="25" rx="35" ry="20" fill="#FF6600"/>
      <text x="40" y="20" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">HARLEY</text>
      <text x="40" y="30" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle">DAVIDSON</text>
    </svg>
  ),
  More: (
    <svg viewBox="0 0 60 60" className="w-10 h-10" fill="none">
      <rect x="10" y="10" width="40" height="40" rx="8" stroke="white" strokeWidth="2"/>
      <path d="M20 30 L30 20 L40 30 L30 40 Z" stroke="white" strokeWidth="2"/>
    </svg>
  ),
};

const DEFAULT_BRANDS = [
  { id: "1", name: "Yamaha", total_sales_eth: 34.53 },
  { id: "2", name: "Honda", total_sales_eth: 34.62 },
  { id: "3", name: "Kawasaki", total_sales_eth: 34.63 },
  { id: "4", name: "Suzuki", total_sales_eth: 34.02 },
  { id: "5", name: "BMW", total_sales_eth: 34.55 },
  { id: "6", name: "Ducati", total_sales_eth: 34.53 },
  { id: "7", name: "Harley", total_sales_eth: 34.63 },
  { id: "8", name: "More", total_sales_eth: 34.53 },
];

interface BrandGridProps {
  brands?: Brand[];
}

export default function BrandGrid({ brands }: BrandGridProps) {
  const data = brands && brands.length > 0 ? brands : DEFAULT_BRANDS;

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((brand, i) => (
        <Link
          key={brand.id}
          href={`/marketplace?brand=${brand.name === "More" ? "" : brand.name}`}
          className="group"
        >
          <div className="bg-bg-card rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-bg-overlay transition-colors duration-200 relative">
            <span className="absolute top-3 left-3 text-xs text-text-muted font-medium">
              {i + 1}
            </span>
            <div className="w-16 h-16 flex items-center justify-center">
              {BRAND_LOGOS[brand.name] ?? (
                <span className="text-white font-bold text-lg">{brand.name[0]}</span>
              )}
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">{brand.name}</p>
              <p className="text-text-muted text-xs">
                Total Sales:{" "}
                <span className="text-primary font-medium">{brand.total_sales_eth} ETH</span>
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
