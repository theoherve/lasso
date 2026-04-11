import { MapPlaceholder } from "@/components/lasso/MapPlaceholder"

export default function MapPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Carte des missions</h2>
      <MapPlaceholder height="h-[calc(100vh-8rem)]" />
    </div>
  )
}
