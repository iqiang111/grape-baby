"use client";

import { useTransition } from "react";
import { deleteDiaper } from "@/actions/diaper";
import { Trash2 } from "lucide-react";

export function DeleteDiaperButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => deleteDiaper(id))}
      className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
      aria-label="删除记录"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
