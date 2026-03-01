import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const TZ = "Asia/Shanghai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", { month: "long", day: "numeric", timeZone: TZ });
}

export function formatDateTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
}

export function getRelativeTime(date: Date | string) {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return formatDate(date);
}

/** 返回 UTC Date 对应的中国日期字符串 "YYYY-MM-DD" */
export function toChinaDateStr(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("sv-SE", { timeZone: TZ }); // sv-SE locale gives "YYYY-MM-DD"
}

/** 将客户端发来的无时区日期字符串按中国时间解析，返回 UTC ISO 字符串 */
export function toISOFromChinaTime(localStr: string): string {
  if (localStr.includes("T")) {
    return new Date(localStr + "+08:00").toISOString();
  }
  return new Date(localStr + "T00:00:00+08:00").toISOString();
}

export function getDayStart(date: Date = new Date()) {
  const chinaDateStr = toChinaDateStr(date);
  return new Date(chinaDateStr + "T00:00:00+08:00");
}

export function getDayEnd(date: Date = new Date()) {
  const chinaDateStr = toChinaDateStr(date);
  return new Date(chinaDateStr + "T23:59:59.999+08:00");
}

export function minutesToHoursMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}分钟`;
  if (m === 0) return `${h}小时`;
  return `${h}小时${m}分钟`;
}
