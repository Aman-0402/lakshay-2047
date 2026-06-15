import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type TeamWithMembers = Prisma.TeamGetPayload<{
  include: {
    members: {
      include: {
        user: { select: { id: true; name: true; image: true } }
      }
    }
  }
}>

const createTeamSchema = z.object({
  name: z.string().min(3, 'Min 3 chars').max(60, 'Max 60 chars'),
  description: z.string().min(10, 'Min 10 chars').max(500, 'Max 500 chars'),
  skills: z.array(z.string().min(1)).min(1, 'Add at least one skill').max(10, 'Max 10 skills'),
  projectIdea: z.string().max(300, 'Max 300 chars').optional(),
  maxMembers: z.number().int().min(2).max(10).optional(),
})

function serializeTeam(team: TeamWithMembers) {
  return {
    ...team,
    skills: team.skills as string[],
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
    members: team.members.map((m) => ({
      ...m,
      joinedAt: m.joinedAt.toISOString(),
    })),
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const skillsParam = searchParams.get('skills')
    const filterSkills = skillsParam
      ? skillsParam.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const teams = await prisma.team.findMany({
      where: { isOpen: true },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { joinedAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const filtered =
      filterSkills.length > 0
        ? teams.filter((t) => {
            const teamSkills = t.skills as string[]
            return filterSkills.some((s) => teamSkills.includes(s))
          })
        : teams

    return NextResponse.json(filtered.map(serializeTeam))
  } catch (err) {
    console.error('[GET /api/teams]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createTeamSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const { name, description, skills, projectIdea, maxMembers = 5 } = parsed.data

    const team = await prisma.team.create({
      data: {
        name,
        description,
        skills,
        projectIdea: projectIdea ?? null,
        maxMembers,
        members: {
          create: {
            userId: session.user.id,
            isLeader: true,
          },
        },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
    })

    return NextResponse.json(serializeTeam(team), { status: 201 })
  } catch (err) {
    console.error('[POST /api/teams]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
