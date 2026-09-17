"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Instagram, Facebook, ShieldCheck } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return null;
  }

  return (
    <footer className="bg-[#111111] text-gray-400 border-t border-gray-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.25em] text-white font-bold uppercase">
                IRA FASHION
              </span>
              <p className="text-[10px] tracking-[0.35em] text-gray-500 uppercase mt-0.5">
                Haute Couture & Modest Wear
              </p>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm text-xs">
              Curating elevated modest wear, artisanal silk sarees, and contemporary
              silhouettes designed with uncompromising craftsmanship for the modern woman.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest">
              Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=dresses" className="hover:text-white transition-colors">
                  Evening Dresses
                </Link>
              </li>
              <li>
                <Link href="/products?category=abayas-modest-wear" className="hover:text-white transition-colors">
                  Dubai Abayas
                </Link>
              </li>
              <li>
                <Link href="/products?category=tops-tunics" className="hover:text-white transition-colors">
                  Tops & Tunics
                </Link>
              </li>
              <li>
                <Link href="/products?category=sarees-traditional" className="hover:text-white transition-colors">
                  Silk Sarees
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories-hijabs" className="hover:text-white transition-colors">
                  Hijabs & Clutches
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest">
              Client Services
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Cash on Delivery
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <span className="text-gray-500">Shipping: Nationwide 48-72h</span>
              </li>
              <li>
                <span className="text-gray-500">Free delivery over ৳2,000</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Contact */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest">
              Stay Connected
            </h4>
            <p className="text-gray-400 text-xs">
              Subscribe to receive exclusive seasonal previews and private member offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter email..."
                className="w-full bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-500"
              />
              <button className="bg-white text-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                Join
              </button>
            </div>
            <div className="pt-2 text-gray-500 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Guaranteed Authentic Fabrics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-600 gap-4">
          <p>© {new Date().getFullYear()} Ira Fashion. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">COD Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
