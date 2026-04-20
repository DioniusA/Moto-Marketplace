import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-white text-lg mb-6">Product not found</p>
        <Link href="/marketplace" className="btn-primary inline-block">
          Back to Marketplace
        </Link>
      </div>
    </div>
  );
}
