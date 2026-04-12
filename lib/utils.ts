import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  if (remaining === 0) return `${hours}h`
  return `${hours}h${remaining.toString().padStart(2, "0")}`
}

export function formatArrondissement(n: number): string {
  if (n === 1) return "1er arr."
  return `${n}e arr.`
}

// Category icon names map to Lucide icon components
// Used by CategoryIcon component in components/lasso/CategoryIcon.tsx
const CATEGORY_ICON: Record<string, string> = {
  aide_personne: "HandHeart",
  environnement: "Leaf",
  education: "GraduationCap",
  logistique: "Package",
  autre: "Sparkles",
}

export function getCategoryIconName(category: string): string {
  return CATEGORY_ICON[category] ?? "Sparkles"
}

const CATEGORY_LABEL: Record<string, string> = {
  aide_personne: "Aide à la personne",
  environnement: "Environnement",
  education: "Éducation",
  logistique: "Logistique",
  autre: "Autre",
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABEL[category] ?? category
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date)
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return "a l'instant"
  if (diffMin < 60) return `il y a ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `il y a ${diffD}j`
  return formatDate(date)
}

export function generateGoogleCalendarUrl({
  title,
  startDate,
  endDate,
  location,
  description,
}: {
  title: string
  startDate: Date
  endDate: Date
  location?: string
  description?: string
}): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(startDate)}/${fmt(endDate)}`,
    ...(location && { location }),
    ...(description && { details: description }),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
