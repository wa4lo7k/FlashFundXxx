import { AdminAuthProvider } from '@/lib/admin-auth-context'

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  )
}
