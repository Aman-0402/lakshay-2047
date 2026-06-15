import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: teamId } = await params

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    })

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    if (!team.isOpen) {
      return NextResponse.json({ error: 'Team is closed' }, { status: 409 })
    }

    const alreadyMember = team.members.some((m) => m.userId === session.user.id)
    if (alreadyMember) {
      return NextResponse.json({ error: 'Already a member' }, { status: 409 })
    }

    if (team.members.length >= team.maxMembers) {
      return NextResponse.json({ error: 'Team is full' }, { status: 409 })
    }

    const member = await prisma.teamMember.create({
      data: { teamId, userId: session.user.id, isLeader: false },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    return NextResponse.json(
      {
        ...member,
        joinedAt: member.joinedAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/teams/[id]/join]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
