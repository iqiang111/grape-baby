"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Baby,
  Moon,
  Droplets,
  TrendingUp,
  Heart,
  Star,
  MoreHorizontal,
  Download,
} from "lucide-react";

const items = [
  { href: "/", label: "首页", icon: Home },
  { href: "/feeding", label: "喂奶", icon: Baby },
  { href: "/sleep", label: "睡眠", icon: Moon },
  { href: "/diaper", label: "尿布", icon: Droplets },
  { href: "/growth", label: "成长", icon: TrendingUp },
  { href: "/health", label: "健康", icon: Heart },
  { href: "/milestones", label: "里程碑", icon: Star },
];

const mainItems = items.slice(0, 4);
const morePaths = ["/more", "/growth", "/health", "/milestones", "/calendar"];

export function MobileNav() {
  const pathname = usePathname();
  const isMoreActive = morePaths.includes(pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white pb-safe md:hidden">
      <div className="flex items-center justify-around px-1 py-1">
        {mainItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs transition-colors",
                active
                  ? "text-indigo-500 bg-indigo-50"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <item.icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/more"
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs transition-colors",
            isMoreActive
              ? "text-indigo-500 bg-indigo-50"
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          <MoreHorizontal className={cn("h-5 w-5", isMoreActive && "stroke-[2.5]")} />
          <span>更多</span>
        </Link>
      </div>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 bg-white">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white text-lg">
          🍇
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">小葡萄</h1>
          <p className="text-xs text-gray-500">成长记录</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => { window.location.href = "/api/export"; }}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900 w-full"
        >
          <Download className="h-5 w-5" />
          导出数据
        </button>
      </div>
    </aside>
  );
}
