export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  condition: (stats: VolunteerStats) => boolean
}

export interface VolunteerStats {
  missionsCompleted: number
  totalHours: number
  uniqueAssociations: number
  reliabilityScore: number
  streak: number // consecutive completed without no-show
}

export const BADGES: BadgeDefinition[] = [
  {
    id: "first_mission",
    name: "Premier pas",
    description: "A complete sa premiere mission",
    icon: "🌱",
    condition: (s) => s.missionsCompleted >= 1,
  },
  {
    id: "five_missions",
    name: "Engage",
    description: "5 missions completees",
    icon: "⭐",
    condition: (s) => s.missionsCompleted >= 5,
  },
  {
    id: "ten_missions",
    name: "Pilier",
    description: "10 missions completees",
    icon: "🏆",
    condition: (s) => s.missionsCompleted >= 10,
  },
  {
    id: "twenty_five_missions",
    name: "Legende",
    description: "25 missions completees",
    icon: "👑",
    condition: (s) => s.missionsCompleted >= 25,
  },
  {
    id: "ten_hours",
    name: "10 heures",
    description: "10 heures de benevolat cumulees",
    icon: "⏰",
    condition: (s) => s.totalHours >= 10,
  },
  {
    id: "fifty_hours",
    name: "50 heures",
    description: "50 heures de benevolat cumulees",
    icon: "🔥",
    condition: (s) => s.totalHours >= 50,
  },
  {
    id: "three_assos",
    name: "Curieux",
    description: "A aide 3 associations differentes",
    icon: "🌍",
    condition: (s) => s.uniqueAssociations >= 3,
  },
  {
    id: "reliable",
    name: "Fiable",
    description: "Score de fiabilite superieur a 4.5",
    icon: "💎",
    condition: (s) => s.reliabilityScore >= 4.5 && s.missionsCompleted >= 3,
  },
  {
    id: "streak_five",
    name: "Serie de 5",
    description: "5 missions d'affilee sans absence",
    icon: "🎯",
    condition: (s) => s.streak >= 5,
  },
]

export function computeEarnedBadges(stats: VolunteerStats): BadgeDefinition[] {
  return BADGES.filter((b) => b.condition(stats))
}
