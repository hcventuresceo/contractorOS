"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HardHat,
  FolderKanban,
  FileText,
  Calculator,
  ShieldCheck,
  Building2,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Contractors", href: "/contractors", icon: HardHat },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Estimates", href: "/estimates", icon: Calculator },
  { name: "Compliance", href: "/compliance", icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-700">
        <Building2 className="h-8 w-8 text-blue-400" />
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">
            contractorOS
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">
            HC Ventures
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-700 p-4">
        <p className="text-xs text-slate-500">&copy; 2026 HC Ventures</p>
      </div>
    </aside>
  );
}
