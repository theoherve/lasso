"use client"

import { useState } from "react"
import { useMe, useMyBadges, useUpdateMe } from "@/lib/api/queries/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ReliabilityScore } from "@/components/lasso/ReliabilityScore"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, Pencil, Check, X, Trophy, Building2 } from "lucide-react"

export default function ProfilePage() {
  const { data: user, isLoading: userLoading } = useMe()
  const { data: badgesResp, isLoading: badgesLoading } = useMyBadges()
  const updateMe = useUpdateMe()

  const loading = userLoading || badgesLoading
  const saving = updateMe.isPending
  const badges = badgesResp?.badges ?? []
  const stats = badgesResp?.stats ?? { missionsCompleted: 0, totalHours: 0 }

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    name: "",
    arrondissement: "",
    bio: "",
  })

  function enterEditMode() {
    if (user) {
      setForm({
        firstName: user.firstName ?? "",
        name: user.name ?? "",
        arrondissement: user.arrondissement ? String(user.arrondissement) : "",
        bio: user.bio ?? "",
      })
    }
    setEditing(true)
  }

  async function handleSave() {
    const input: Parameters<typeof updateMe.mutateAsync>[0] = {}
    if (form.firstName) input.firstName = form.firstName
    if (form.name) input.name = form.name
    if (form.bio) input.bio = form.bio
    if (form.arrondissement) input.arrondissement = Number(form.arrondissement)

    try {
      await updateMe.mutateAsync(input)
      setEditing(false)
    } catch {
      // error state surfaced via mutation.isError if needed — keep silent for now
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!user) return null

  const initials = [user.firstName?.[0], user.name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || user.email[0].toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mon profil</h2>
        {!editing ? (
          <Button variant="secondary" size="sm" onClick={enterEditMode}>
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(false)}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Annuler
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Check className="mr-1 h-3.5 w-3.5" />
              Sauvegarder
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.firstName ?? ""} />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>

            {editing ? (
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">Prenom</Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, firstName: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="arrondissement">Arrondissement</Label>
                  <Input
                    id="arrondissement"
                    type="number"
                    min={1}
                    max={20}
                    value={form.arrondissement}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, arrondissement: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={form.bio}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bio: e.target.value }))
                    }
                    maxLength={500}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">
                    {user.firstName} {user.name}
                  </h3>
                  <ReliabilityScore score={user.reliabilityScore} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.arrondissement && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {user.arrondissement}e arrondissement
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!editing && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <CalendarDays className="mb-2 h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {stats.missionsCompleted}
              </span>
              <span className="text-sm text-muted-foreground">
                Missions realisees
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <Clock className="mb-2 h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {stats.totalHours}h
              </span>
              <span className="text-sm text-muted-foreground">
                Heures donnees
              </span>
            </CardContent>
          </Card>
        </div>
      )}

      {!editing && badges.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Trophy className="h-4 w-4 text-primary" />
              Badges ({badges.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5"
                  title={badge.description}
                >
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!editing && user.bio && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 font-semibold">A propos</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {user.bio}
            </p>
          </CardContent>
        </Card>
      )}

      {!editing && (
        <Link href="/devenir-association">
          <Card className="transition-all hover:shadow-(--shadow-warm)">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                <Building2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium">Vous etes une association ?</p>
                <p className="text-xs text-muted-foreground">
                  Inscrivez votre asso et publiez vos missions
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  )
}
