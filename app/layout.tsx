import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moto Marketplace — Buy, Rent & Service Motorcycles",
  description:
    "The ultimate motorcycle marketplace. Buy and sell motorcycles, parts and accessories.",
  keywords: "motorcycles, marketplace, buy motorcycle, parts, accessories",
  openGraph: {
    title: "Moto Marketplace",
    description: "Buy, sell, and rent motorcycles in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
