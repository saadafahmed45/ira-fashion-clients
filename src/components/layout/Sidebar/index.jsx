"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Users,
  ShieldCheck,
  Tag,
  Star,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/categories", label: "Categories", icon: FolderTree },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/admins", label: "Administrators", icon: ShieldCheck },
  { href: "/dashboard/coupons", label: "Coupons", icon: Tag },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-gray-900 text-white flex items-center justify-between px-4 z-40 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-sm tracking-widest uppercase">
            IRA ADMIN
          </span>
        </div>
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 uppercase tracking-wider"
        >
          Store <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] text-gray-300 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header / Brand */}
          <div className="p-6 border-b border-gray-800/80">
            <Link href="/" className="block">
              <span className="font-serif text-lg font-bold tracking-[0.25em] text-white uppercase block">
                IRA FASHION
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-amber-400 font-medium">
                Admin Management Console
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={`flex items-center gap-3 px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                    active
                      ? "bg-white text-gray-900 font-semibold"
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User & Logout Footer */}
        <div className="p-4 border-t border-gray-800/80 space-y-3">
          <div className="px-3 py-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Store</span>
            </Link>

            <button
              onClick={logout}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}
    </>
  );
}
