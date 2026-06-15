import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const labs = [
  // ── AI / ML ──────────────────────────────────────────────────────
  {
    name: 'AI Research Lab',
    slug: 'ai-research-lab',
    description:
      'A state-of-the-art facility dedicated to artificial intelligence research and experimentation. Equipped with high-performance GPU clusters and frameworks for deep learning, NLP, and computer vision research. Ideal for AI project development, research papers, and industry collaboration.',
    category: 'AI_ML' as const,
    capacity: 24,
    location: 'Science Complex, Room A-101',
    equipment: [
      'NVIDIA A100 GPU Cluster',
      'TensorFlow & PyTorch Workstations',
      'AI Training & Inference Servers',
      'Jupyter Notebook Hub',
      'Data Visualization Displays',
    ],
    image: 'https://picsum.photos/seed/ai-research-lab/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },
  {
    name: 'Machine Learning Studio',
    slug: 'machine-learning-studio',
    description:
      'A specialized workspace for machine learning development and model training at scale. Features TPU and GPU resources with pre-configured environments for PyTorch, TensorFlow, and Scikit-learn workflows. Perfect for students exploring supervised, unsupervised, and reinforcement learning applications.',
    category: 'AI_ML' as const,
    capacity: 20,
    location: 'Science Complex, Room A-102',
    equipment: [
      'Google TPU v4 Pods',
      'PyTorch Development Workstations',
      'MLflow Model Tracking Server',
      'Edge Inference Devices',
      'AutoML Pipeline Tools',
      'Dataset Storage NAS',
    ],
    image: 'https://picsum.photos/seed/machine-learning-studio/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },

  // ── ROBOTICS ─────────────────────────────────────────────────────
  {
    name: 'Robotics Innovation Lab',
    slug: 'robotics-innovation-lab',
    description:
      'A cutting-edge robotics facility where students design, build, and program autonomous systems. Equipped with industrial robot arms, ROS-based workstations, and drone development kits for real-world robotics challenges. Supports collaborative projects in automation, manipulation, and swarm robotics.',
    category: 'ROBOTICS' as const,
    capacity: 15,
    location: 'Technology Hub, Room B-201',
    equipment: [
      'ABB IRB 1200 Robot Arms',
      'ROS 2 Development Workstations',
      'SLAM Mapping Sensor Arrays',
      'Drone Development Kits',
      'Raspberry Pi & Jetson Clusters',
      'Servo Motor Testing Rigs',
    ],
    image: 'https://picsum.photos/seed/robotics-innovation-lab/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },
  {
    name: 'Automation & Control Lab',
    slug: 'automation-control-lab',
    description:
      'An industrial automation facility replicating real factory environments for hands-on PLC and SCADA training. Students gain exposure to industrial communication protocols, sensor integration, and process control systems. Bridges the gap between academic learning and industry-grade automation engineering.',
    category: 'ROBOTICS' as const,
    capacity: 18,
    location: 'Technology Hub, Room B-202',
    equipment: [
      'Siemens S7 PLCs',
      'Industrial HMI Touch Panels',
      'Pneumatic Actuator Systems',
      'SCADA Monitoring Platform',
      'PID Controller Training Kits',
    ],
    image: 'https://picsum.photos/seed/automation-control-lab/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },

  // ── DESIGN ───────────────────────────────────────────────────────
  {
    name: 'Design Thinking Studio',
    slug: 'design-thinking-studio',
    description:
      'A collaborative creative space where students apply human-centered design methodologies to solve complex problems. Features material sample libraries, prototyping tools, and large collaborative surfaces for brainstorming sessions. Perfect for product design sprints, ideation workshops, and cross-disciplinary projects.',
    category: 'DESIGN' as const,
    capacity: 30,
    location: 'Creative Arts Building, Room C-301',
    equipment: [
      'Wacom Cintiq Pro Tablets',
      '3D Sketching Workstations',
      'Material & Texture Sample Library',
      'Rapid Prototyping Tools',
      'Interactive Whiteboards',
      'User Journey Mapping Wall',
    ],
    image: 'https://picsum.photos/seed/design-thinking-studio/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },
  {
    name: 'UX/UI Research Lab',
    slug: 'ux-ui-research-lab',
    description:
      'A dedicated space for user experience research, interface prototyping, and usability testing. Equipped with eye-tracking devices, heat map software, and A/B testing frameworks to measure real user behavior. Enables evidence-based design decisions for digital products and services.',
    category: 'DESIGN' as const,
    capacity: 20,
    location: 'Creative Arts Building, Room C-302',
    equipment: [
      'Tobii Eye-Tracking Devices',
      'Usability Testing Observation Setup',
      'Figma & Adobe XD Workstations',
      'Motion Capture Sensors',
      'A/B Testing Framework Servers',
    ],
    image: 'https://picsum.photos/seed/ux-ui-research-lab/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },

  // ── HARDWARE ─────────────────────────────────────────────────────
  {
    name: 'Electronics & IoT Lab',
    slug: 'electronics-iot-lab',
    description:
      'A fully equipped electronics lab for circuit design, microcontroller programming, and IoT prototyping. Students can build and test hardware projects from sensor nodes to edge computing devices using industry-standard tools. The lab bridges hardware design with cloud connectivity and real-time data processing.',
    category: 'HARDWARE' as const,
    capacity: 24,
    location: 'Engineering Block, Room D-401',
    equipment: [
      'Digital Oscilloscopes',
      'Arduino & ESP32 Dev Kits',
      'IoT Sensor Module Arrays',
      'Professional Soldering Stations',
      'Benchtop 3D Printers',
      'Logic Analyzers',
    ],
    image: 'https://picsum.photos/seed/electronics-iot-lab/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },
  {
    name: 'PCB Fabrication Lab',
    slug: 'pcb-fabrication-lab',
    description:
      'A professional PCB manufacturing facility where students design and fabricate custom circuit boards from scratch. From schematic capture to SMD soldering and automated quality inspection, the lab covers the full PCB production pipeline. Ideal for hardware startups, research projects, and advanced electronics coursework.',
    category: 'HARDWARE' as const,
    capacity: 16,
    location: 'Engineering Block, Room D-402',
    equipment: [
      'CNC PCB Milling Machines',
      'SMD Reflow Ovens',
      'Component Pick-and-Place Machines',
      'AOI Inspection System',
      'Conformal Coating Equipment',
    ],
    image: 'https://picsum.photos/seed/pcb-fabrication-lab/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },

  // ── MEDIA ────────────────────────────────────────────────────────
  {
    name: 'Media Production Studio',
    slug: 'media-production-studio',
    description:
      'A broadcast-grade media production facility for video, audio, and content creation at a professional level. Features cinema cameras, studio lighting rigs, and 4K editing suites for producing high-quality documentaries, short films, and digital content. Equipped with a full green screen setup for compositing work.',
    category: 'MEDIA' as const,
    capacity: 12,
    location: 'Media Centre, Room E-501',
    equipment: [
      'RED Cinema Cameras',
      'Broadcast Lighting Rigs',
      '4K Video Editing Workstations',
      'Audio Mixing Console',
      'Green Screen & Chroma Setup',
      'Teleprompter Systems',
    ],
    image: 'https://picsum.photos/seed/media-production-studio/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },
  {
    name: 'Digital Photography Lab',
    slug: 'digital-photography-lab',
    description:
      'A professional photography studio with high-end camera systems, controlled studio lighting, and colour-calibrated post-processing workstations. Students can explore commercial, editorial, and fine-art photography with access to industry-standard retouching software and large-format printing. Designed for both technical precision and creative exploration.',
    category: 'MEDIA' as const,
    capacity: 20,
    location: 'Media Centre, Room E-502',
    equipment: [
      'Hasselblad Medium Format Cameras',
      'Studio Flash & Continuous Lighting',
      'Lightroom & Photoshop Workstations',
      'Colour Calibration Systems',
      'Light Table Stations',
    ],
    image: 'https://picsum.photos/seed/digital-photography-lab/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },

  // ── EXTENDED REALITY ─────────────────────────────────────────────
  {
    name: 'XR Innovation Lab',
    slug: 'xr-innovation-lab',
    description:
      'An immersive extended reality facility encompassing VR, AR, and MR development for next-generation experiences. Equipped with industry-leading headsets, motion capture systems, and spatial audio rigs for creating compelling XR applications. Supports development across Unity, Unreal Engine, and WebXR frameworks.',
    category: 'EXTENDED_REALITY' as const,
    capacity: 15,
    location: 'Innovation Wing, Room F-601',
    equipment: [
      'Meta Quest Pro Headsets',
      'Microsoft HoloLens 2 Devices',
      'Unity XR Development Stations',
      'Full-Body Motion Capture Suit',
      'Haptic Feedback Gloves',
      'Spatial Audio Systems',
    ],
    image: 'https://picsum.photos/seed/xr-innovation-lab/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },

  // ── CYBERSECURITY ────────────────────────────────────────────────
  {
    name: 'Cybersecurity Operations Centre',
    slug: 'cybersecurity-operations-centre',
    description:
      'A professional-grade SOC environment for ethical hacking, threat analysis, and network security training. Equipped with isolated network segments, penetration testing toolkits, and enterprise SIEM platforms. Students develop hands-on skills in vulnerability assessment, incident response, and digital forensics.',
    category: 'CYBERSECURITY' as const,
    capacity: 20,
    location: 'Security Block, Room G-701',
    equipment: [
      'Kali Linux Workstations',
      'Network Packet Analyzers',
      'Intrusion Detection Systems',
      'Firewall Simulation Lab',
      'Vulnerability Scanner Suite',
      'Enterprise SIEM Platform',
    ],
    image: 'https://picsum.photos/seed/cybersecurity-operations-centre/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },

  // ── BIOTECH ──────────────────────────────────────────────────────
  {
    name: 'Biotech Research Lab',
    slug: 'biotech-research-lab',
    description:
      'A BSL-2 certified biotechnology laboratory for molecular biology, microbiology, and biochemistry research. Equipped with standard wet-lab equipment for PCR, cell culture, protein analysis, and microscopy. Supports undergraduate and postgraduate research projects in life sciences and biotechnology.',
    category: 'BIOTECH' as const,
    capacity: 12,
    location: 'Life Sciences Building, Room H-801',
    equipment: [
      'PCR & Real-Time qPCR Machines',
      'Biosafety Cabinets (Class II)',
      'High-Speed Centrifuges',
      'CO₂ Incubators',
      'Inverted Fluorescence Microscopes',
      'Gel Electrophoresis Systems',
    ],
    image: 'https://picsum.photos/seed/biotech-research-lab/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },
  {
    name: 'Genomics & Bioinformatics Lab',
    slug: 'genomics-bioinformatics-lab',
    description:
      'A next-generation sequencing and computational genomics facility for cutting-edge life science research. Houses high-throughput sequencers, CRISPR gene editing tools, and a dedicated bioinformatics compute cluster. Enables research in genomics, proteomics, and precision medicine applications.',
    category: 'BIOTECH' as const,
    capacity: 10,
    location: 'Life Sciences Building, Room H-802',
    equipment: [
      'Illumina Next-Gen Sequencer',
      'CRISPR Gene Editing Toolkit',
      'Bioinformatics Compute Cluster',
      'Proteomics Mass Spectrometer',
      'Nanodrop Spectrophotometer',
    ],
    image: 'https://picsum.photos/seed/genomics-bioinformatics-lab/640/360',
    isActive: true,
    openTime: '09:00',
    closeTime: '18:00',
    slotDuration: 60,
  },
]

async function main() {
  console.log('Seeding 14 labs...')

  for (const lab of labs) {
    await prisma.lab.upsert({
      where: { slug: lab.slug },
      update: lab,
      create: lab,
    })
    console.log(`  ✓ ${lab.name}`)
  }

  console.log(`Done — ${labs.length} labs seeded.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
