import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProfileCard from '@/components/dashboard/ProfileCard'
import BookingList from '@/components/dashboard/BookingList'
import type { SerializedBookingWithLab } from '@/types/booking'
import type { UserProfile } from '@/types/user'

export const metadata: Metadata = {
  title: 'Dashboard — Lakshay 2047',
  description: 'Your bookings and profile at Parul University Centre of Future Skills.',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  // Fetch user profile from DB
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      rollNumber: true,
      department: true,
      year: true,
    },
  })

  const user: UserProfile = {
    id: dbUser?.id ?? session.user.id,
    name: dbUser?.name ?? session.user.name ?? null,
    email: dbUser?.email ?? session.user.email ?? '',
    image: dbUser?.image ?? session.user.image ?? null,
    role: (dbUser?.role as UserProfile['role']) ?? 'STUDENT',
    rollNumber: dbUser?.rollNumber ?? null,
    department: dbUser?.department ?? null,
    year: dbUser?.year ?? null,
  }

  // Fetch bookings with lab info
  const rows = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: {
      lab: {
        select: { id: true, name: true, slug: true, category: true, location: true },
      },
    },
    orderBy: { date: 'desc' },
  })

  const bookings: SerializedBookingWithLab[] = rows.map((b) => ({
    ...b,
    date: b.date.toISOString(),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    status: b.status as SerializedBookingWithLab['status'],
    lab: {
      ...b.lab,
      category: b.lab.category as SerializedBookingWithLab['lab']['category'],
    },
  }))

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
            Student Portal
          </p>
          <h1 className="font-heading font-bold text-3xl text-white">
            My Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
          {/* Profile */}
          <aside>
            <ProfileCard user={user} />
          </aside>

          {/* Bookings */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-semibold text-white text-lg">
                My Bookings
              </h2>
              <a
                href="/labs"
                className="text-xs text-accent hover:underline"
              >
                + Book a Lab
              </a>
            </div>
            <BookingList bookings={bookings} />
          </section>
        </div>
      </div>
    </main>
  )
}
