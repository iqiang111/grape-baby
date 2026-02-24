"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { addMilestone } from "@/actions/milestones";
import { MILESTONE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { X, Clock, Camera, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DateTimeWheelPicker } from "@/components/ui/datetime-wheel-picker";

const CATEGORY_STYLES: Record<string, { bg: string; bgSelected: string; border: string; text: string; icon: typeof Star }> = {
  motor: {
    bg: "bg-orange-50",
    bgSelected: "bg-orange-400 text-white",
    border: "border-orange-200",
    text: "text-orange-600",
    icon: Sparkles,
  },
  language: {
    bg: "bg-blue-50",
    bgSelected: "bg-blue-500 text-white",
    border: "border-blue-200",
    text: "text-blue-600",
    icon: Star,
  },
  social: {
    bg: "bg-pink-50",
    bgSelected: "bg-pink-400 text-white",
    border: "border-pink-200",
    text: "text-pink-600",
    icon: Star,
  },
  cognitive: {
    bg: "bg-violet-50",
    bgSelected: "bg-violet-400 text-white",
    border: "border-violet-200",
    text: "text-violet-600",
    icon: Sparkles,
  },
};

function toLocalDatetimeValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

interface MilestoneFormProps {
  open: boolean;
  onClose: () => void;
}

export function MilestoneForm({ open, onClose }: MilestoneFormProps) {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState(() => toLocalDatetimeValue(new Date()));
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDate(toLocalDatetimeValue(new Date()));
      setTitle("");
      setCategory("");
      setDescription("");
      setPhoto("");
      setUploading(false);
    }
  }, [open]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (res.ok) {
        setPhoto(json.path);
      } else {
        alert(json.error || "上传失败");
      }
    } catch {
      alert("上传失败，请重试");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !category) return;
    startTransition(async () => {
      await addMilestone({
        date,
        title: title.trim(),
        category,
        description: description.trim() || undefined,
        photo: photo || undefined,
      });
      onClose();
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[60] max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white/95 backdrop-blur-xl shadow-2xl pb-safe"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1.5 w-12 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h2 className="text-lg font-bold text-gray-900">记录新里程碑</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-8">
              {/* Date */}
              <DateTimeWheelPicker label="时间" value={date} onChange={setDate} />

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  里程碑标题
                </label>
                <input
                  type="text"
                  placeholder="例如：第一次翻身"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  类别
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(MILESTONE_CATEGORIES) as [string, string][]).map(
                    ([key, label]) => {
                      const style = CATEGORY_STYLES[key];
                      const Icon = style.icon;
                      const selected = category === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCategory(key)}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-sm font-medium transition-all active:scale-[0.97]",
                            selected
                              ? `${style.border} ${style.bg} ${style.text} shadow-sm`
                              : "border-gray-100 bg-white text-muted-foreground hover:border-gray-200"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                              selected ? style.bgSelected : `${style.bg} ${style.text}`
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  描述 (可选)
                </label>
                <textarea
                  rows={3}
                  placeholder="记录这个珍贵的瞬间..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Photo upload */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Camera className="h-4 w-4" />
                  照片 (可选)
                </label>
                {photo ? (
                  <div className="relative inline-block">
                    <img
                      src={photo}
                      alt="已上传"
                      className="h-24 w-24 rounded-xl object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => { setPhoto(""); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white text-xs"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-500"
                  >
                    <Camera className="h-5 w-5" />
                    {uploading ? "上传中..." : "点击上传照片"}
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!title.trim() || !category || isPending}
                className={cn(
                  "w-full rounded-2xl py-4 text-base font-semibold transition-all active:scale-[0.98]",
                  title.trim() && category
                    ? "bg-gray-900 text-white shadow-lg shadow-lg hover:shadow-xl"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                )}
              >
                {isPending ? "保存中..." : "记录里程碑"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
