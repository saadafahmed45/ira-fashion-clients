import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Shield, Truck, RefreshCw } from "lucide-react";
import { brand } from "@/config/brand";

const features = [
  { icon: Truck, title: "Free Shipping", desc: `On orders over $${brand.shipping.freeThreshold}` },
  { icon: Shield, title: "Secure Payment", desc: "100% secure checkout" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Heart, title: "Premium Quality", desc: "Curated collections" },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-b border-stone-100">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-stone-100 flex items-center justify-center">
                  <Icon size={18} className="text-stone-700" />
                </div>
                <p className="text-sm font-semibold text-stone-900">{f.title}</p>
                <p className="text-xs text-stone-400">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          <div>
            <h3 className="text-lg font-bold mb-4">
              <span className="text-stone-900">{brand.name}</span>
            </h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Premium clothing and accessories curated for the modern individual.
              Discover your style with {brand.name}.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">Shop</h4>
            <ul className="space-y-2">
              {[
                { label: "All Products", href: "/product" },
                { label: "New Arrivals", href: "/new-arrivals" },
                { label: "Clothing", href: "/product?productType=Clothing" },
                { label: "Accessories", href: "/product?productType=Accessories" },
                { label: "Sale", href: "/product?status=active" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "#" },
                { label: "Shipping Info", href: "#" },
                { label: "Returns", href: "#" },
                { label: "Size Guide", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "#" },
                { label: "Terms & Conditions", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Careers", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-stone-100 text-center text-xs text-stone-400">
          &copy; {new Date().getFullYear()} Ira&apos;s Fashion. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
