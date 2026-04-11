"use client"

import { cn } from "@/lib/utils"

interface FilterOption {
  value: string
  label: string
}

interface FilterChipsProps {
  options: FilterOption[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function FilterChips({ options, selected, onChange }: FilterChipsProps) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {options.map((option) => {
        const isActive = selected.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={cn(
              "flex-shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
