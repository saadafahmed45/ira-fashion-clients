"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, ShoppingBag, Package, FolderOpen, PlusCircle, Settings, Menu, X, Users, Tag, Star, LogOut, ChevronRight } from "lucide-react";
import { brand } from "@/config/brand";
import useAuth from "../../../features/auth/hooks/useAuth";

const menuGroups = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/dashboard/addProducts", label: "Add Product", icon: PlusCircle },
      { href: "/dashboard/manageProduct", label: "Manage Products", icon: Package },
      { href: "/dashboard/addCollection", label: "Add Collection", icon: PlusCircle },
      { href: "/dashboard/manageCollections", label: "Manage Collections", icon: FolderOpen },
    ],
  },
  {
    label: "Commerce",
    items: [
      { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
      { href: "/dashboard/customers", label: "Customers", icon: Users },
      { href: "/dashboard/coupons", label: "Coupons", icon: Tag },
      { href: "/dashboard/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/dashboard/setting", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const close = () => setIsOpen(false);

  const navContent = (
    <div className="flex flex-col h-full bg-[#0f0f1a] text-white">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/8 flex-shrink-0">
        <Link href="/" onClick={close} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-xs font-black text-white shadow-lg shadow-brand/30">
            {brand.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-none tracking-wide">{brand.name}</p>
            <p className="text-[10px] text-brand-hover mt-0.5 uppercase tracking-widest">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      active
                        ? "bg-brand text-white shadow-md shadow-brand/20"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-white" : "text-white/40 group-hover:text-white/80"} />
                    <span className="flex-1 leading-none">{item.label}</span>
                    {active && <ChevronRight size={13} className="opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-white/8 flex-shrink-0 space-y-2">
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 flex-shrink-0 relative">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.name || "Admin"}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-brand flex items-center justify-center text-xs font-bold text-white">
                  {(user.name || "A")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white/90">{user.name || user.displayName}</p>
              <p className="text-[10px] text-brand-hover capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#0f0f1a] text-white rounded-lg shadow-lg border border-white/10"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40 w-64 flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {navContent}
      </aside>
    </>
  );
}
