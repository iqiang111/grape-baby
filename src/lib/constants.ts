export const BABY_ID = "default-baby";

export const FEEDING_TYPES = {
  formula: "奶粉",
  rice_cereal: "米粉",
} as const;

export const DIAPER_TYPES = {
  wet: "小便",
  dirty: "大便",
  both: "大小便",
} as const;

export const SLEEP_QUALITY = {
  good: "好",
  normal: "一般",
  poor: "差",
} as const;

export const MILESTONE_CATEGORIES = {
  motor: "运动发育",
  language: "语言发育",
  social: "社交情感",
  cognitive: "认知发育",
} as const;

export const TEMPERATURE_METHODS = {
  ear: "耳温",
  forehead: "额温",
  armpit: "腋温",
  rectal: "肛温",
} as const;

export const NAV_ITEMS = [
  { href: "/", label: "首页", icon: "Home" },
  { href: "/feeding", label: "喂奶", icon: "Baby" },
  { href: "/sleep", label: "睡眠", icon: "Moon" },
  { href: "/diaper", label: "换尿布", icon: "Droplets" },
  { href: "/growth", label: "成长", icon: "TrendingUp" },
  { href: "/health", label: "健康", icon: "Heart" },
  { href: "/milestones", label: "里程碑", icon: "Star" },
] as const;
