import { AdminSidebar } from "@/components/layouts/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background px-4 py-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
