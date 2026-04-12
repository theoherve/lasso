"use client"

import { Suspense, useEffect, useState, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Search, ArrowRight, MapPin, X } from "lucide-react"
import { FilterChips } from "@/components/lasso/FilterChips"
import { MissionCard } from "@/components/lasso/MissionCard"
import { EmptyState } from "@/components/lasso/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const categoryOptions = [
  { value: "aide_personne", label: "Aide à la personne" },
  { value: "environnement", label: "Environnement" },
  { value: "education", label: "Éducation" },
  { value: "autre", label: "Autre" },
]

const arrondissementOptions = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}${i === 0 ? "er" : "e"} arrondissement`,
  short: `${i + 1}${i === 0 ? "er" : "e"}`,
}))

interface Mission {
  id: string
  title: string
  category: string
  durationMin: number
  address: string | null
  association: {
    name: string
    slug: string
    logoUrl: string | null
    arrondissement: number
  }
  nextSlot: {
    startsAt: string
    spotsRemaining: number
  } | null
}

function ArrondissementSelect({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (values: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent"
      >
        <MapPin className="h-3.5 w-3.5" />
        {selected.length === 0
          ? "Arrondissement"
          : `${selected.length} arr. sélectionné${selected.length > 1 ? "s" : ""}`}
      </button>

      {/* Selected badges */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((v) => {
            const opt = arrondissementOptions.find((o) => o.value === v)
            return (
              <Badge
                key={v}
                variant="secondary"
                className="cursor-pointer gap-1 pr-1.5 text-xs"
                onClick={() => toggle(v)}
              >
                {opt?.short ?? v}
                <X className="h-3 w-3" />
              </Badge>
            )
          })}
          <button
            type="button"
            onClick={() => onChange([])}
            className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
          >
            Tout effacer
          </button>
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-lg">
          <div className="grid grid-cols-4 gap-1">
            {arrondissementOptions.map((opt) => {
              const isActive = selected.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={`cursor-pointer rounded-lg px-2 py-2 text-center text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {opt.short}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function FeedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  const firstName = session?.user?.name?.split(" ")[0] ?? null

  const selectedCategories = searchParams.get("category")?.split(",").filter(Boolean) ?? []
  const selectedArrondissements = searchParams.get("arrondissement")?.split(",").filter(Boolean) ?? []
  const searchQuery = searchParams.get("search") ?? ""

  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  function updateParams(key: string, values: string[] | string) {
    const params = new URLSearchParams(searchParams.toString())
    const val = Array.isArray(values) ? values.join(",") : values
    if (val) {
      params.set(key, val)
    } else {
      params.delete(key)
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  function handleSearchChange(value: string) {
    setLocalSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParams("search", value)
    }, 300)
  }

  const fetchMissions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","))
      if (selectedArrondissements.length > 0) params.set("arrondissement", selectedArrondissements.join(","))
      if (searchQuery) params.set("search", searchQuery)

      const res = await fetch(`/api/missions?${params.toString()}`)
      if (res.ok) {
        setMissions(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }, [searchParams.toString()])

  useEffect(() => {
    fetchMissions()
  }, [fetchMissions])

  return (
    <>
      {/* Header */}
      <div className="space-y-1">
        {isLoggedIn && firstName ? (
          <h2 className="text-2xl font-bold md:text-3xl">Salut {firstName} !</h2>
        ) : (
          <h2 className="text-2xl font-bold md:text-3xl">Trouve ta prochaine mission</h2>
        )}
        <p className="text-sm text-muted-foreground md:text-base">
          1 heure pour changer quelque chose
        </p>
      </div>

      {/* Signup banner for non-logged-in users */}
      {!isLoggedIn && (
        <div className="flex items-center gap-3 rounded-xl bg-primary/5 px-4 py-3 ring-1 ring-primary/10">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
          <p className="flex-1 text-sm text-foreground">
            Inscris-toi pour réserver ta première mission
          </p>
          <Link href="/register">
            <Button size="sm" className="shrink-0 cursor-pointer">
              Créer un compte
            </Button>
          </Link>
        </div>
      )}

      {/* Search + Filters row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Chercher une mission..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="rounded-full bg-card pl-10"
          />
        </div>
        <ArrondissementSelect
          selected={selectedArrondissements}
          onChange={(v) => updateParams("arrondissement", v)}
        />
      </div>

      {/* Category filters */}
      <FilterChips
        options={categoryOptions}
        selected={selectedCategories}
        onChange={(v) => updateParams("category", v)}
      />

      {/* Results */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : missions.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucune mission trouvée"
          description="Essaie de modifier tes filtres ou ta recherche pour trouver des missions."
        />
      )}
    </>
  )
}

function FeedFallback() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-48" />
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function FeedPage() {
  return (
    <div className="space-y-5">
      <Suspense fallback={<FeedFallback />}>
        <FeedContent />
      </Suspense>
    </div>
  )
}
