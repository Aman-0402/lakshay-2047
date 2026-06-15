import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Users, Clock, MapPin, ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/constants'
import type { LabCategory } from '@/types/lab'

interface PageProps {
  params: Promise<{ slug: string }>
}

// ── Static enrichment maps ───────────────────────────────────────────────────

const RESEARCH_AREAS: Record<LabCategory, { num: string; title: string; desc: string }[]> = {
  AI_ML: [
    { num: '01', title: 'Deep Learning', desc: 'Neural architecture search and large-scale model training' },
    { num: '02', title: 'Computer Vision', desc: 'Real-time image recognition and spatial reasoning systems' },
    { num: '03', title: 'NLP & Reasoning', desc: 'Large language models and structured reasoning pipelines' },
  ],
  ROBOTICS: [
    { num: '01', title: 'Swarm Intelligence', desc: 'Cooperative multi-agent systems for logistics and mapping' },
    { num: '02', title: 'Soft Robotics', desc: 'Bio-inspired flexible actuators and compliant sensors' },
    { num: '03', title: 'Haptic Control', desc: 'Low-latency force feedback for remote teleoperations' },
  ],
  DESIGN: [
    { num: '01', title: 'Human-Centred Design', desc: 'Ethnographic research and empathy-driven prototyping' },
    { num: '02', title: 'Design Systems', desc: 'Scalable component libraries and design language systems' },
    { num: '03', title: 'Speculative Futures', desc: 'Design fiction and scenario-based future thinking' },
  ],
  HARDWARE: [
    { num: '01', title: 'Edge Computing', desc: 'Ultra-low power MCU design for constrained environments' },
    { num: '02', title: 'PCB Engineering', desc: 'Multi-layer board design and high-frequency signal integrity' },
    { num: '03', title: 'IoT Mesh Networks', desc: 'Resilient mesh protocols for sensor-dense deployments' },
  ],
  MEDIA: [
    { num: '01', title: 'Immersive Storytelling', desc: '360° production pipelines and spatial audio design' },
    { num: '02', title: 'Generative Media', desc: 'AI-driven content synthesis for film and interactive formats' },
    { num: '03', title: 'Documentary Research', desc: 'Long-form narrative and investigative journalism methods' },
  ],
  EXTENDED_REALITY: [
    { num: '01', title: 'Spatial Computing', desc: 'Room-scale environment mapping and persistent AR overlays' },
    { num: '02', title: 'Mixed Reality Interfaces', desc: 'Holographic UI design for industrial and medical contexts' },
    { num: '03', title: 'VR Simulation', desc: 'Physiology-safe immersive training environment design' },
  ],
  CYBERSECURITY: [
    { num: '01', title: 'Red Team Ops', desc: 'Adversarial simulation against live enterprise environments' },
    { num: '02', title: 'Threat Intelligence', desc: 'OSINT pipelines and automated malware attribution' },
    { num: '03', title: 'Zero-Trust Architecture', desc: 'Identity-first network segmentation and policy enforcement' },
  ],
  BIOTECH: [
    { num: '01', title: 'Bioinformatics', desc: 'Genomic sequence analysis and protein structure prediction' },
    { num: '02', title: 'Lab-on-Chip', desc: 'Microfluidic device design for point-of-care diagnostics' },
    { num: '03', title: 'Synthetic Biology', desc: 'Genetic circuit design and metabolic pathway engineering' },
  ],
}

const SOFTWARE_BY_CATEGORY: Record<LabCategory, string[]> = {
  AI_ML: ['Python 3.11', 'PyTorch 2', 'TensorFlow', 'Jupyter', 'CUDA 12', 'MLflow', 'Weights & Biases'],
  ROBOTICS: ['ROS 2 Humble', 'Gazebo', 'MATLAB R2024a', 'Python', 'ABB RobotStudio', 'MoveIt 2'],
  DESIGN: ['Figma', 'Adobe Creative Suite', 'Miro', 'Framer', 'Principle', 'Rhino 3D'],
  HARDWARE: ['KiCad 7', 'LTspice', 'Arduino IDE', 'STM32CubeIDE', 'Altium Designer', 'LabVIEW'],
  MEDIA: ['DaVinci Resolve', 'Adobe Premiere', 'Ableton Live', 'After Effects', 'ProTools', 'Unreal Engine'],
  EXTENDED_REALITY: ['Unity 2023', 'Unreal Engine 5', 'Meta XR SDK', 'ARKit', 'ARCore', 'Blender 4'],
  CYBERSECURITY: ['Kali Linux', 'Metasploit', 'Burp Suite Pro', 'Wireshark', 'Ghidra', 'Splunk'],
  BIOTECH: ['BioPython', 'MATLAB', 'ImageJ', 'SnapGene', 'Galaxy Platform', 'R / Bioconductor'],
}

// ── Floor plan SVG ───────────────────────────────────────────────────────────

function FloorPlanSVG({ color }: { color: string }) {
  const rows = 4
  const cols = 6
  const cellW = 52
  const cellH = 44
  const padX = 48
  const padY = 40
  const totalW = padX * 2 + cols * cellW + (cols - 1) * 8
  const totalH = padY * 2 + rows * cellH + (rows - 1) * 10

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      className="w-full h-full"
      style={{ fontFamily: 'monospace' }}
    >
      {/* Background */}
      <rect width={totalW} height={totalH} fill="#0A0A0F" />

      {/* Grid lines (blueprint style) */}
      {Array.from({ length: cols + 1 }).map((_, i) => {
        const x = padX + i * (cellW + 8) - (i > 0 ? 8 : 0)
        return (
          <line
            key={`vg-${i}`}
            x1={padX + i * (cellW + 8)}
            y1={0}
            x2={padX + i * (cellW + 8)}
            y2={totalH}
            stroke={`${color}12`}
            strokeWidth={0.5}
            strokeDasharray="2,4"
          />
        )
      })}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line
          key={`hg-${i}`}
          x1={0}
          y1={padY + i * (cellH + 10)}
          x2={totalW}
          y2={padY + i * (cellH + 10)}
          stroke={`${color}12`}
          strokeWidth={0.5}
          strokeDasharray="2,4"
        />
      ))}

      {/* Room boundary */}
      <rect
        x={padX - 12}
        y={padY - 12}
        width={totalW - (padX - 12) * 2}
        height={totalH - (padY - 12) * 2}
        fill="none"
        stroke={`${color}40`}
        strokeWidth={1.5}
        rx={2}
      />

      {/* Workstation cells */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const x = padX + c * (cellW + 8)
          const y = padY + r * (cellH + 10)
          const isSpecial = (r === 0 && c === 0) || (r === 0 && c === cols - 1)
          return (
            <g key={`ws-${r}-${c}`}>
              <rect
                x={x}
                y={y}
                width={cellW}
                height={cellH}
                fill={isSpecial ? `${color}18` : '#111118'}
                stroke={isSpecial ? `${color}60` : `${color}25`}
                strokeWidth={isSpecial ? 1.5 : 0.8}
                rx={3}
              />
              {/* Monitor */}
              <rect
                x={x + 8}
                y={y + 6}
                width={cellW - 16}
                height={cellH - 20}
                fill="none"
                stroke={isSpecial ? `${color}80` : `${color}40`}
                strokeWidth={0.8}
                rx={1}
              />
              {/* Base */}
              <line
                x1={x + cellW / 2 - 4}
                y1={y + cellH - 10}
                x2={x + cellW / 2 + 4}
                y2={y + cellH - 10}
                stroke={isSpecial ? `${color}80` : `${color}40`}
                strokeWidth={1}
              />
              <line
                x1={x + cellW / 2}
                y1={y + cellH - 14}
                x2={x + cellW / 2}
                y2={y + cellH - 10}
                stroke={isSpecial ? `${color}80` : `${color}40`}
                strokeWidth={1}
              />
            </g>
          )
        })
      )}

      {/* Server rack on right wall */}
      <rect
        x={totalW - padX + 4}
        y={padY}
        width={16}
        height={totalH - padY * 2}
        fill={`${color}10`}
        stroke={`${color}40`}
        strokeWidth={1}
        rx={2}
      />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect
          key={`rack-${i}`}
          x={totalW - padX + 6}
          y={padY + 6 + i * 18}
          width={12}
          height={10}
          fill={`${color}20`}
          stroke={`${color}50`}
          strokeWidth={0.5}
          rx={1}
        />
      ))}

      {/* Door indicator (bottom center) */}
      <path
        d={`M ${totalW / 2 - 14} ${totalH - padY + 12} L ${totalW / 2 - 14} ${totalH - padY + 2} A 14 14 0 0 1 ${totalW / 2} ${totalH - padY + 12}`}
        fill="none"
        stroke={`${color}60`}
        strokeWidth={1}
        strokeDasharray="3,2"
      />
      <line
        x1={totalW / 2 - 14}
        y1={totalH - padY + 2}
        x2={totalW / 2 - 14}
        y2={totalH - padY + 12}
        stroke={`${color}80`}
        strokeWidth={1.5}
      />

      {/* Labels */}
      <text x={padX - 12} y={padY - 18} fill={`${color}60`} fontSize="7" letterSpacing="2">
        TACTICAL OVERLAY V4.2
      </text>
      <text x={padX - 12} y={totalH - 6} fill={`${color}40`} fontSize="6" letterSpacing="1">
        FABRICATION CLUSTER
      </text>
      <text x={totalW - padX + 4} y={padY - 6} fill={`${color}50`} fontSize="6" transform={`rotate(-90, ${totalW - padX + 12}, ${padY + 30})`}>
        SRV
      </text>

      {/* Axis clearance indicator */}
      <line
        x1={totalW - 60}
        y1={totalH - 18}
        x2={totalW - 22}
        y2={totalH - 18}
        stroke={`${color}30`}
        strokeWidth={0.5}
      />
      <text x={totalW - 58} y={totalH - 9} fill={`${color}30`} fontSize="6" letterSpacing="1">
        X-AXIS CLEARANCE: 4.1M
      </text>

      {/* Corner crosses */}
      {[
        [padX - 12, padY - 12],
        [totalW - padX + 12, padY - 12],
        [padX - 12, totalH - padY + 12],
        [totalW - padX + 12, totalH - padY + 12],
      ].map(([cx, cy], i) => (
        <g key={`cross-${i}`}>
          <line x1={cx! - 5} y1={cy!} x2={cx! + 5} y2={cy!} stroke={`${color}50`} strokeWidth={0.8} />
          <line x1={cx!} y1={cy! - 5} x2={cx!} y2={cy! + 5} stroke={`${color}50`} strokeWidth={0.8} />
        </g>
      ))}
    </svg>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

async function getLab(slug: string) {
  const row = await prisma.lab.findUnique({ where: { slug } })
  if (!row) return null
  return { ...row, equipment: row.equipment as string[] }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const lab = await getLab(slug)
  if (!lab) return { title: 'Lab Not Found — Lakshay 2047' }
  return {
    title: `${lab.name} — Lakshay 2047`,
    description: lab.description,
  }
}

export default async function LabDetailPage({ params }: PageProps) {
  const { slug } = await params
  const lab = await getLab(slug)
  if (!lab) notFound()

  const color = CATEGORY_COLORS[lab.category]
  const categoryLabel = CATEGORY_LABELS[lab.category]
  const researchAreas = RESEARCH_AREAS[lab.category]
  const software = SOFTWARE_BY_CATEGORY[lab.category]

  // Split equipment: first half = hardware, rest = hardware overflow
  const hardware = lab.equipment

  // Derive sector / room number from location string
  const locationParts = lab.location.split(',')
  const sector = locationParts[0]?.trim() ?? lab.location
  const roomRaw = locationParts[1]?.trim() ?? ''
  const roomNum = roomRaw.replace('Room ', '').replace('room ', '')

  // Availability hours
  const satClose = lab.closeTime.split(':').map(Number)
  const satCloseHour = Math.max(satClose[0]! - 4, 10)
  const satCloseStr = `${String(satCloseHour).padStart(2, '0')}:${String(satClose[1]).padStart(2, '0')}`

  // Capacity used (cosmetic, based on slug hash)
  const hashVal = slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const usedCapacity = Math.floor(lab.capacity * (0.45 + (hashVal % 35) / 100))

  return (
    <main className="min-h-screen bg-bg pb-24">
      {/* ── Top bar ───────────────────────────────────────────── */}
      <div
        className="h-0.5 w-full"
        style={{ backgroundColor: color }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-20">
        {/* Back */}
        <Link
          href="/labs"
          className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-text-subtle hover:text-white transition-colors mb-8 uppercase"
        >
          <ArrowLeft size={13} />
          Back
        </Link>

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
          <div>
            {/* Status badge */}
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold tracking-widest uppercase ${lab.isActive ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${lab.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                {lab.isActive ? 'Operational' : 'Offline'}
              </span>
              <span
                className="px-2.5 py-1 rounded text-xs font-mono font-semibold tracking-widest uppercase"
                style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
              >
                {categoryLabel}
              </span>
            </div>

            {/* Lab name */}
            <h1 className="font-heading font-black text-5xl md:text-6xl text-white tracking-tight leading-none mb-3">
              {lab.name.toUpperCase()}
            </h1>

            {/* Location */}
            <div className="space-y-0.5">
              <p className="text-xs font-mono tracking-widest uppercase text-text-subtle">
                {sector} // Sector A
              </p>
              <p className="text-xs font-mono tracking-widest uppercase" style={{ color: `${color}80` }}>
                Load Bearing Partition
              </p>
            </div>
          </div>

          {/* Room number */}
          {roomNum && (
            <div className="text-right shrink-0">
              <p className="text-xs font-mono tracking-widest uppercase text-text-subtle mb-1">
                Room Number
              </p>
              <p className="font-mono font-bold text-3xl md:text-4xl text-white tracking-tight border-l-2 pl-4" style={{ borderColor: color }}>
                {roomNum}
              </p>
            </div>
          )}
        </div>

        {/* Full-width color divider */}
        <div className="h-px w-full mb-10 mt-6" style={{ background: `linear-gradient(to right, ${color}60, transparent)` }} />

        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mb-16">

          {/* Left: floor plan */}
          <div>
            <div className="rounded-xl border border-border bg-surface overflow-hidden" style={{ borderColor: `${color}20` }}>
              <div className="px-4 py-2 border-b border-border flex items-center justify-between" style={{ borderColor: `${color}15` }}>
                <span className="text-xs font-mono tracking-widest uppercase text-text-subtle">
                  Tactical Overlay V4.2
                </span>
                <span className="text-xs font-mono" style={{ color: `${color}70` }}>
                  {lab.name.toUpperCase()}
                </span>
              </div>
              <div className="aspect-[16/9] p-2">
                <FloorPlanSVG color={color} />
              </div>
              <div className="px-4 py-2 border-t border-border flex items-center justify-between" style={{ borderColor: `${color}15` }}>
                <span className="text-xs font-mono text-text-subtle">Fabrication Cluster</span>
                <span className="text-xs font-mono" style={{ color: `${color}60` }}>
                  X-Axis Clearance: 4.1M
                </span>
              </div>
            </div>

            {/* Equipment stations */}
            <div className="mt-6">
              <p className="text-xs font-mono tracking-widest uppercase text-text-subtle mb-4">
                Special Equipment Stations
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hardware.slice(0, 4).map((item, i) => (
                  <div key={item} className="rounded-lg border border-border bg-surface-2 p-4">
                    <p className="text-xs font-mono text-text-subtle mb-1">
                      {String.fromCharCode(65 + i)}-Station
                    </p>
                    <p className="text-sm font-semibold text-white">{item}</p>
                    <p className="text-xs text-text-subtle mt-1">Professional Grade Unit</p>
                  </div>
                ))}
              </div>
              {hardware.length > 4 && (
                <p className="text-xs text-text-subtle mt-3 font-mono">
                  + {hardware.length - 4} standard workstations available
                </p>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Lab Lead */}
            <div className="rounded-xl border border-border bg-surface-2 p-5">
              <p className="text-xs font-mono tracking-widest uppercase text-text-subtle mb-4">
                Lab Lead
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                  <Users size={16} className="text-text-subtle" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white uppercase tracking-wide">
                    Lab Coordinator
                  </p>
                  <p className="text-xs text-text-subtle">{categoryLabel} Division</p>
                </div>
              </div>
              <a
                href="mailto:cfs@paruluniversity.ac.in"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-xs font-mono text-text-muted hover:text-white hover:border-border/80 transition-colors"
              >
                Contact Coordinator
              </a>
            </div>

            {/* Availability */}
            <div className="rounded-xl border border-border bg-surface-2 p-5">
              <p className="text-xs font-mono tracking-widest uppercase text-text-subtle mb-4">
                Lab Availability
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-text-muted">MON – FRI</span>
                  <span className="text-xs font-mono text-white">
                    {lab.openTime} – {lab.closeTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-text-muted">SATURDAY</span>
                  <span className="text-xs font-mono text-white">
                    {lab.openTime} – {satCloseStr}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono" style={{ color }}>SUNDAY</span>
                  <span className="text-xs font-mono" style={{ color }}>Restricted Access</span>
                </div>
              </div>
            </div>

            {/* Capacity gauge */}
            <div className="rounded-xl border border-border bg-surface-2 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-mono tracking-widest uppercase text-text-subtle">
                  Current Capacity
                </p>
                <p className="text-xs font-mono text-white">
                  {usedCapacity}/{lab.capacity} Active
                </p>
              </div>
              <div className="h-1.5 rounded-full bg-surface overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round((usedCapacity / lab.capacity) * 100)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <p className="text-xs text-text-subtle font-mono">
                {Math.round((usedCapacity / lab.capacity) * 100)}% utilisation
              </p>
            </div>

            {/* CTA */}
            <Link
              href={`/book/${lab.slug}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono font-bold text-sm tracking-widest uppercase text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: color }}
            >
              Request Lab Access
              <ChevronRight size={15} />
            </Link>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-surface p-3 text-center">
                <p className="font-mono font-bold text-white text-lg">{lab.capacity}</p>
                <p className="text-xs text-text-subtle font-mono mt-0.5">Max Seats</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-3 text-center">
                <p className="font-mono font-bold text-white text-lg">{lab.slotDuration}m</p>
                <p className="text-xs text-text-subtle font-mono mt-0.5">Slot Duration</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hardware / Software ──────────────────────────────── */}
        <div className="mb-16">
          <div className="h-px mb-8" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color }}>
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
                Hardware
              </p>
              <div className="space-y-2">
                {hardware.map((item) => (
                  <div key={item} className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-muted">{item}</span>
                    <span className="text-xs font-mono text-text-subtle text-right max-w-[160px] line-clamp-1">
                      Professional Grade
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-mono tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color }}>
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
                Software
              </p>
              <div className="space-y-2">
                {software.map((item) => (
                  <div key={item} className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-muted">{item}</span>
                    <span className="text-xs font-mono" style={{ color: `${color}80` }}>Licensed</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Research Focus Areas ─────────────────────────────── */}
        <div className="mb-16">
          <div className="h-px mb-8" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
          <p className="text-xs font-mono tracking-widest uppercase text-text-subtle mb-6">
            Research Focus Areas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchAreas.map(({ num, title, desc }) => (
              <div key={num}>
                <p className="font-mono font-bold text-4xl mb-2" style={{ color: `${color}30` }}>
                  {num}
                </p>
                <p className="font-mono font-bold text-xs tracking-widest uppercase text-white mb-1">
                  {title}
                </p>
                <p className="text-xs text-text-subtle leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Description / Architectural Notes ───────────────── */}
        <div className="mb-16">
          <div className="h-px mb-8" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
          <div className="text-center mb-6">
            <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color }}>
              ✦
            </p>
            <h2 className="font-mono font-black text-2xl tracking-[0.1em] uppercase text-white mb-4">
              Architectural Blueprint
            </h2>
          </div>
          <p className="text-text-muted leading-relaxed max-w-3xl mx-auto text-center">
            {lab.description}
          </p>
        </div>

        {/* ── Final CTA ────────────────────────────────────────── */}
        <div
          className="rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background: `linear-gradient(135deg, ${color}12, transparent)`, border: `1px solid ${color}25` }}
        >
          <div>
            <p className="font-mono font-bold text-white uppercase tracking-widest mb-1">
              Ready to access the lab?
            </p>
            <p className="text-sm text-text-muted">
              Book a {lab.slotDuration}-minute slot. Confirm your session. Start building.
            </p>
          </div>
          <Link
            href={`/book/${lab.slug}`}
            className="shrink-0 flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono font-bold text-sm tracking-widest uppercase text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            Book Now <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  )
}
