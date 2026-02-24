"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { MilestoneForm } from "@/components/milestones/milestone-form";
import { motion } from "framer-motion";

export function MilestonePageClient() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating add button */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.92 }}
        className="fixed right-5 bottom-24 md:bottom-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg shadow-lg transition-shadow hover:shadow-xl hover:shadow-lg"
        aria-label="添加里程碑"
      >
        <Plus className="h-7 w-7" />
      </motion.button>

      {/* Form sheet */}
      <MilestoneForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}
