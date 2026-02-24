"use client";

import { useRouter } from "next/navigation";
import { Baby, Moon, Droplets, Thermometer } from "lucide-react";

const actions = [
  { label: "喂奶", icon: Baby, href: "/feeding", color: "bg-rose-50 border-rose-100 text-rose-600" },
  { label: "睡眠", icon: Moon, href: "/sleep", color: "bg-indigo-50 border-indigo-100 text-indigo-600" },
  { label: "换尿布", icon: Droplets, href: "/diaper", color: "bg-cyan-50 border-cyan-100 text-cyan-600" },
  { label: "记录体温", icon: Thermometer, href: "/health", color: "bg-gray-50 border-gray-200 text-gray-600" },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => router.push(action.href)}
          className={`flex flex-1 min-w-[5rem] flex-col items-center gap-2 rounded-xl border px-4 py-4 transition-colors hover:opacity-80 ${action.color}`}
        >
          <action.icon className="h-6 w-6" />
          <span className="text-sm font-medium whitespace-nowrap">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
