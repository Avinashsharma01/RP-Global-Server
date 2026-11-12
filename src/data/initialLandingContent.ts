export interface HeroSectionData {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  titleHighlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  checkpoints: string[];
  phoneNumber: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  mediaPosterUrl?: string;
  telemetryText: string;
  overlayCaption: string;
}

export interface MetricItem {
  id: string;
  value: number;
  suffix: string;
  decimals: number;
  label: string;
  detail: string;
}

export interface MetricsSectionData {
  badge: string;
  title: string;
  description: string;
  items: MetricItem[];
}

export interface WhoWeAreSectionData {
  badge: string;
  title: string;
  paragraphs: string[];
  deliveryPoints: string[];
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  mediaPosterUrl?: string;
  imageBadgeTitle: string;
  imageBadgeSubtitle: string;
  isoBadgeTitle: string;
  isoBadgeSubtitle: string;
}

export interface TreatmentStageItem {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  rawWaterLabel: string;
  rawWaterColor: string;
  rawWaterDesc: string;
  purifiedWaterColor: string;
  technology: string;
  keyMetric: {
    label: string;
    raw: string;
    treated: string;
    unit: string;
  };
  complianceBadge: string;
}

export interface WaterPurificationFlowData {
  badge: string;
  title: string;
  description: string;
  stages: TreatmentStageItem[];
}

export interface SolutionsGridSectionData {
  badge: string;
  title: string;
  description: string;
  featuredSlug: string;
  viewAllText: string;
  viewAllLink: string;
}

export interface CalculatorApplication {
  id: string;
  name: string;
  plantType: string;
  plantSlug: string;
  technology: string;
  designObjective: string;
  reusePercent: number;
  description: string;
  processChain: string[];
}

export interface PlantCalculatorSectionData {
  badge: string;
  title: string;
  description: string;
  presets: number[];
  applications: CalculatorApplication[];
}

export interface ProjectTrackerSectionData {
  badge: string;
  title: string;
  description: string;
}

export interface CapabilityItem {
  number: string;
  title: string;
  description: string;
}

export interface QualityPillItem {
  text: string;
  iconType: string;
}

export interface ValuePropositionSectionData {
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  qualityPills: QualityPillItem[];
  capabilities: CapabilityItem[];
}

export interface CertificationsSectionData {
  badge: string;
  title: string;
  description: string;
}

export interface PartnersSectionData {
  badge: string;
  title: string;
  description: string;
}

export interface SectorStep {
  title: string;
  desc: string;
}

export interface SectorItemData {
  id: string;
  name: string;
  category: "heavy" | "process" | "civic";
  iconName: string;
  detail: string;
  badge: string;
  challenge: string;
  keyMetric: { label: string; value: string };
  secondaryMetric: { label: string; value: string };
  gradient: string;
  iconBg: string;
  borderColor: string;
  recommendedPlant: string;
  processSummary: string;
  steps: SectorStep[];
}

export interface ClientMarqueeSectionData {
  badge: string;
  title: string;
  description: string;
  sectors: SectorItemData[];
}

export interface FAQSectionSettingsData {
  badge: string;
  title: string;
  description: string;
}

export interface LandingContentCollection {
  hero: HeroSectionData;
  metrics: MetricsSectionData;
  whoWeAre: WhoWeAreSectionData;
  waterPurificationFlow: WaterPurificationFlowData;
  solutionsGrid: SolutionsGridSectionData;
  plantCalculator: PlantCalculatorSectionData;
  projectTracker: ProjectTrackerSectionData;
  valueProposition: ValuePropositionSectionData;
  certifications: CertificationsSectionData;
  partners: PartnersSectionData;
  clientMarquee: ClientMarqueeSectionData;
  faqs: FAQSectionSettingsData;
}

export const INITIAL_LANDING_CONTENT: LandingContentCollection = {
  hero: {
    badge: "Industrial Water & Wastewater EPC • India",
    titleLine1: "Water systems,",
    titleLine2: "engineered for",
    titleHighlight: "the long run.",
    description:
      "Turnkey water and wastewater treatment plants designed around your inlet water chemistry, fabricated in-house to guarantee CPCB/SPCB discharge limits, and supported through long-term operation.",
    primaryCtaText: "Talk to an Engineer",
    primaryCtaLink: "",
    secondaryCtaText: "Explore Our Solutions",
    secondaryCtaLink: "/solutions",
    checkpoints: ["ISO 9001:2015 Certified", "CPCB / SPCB Focused Design"],
    phoneNumber: "+91 7739283565",
    mediaType: "image",
    mediaUrl: "/images/hero-bg.jpg",
    telemetryText: "Real-Time Plant Telemetry • Active",
    overlayCaption: "Industrial wastewater treatment",
  },
  metrics: {
    badge: "Experience & Water Delivery",
    title: "Built on projects, measured in hydraulic performance.",
    description:
      "Project figures reflect 12+ years of verified EPC commissioning and operational compliance.",
    items: [
      {
        id: "m1",
        value: 100,
        suffix: "+",
        decimals: 0,
        label: "Plants commissioned",
        detail: "Across industrial India",
      },
      {
        id: "m2",
        value: 12,
        suffix: "+",
        decimals: 0,
        label: "Years in water engineering",
        detail: "Turnkey EPC delivery",
      },
      {
        id: "m3",
        value: 99.4,
        suffix: "%",
        decimals: 1,
        label: "Compliance rate",
        detail: "CPCB / SPCB discharge norms",
      },
      {
        id: "m4",
        value: 50,
        suffix: "+",
        decimals: 0,
        label: "Enterprise clients",
        detail: "Industrial & municipal complexes",
      },
    ],
  },
  whoWeAre: {
    badge: "About R P Global Projects",
    title: "A single engineering team, from first sample to final handover.",
    paragraphs: [
      "R P Global Projects designs and delivers industrial water and wastewater treatment systems for manufacturing, commercial, and municipal applications. Each plant is planned around the source water, process demand, site conditions, and reuse goals.",
      "Our turnkey EPC approach brings process chemistry, equipment fabrication, instrumentation, and operational support together under one project team.",
    ],
    deliveryPoints: [
      "Water characterization & chemical process design",
      "In-house heavy vessel fabrication & skid assembly",
      "Electro-mechanical installation & wet commissioning",
      "CPCB/SPCB compliance handover & AMC lifecycle support",
    ],
    primaryBtnText: "Meet the Team",
    primaryBtnLink: "/about-us",
    secondaryBtnText: "Arrange a Site Discussion",
    secondaryBtnLink: "/contact-us",
    mediaType: "image",
    mediaUrl: "/images/plant-etp.jpg",
    imageBadgeTitle: "Turnkey Water Engineering",
    imageBadgeSubtitle:
      "Custom-Engineered for Source Water Chemistry & Discharge Limits.",
    isoBadgeTitle: "Quality Management",
    isoBadgeSubtitle: "ISO 9001:2015",
  },
  waterPurificationFlow: {
    badge: "Interactive EPC Simulator",
    title: "Water Clarification & EPC Process Simulator",
    description:
      "Explore how raw industrial effluent and wastewater are transformed into high-purity recycled water across our 4 core treatment technologies.",
    stages: [
      {
        id: "etp",
        name: "Industrial Effluent (ETP & ZLD)",
        shortName: "ETP / ZLD",
        tagline: "Heavy Industrial Chemical & Organic Wastewater Remediation",
        rawWaterLabel: "Industrial Effluent",
        rawWaterColor: "rgba(180, 83, 9, 0.45)",
        rawWaterDesc: "High COD/BOD • Heavy Metals • Oil & Grease",
        purifiedWaterColor: "rgba(0, 229, 255, 0.65)",
        technology:
          "Physico-Chemical + Biological MBBR + Multi-Effect Evaporator",
        keyMetric: {
          label: "COD Level",
          raw: "3,800",
          treated: "< 45",
          unit: "mg/L",
        },
        complianceBadge: "100% CPCB / SPCB Zero Liquid Discharge (ZLD)",
      },
      {
        id: "stp",
        name: "Sewage Treatment (MBBR / MBR)",
        shortName: "STP Plant",
        tagline:
          "Odourless Domestic Wastewater Recycling for Commercial Sites",
        rawWaterLabel: "Raw Domestic Sewage",
        rawWaterColor: "rgba(100, 116, 139, 0.55)",
        rawWaterDesc:
          "Organic Pathogens • High Suspended Solids • Ammoniacal Nitrogen",
        purifiedWaterColor: "rgba(16, 185, 129, 0.65)",
        technology:
          "Virgin HDPE Bio-Carriers (550 m²/m³) + Submerged Ultrafiltration",
        keyMetric: {
          label: "BOD Discharge",
          raw: "320",
          treated: "< 8",
          unit: "mg/L",
        },
        complianceBadge: "Approved for Dual-Plumbing Flushing & Landscaping",
      },
      {
        id: "ro",
        name: "Reverse Osmosis (RO Desalination)",
        shortName: "RO Systems",
        tagline: "High-Rejection Membrane Separation for High TDS Feeds",
        rawWaterLabel: "Brackish Ground Water",
        rawWaterColor: "rgba(202, 138, 4, 0.35)",
        rawWaterDesc:
          "TDS 2,500+ ppm • Dissolved Chlorides & Sulfates • Hardness",
        purifiedWaterColor: "rgba(0, 180, 216, 0.75)",
        technology:
          "Thin-Film Composite (TFC) Polyamide Membranes (99.4% Rejection)",
        keyMetric: {
          label: "Total Dissolved Solids",
          raw: "2,850",
          treated: "< 40",
          unit: "ppm",
        },
        complianceBadge:
          "High-Pressure Boiler & Pharmaceutical Grade Purity",
      },
      {
        id: "wtp",
        name: "Surface Water Treatment (WTP)",
        shortName: "WTP Clarifier",
        tagline:
          "High-Rate River & Canal Clarification for Municipal/Plant Feeds",
        rawWaterLabel: "Raw River Water",
        rawWaterColor: "rgba(161, 98, 7, 0.4)",
        rawWaterDesc: "Colloidal Clay • Algae • Monsoon River Silt 120 NTU",
        purifiedWaterColor: "rgba(56, 189, 248, 0.7)",
        technology:
          "Flash Flash Mixer + Lamella Tube Settler + Rapid Gravity Sand",
        keyMetric: {
          label: "Turbidity",
          raw: "140",
          treated: "< 0.8",
          unit: "NTU",
        },
        complianceBadge: "Compliant with BIS 10500:2012 Potable Norms",
      },
    ],
  },
  solutionsGrid: {
    badge: "Industrial Treatment Systems",
    title: "The right engineered process for your water.",
    description:
      "Six core systems, configured for your inlet chemistry, daily KLD capacity, compliance targets, and zero-liquid-discharge reuse requirements.",
    featuredSlug: "effluent-treatment-plants",
    viewAllText: "View All Solutions",
    viewAllLink: "/solutions",
  },
  plantCalculator: {
    badge: "Interactive Sizing Calculator",
    title: "Plan your plant capacity in seconds.",
    description:
      "Select your target application and test capacity scenarios from 10 to 1,000 KLD. Review immediate hydraulic flow rates, estimated recycled water recovery, and recommended process technology.",
    presets: [25, 100, 250, 500, 1000],
    applications: [
      {
        id: "sewage",
        name: "Residential & Commercial Sewage",
        plantType: "Sewage Treatment Plant (STP)",
        plantSlug: "sewage-treatment-plants",
        technology: "MBBR or SBR biological aeration & clarification",
        designObjective:
          "BOD < 10 ppm and TSS < 10 ppm for flush and landscape irrigation reuse.",
        reusePercent: 75,
        description:
          "Engineered for townships, IT campuses, and commercial developments seeking zero fresh-water waste in toilet flushing and horticulture.",
        processChain: [
          "Screening & grit removal",
          "Flow equalisation & pumping",
          "Biological aeration (MBBR/SBR)",
          "Secondary clarification",
          "Filtration & UV disinfection",
        ],
      },
      {
        id: "effluent",
        name: "Industrial Chemical & Dye Effluent",
        plantType: "Effluent Treatment Plant (ETP)",
        plantSlug: "effluent-treatment-plants",
        technology: "Physico-chemical coagulation & biological treatment",
        designObjective:
          "COD/BOD/heavy metal reduction conforming to strict SPCB/CPCB industrial discharge limits.",
        reusePercent: 85,
        description:
          "Heavy-duty skid systems engineered for textile dyeing, pharmaceuticals, electroplating, and manufacturing effluent streams.",
        processChain: [
          "Screening & oil skimmer",
          "Chemical dosing & flash mixing",
          "Flocculation & lamella settling",
          "Aerobic biological reactor",
          "Pressure sand & carbon filter",
        ],
      },
      {
        id: "boiler_pure",
        name: "High-Pressure Boiler Feed & Pure Water",
        plantType: "Demineralization (DM) Plant",
        plantSlug: "demineralization-plants",
        technology: "Two-bed ion exchange with mixed-bed polishing",
        designObjective:
          "Conductivity < 0.2 µS/cm and silica < 0.02 ppm for zero-scaling thermal operations.",
        reusePercent: 95,
        description:
          "Ion-exchange columns built for power utilities, paper mills, and pharmaceutical loops demanding zero electrical conductivity.",
        processChain: [
          "Feed-water dual media filter",
          "Strong acid cation exchanger",
          "Degasser tower for dissolved CO₂",
          "Strong base anion exchanger",
          "Mixed bed polish & conductivity monitor",
        ],
      },
      {
        id: "reverse_osmosis",
        name: "Groundwater & High-TDS Desalination",
        plantType: "Reverse Osmosis (RO) Plant",
        plantSlug: "reverse-osmosis-plants",
        technology:
          "High-pressure membrane separation with anti-scalant dosing",
        designObjective:
          "Up to 80% permeate recovery with >99.2% salt rejection across high-TDS feeds.",
        reusePercent: 80,
        description:
          "Multi-stage brackish and sea water reverse osmosis skids equipped with energy recovery turbines and PLC control.",
        processChain: [
          "Raw water multi-grade filter",
          "Anti-scalant & micron cartridge",
          "High-pressure booster pump",
          "Spiral wound RO membrane rack",
          "Permeate storage & CIP system",
        ],
      },
      {
        id: "softener",
        name: "Hard-Water Scale Prevention",
        plantType: "Water Softening Plant",
        plantSlug: "water-softening-plants",
        technology:
          "Sodium-cycle cation resin with automatic multi-port valve",
        designObjective:
          "Hardness reduction to < 5 ppm as CaCO₃ to protect cooling towers, chillers, and boilers.",
        reusePercent: 98,
        description:
          "Turnkey industrial water softeners eliminating calcium and magnesium scale formation across heat-exchange equipment.",
        processChain: [
          "Feed-water hardness testing",
          "Inlet particulate pre-filter",
          "Strong cation ion-exchange resin",
          "Automated brine suction regeneration",
          "Final rinse & softened water supply",
        ],
      },
    ],
  },
  projectTracker: {
    badge: "Commissioned & Ongoing EPC Sites",
    title: "Live EPC Project Tracker",
    description:
      "Track active ongoing site erections alongside historically commissioned treatment facilities across India.",
  },
  valueProposition: {
    badge: "Turnkey EPC Accountability",
    title:
      "One accountable engineering partner across the entire water lifecycle.",
    description:
      "From raw water lab assays and chemical process simulations through to workshop skid fabrication, on-site erection, and decades of guaranteed AMC operations.",
    ctaText: "Our EPC Delivery Methodology",
    ctaLink: "/about-us",
    qualityPills: [
      { text: "Zero Outsourced Skid Fabrication", iconType: "check" },
      { text: "Performance Guarantee Contract", iconType: "shield" },
    ],
    capabilities: [
      {
        number: "01",
        title: "Process Chemistry & Engineering",
        description:
          "Water characterization, treatability studies, PFDs, P&IDs, and hydraulic sizing calibrated precisely to inlet load variations.",
      },
      {
        number: "02",
        title: "Heavy Skid Fabrication & Quality",
        description:
          "Pressure vessels, reaction tanks, skids, and membrane racks manufactured in-house with ASME code welding and ISO 9001 QA/QC.",
      },
      {
        number: "03",
        title: "Compliance-Guaranteed Discharge",
        description:
          "Treatment trains guaranteed to meet Central and State Pollution Control Board (CPCB/SPCB) norms with online COD/BOD analyzers.",
      },
      {
        number: "04",
        title: "PLC, SCADA & IoT Telemetry",
        description:
          "Integrated automation panels with remote cloud dashboards, automated backwash cycles, and flow/pH fault alerting.",
      },
      {
        number: "05",
        title: "Installation & Wet Commissioning",
        description:
          "Full turnkey on-site piping, pump alignment, biological MLSS sludge acclimatization, and hands-on plant operator training.",
      },
      {
        number: "06",
        title: "Lifecycle Operations & AMC Support",
        description:
          "Comprehensive annual maintenance, membrane chemical cleaning (CIP), consumable resin replenishments, and 24/7 technical callout.",
      },
    ],
  },
  certifications: {
    badge: "Certified for Excellence",
    title: "Official Government & ISO Accreditations",
    description:
      "Every plant is engineered and certified under stringent national and global quality standards.",
  },
  partners: {
    badge: "Industrial Trust & Footprint",
    title: "Trusted by India's Leading Industrial Enterprises",
    description:
      "Powering water security, zero-liquid discharge, and statutory compliance for leading manufacturers.",
  },
  clientMarquee: {
    badge: "Sector-Specific Engineering",
    title: "Engineering Trust Across 20+ Critical Process Sectors",
    description:
      "From sterile pharmaceutical WFI to high-salinity textile ZLD, our custom-engineered systems ensure 100% CPCB/SPCB compliance and maximum water circularity.",
    sectors: [
      {
        id: "pharma",
        name: "Pharmaceuticals",
        category: "process",
        iconName: "Pill",
        detail: "Ultra-pure WFI & Demin Water",
        badge: "USP & EP Pure Grade",
        challenge:
          "Endotoxins, Pyrogens, Heavy Metals & Sub-Micron Particles",
        keyMetric: { label: "Conductivity", value: "< 0.05 µS/cm" },
        secondaryMetric: { label: "Standards", value: "US-FDA / cGMP" },
        gradient: "from-[#6366f1] via-[#4f46e5] to-[#06b6d4]",
        iconBg:
          "bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-indigo-500/25",
        borderColor: "hover:border-indigo-400",
        recommendedPlant: "Demineralization (DM) Plants",
        processSummary:
          "Engineered multi-barrier purification combining double-pass sanitary reverse osmosis with chemical-free electrodeionization (EDI) and 185nm UV irradiation for pyrogen-free Water for Injection.",
        steps: [
          {
            title: "Sanitary Pre-Treatment",
            desc: "Activated carbon filtration & hot-water sanitizable media reducing free chlorine & silt density.",
          },
          {
            title: "Double-Pass Sanitary RO",
            desc: "High-rejection brackish membranes in 316L SS housing removing >99.2% dissolved ionic species.",
          },
          {
            title: "Electrodeionization (EDI)",
            desc: "Continuous electro-regeneration delivering demineralized water with conductivity < 0.05 µS/cm.",
          },
          {
            title: "UV Sanitization & UF",
            desc: "Dual-wavelength 185/254nm ultraviolet lamps and 6,000 Dalton ultrafiltration for endotoxin removal.",
          },
        ],
      },
      {
        id: "textiles",
        name: "Textiles & Dyeing",
        category: "heavy",
        iconName: "Shirt",
        detail: "Colour & TDS Recovery ZLD",
        badge: "96.5% Closed-Loop ZLD",
        challenge:
          "Refractory Azo Dyes, Salt TDS (15,000+ ppm) & Extreme Chemical COD",
        keyMetric: { label: "Water Recovery", value: "96.5% Reuse" },
        secondaryMetric: {
          label: "Effluent Standard",
          value: "Zero Liquid Discharge",
        },
        gradient: "from-[#0284c7] via-[#0369a1] to-[#ec4899]",
        iconBg:
          "bg-gradient-to-br from-sky-500 to-pink-500 shadow-sky-500/25",
        borderColor: "hover:border-sky-400",
        recommendedPlant: "Effluent Treatment Plants (ETP)",
        processSummary:
          "Comprehensive Zero Liquid Discharge (ZLD) train combining color coagulation, advanced biological degradation, high-pressure RO membranes, and mechanical vapor recompression evaporators.",
        steps: [
          {
            title: "Physico-Chemical De-color",
            desc: "Flash coagulation using specialty decoloring polymers and ferric flocculation to precipitate dyes.",
          },
          {
            title: "Aerobic MBBR Bio-Reactor",
            desc: "Fluidized high-surface bio-carriers breaking down complex surfactant organics and COD load.",
          },
          {
            title: "Multi-Stage High Recovery RO",
            desc: "80-bar high-pressure membranes capturing clean permeate for immediate dye-bath recycling.",
          },
          {
            title: "MVR Evaporator & ATFD",
            desc: "Thermal concentration recovering solid sodium chloride salts for dry disposal according to CPCB norms.",
          },
        ],
      },
      {
        id: "food-beverage",
        name: "Food & Beverage",
        category: "process",
        iconName: "Coffee",
        detail: "Sanitary RO & Effluent Recycling",
        badge: "Sanitary 316L SS Grade",
        challenge:
          "High Organic COD/BOD, Starch, Dairy Emulsions & Caustic CIP Effluent",
        keyMetric: { label: "BOD Reduction", value: "> 98% Permeate" },
        secondaryMetric: { label: "Sanitary Spec", value: "CIP Auto-Sanitize" },
        gradient: "from-[#f59e0b] via-[#d97706] to-[#0ea5e9]",
        iconBg:
          "bg-gradient-to-br from-amber-500 to-sky-500 shadow-amber-500/25",
        borderColor: "hover:border-amber-400",
        recommendedPlant: "Effluent Treatment Plants (ETP)",
        processSummary:
          "Food-grade sanitary processing that purifies process washwater and effluent through high-efficiency Dissolved Air Flotation (DAF), biological stabilization, and two-pass reverse osmosis.",
        steps: [
          {
            title: "DAF Clarification",
            desc: "Micro-bubble dissolved air flotation stripping >95% suspended fats, edible oils, and grease.",
          },
          {
            title: "Biological Stabilization",
            desc: "High-rate extended aeration decomposing starches and sugars into inert, non-odorous biomass.",
          },
          {
            title: "Sanitary Membrane Polish",
            desc: "Sanitary spiral-wound RO membranes recovering food-contact process rinse water.",
          },
        ],
      },
      {
        id: "automotive",
        name: "Automotive & Engineering",
        category: "heavy",
        iconName: "Car",
        detail: "Pre-Treatment & Paint Shop ETP",
        badge: "Paint Sludge Dewatering",
        challenge:
          "Phosphating Waste, Heavy Metals (Zn, Ni), Emulsified Coolants & Paint Sludge",
        keyMetric: { label: "Heavy Metals", value: "< 0.1 mg/L" },
        secondaryMetric: { label: "Coolant Recovery", value: "Oil Splitter 99%" },
        gradient: "from-[#64748b] via-[#475569] to-[#0284c7]",
        iconBg:
          "bg-gradient-to-br from-slate-600 to-sky-600 shadow-slate-600/25",
        borderColor: "hover:border-slate-400",
        recommendedPlant: "Effluent Treatment Plants (ETP)",
        processSummary:
          "Multi-stage metal precipitation, emulsion breaking, and automated recessed plate filter presses handling heavy metal paint sludge and machining coolants.",
        steps: [
          {
            title: "Emulsion Cracking",
            desc: "Acid cracking and chemical emulsion breaker dosing to separate free cutting oils.",
          },
          {
            title: "Heavy Metal Precipitation",
            desc: "pH adjustment and sulfide precipitation removing zinc, nickel, and trivalent chromium.",
          },
          {
            title: "Lamella Clarification",
            desc: "High-rate tube settling yielding clear overflow for tertiary dual media filtration.",
          },
        ],
      },
      {
        id: "chemical",
        name: "Chemicals & Petrochemicals",
        category: "heavy",
        iconName: "FlaskConical",
        detail: "Toxic COD & Multi-Effect Evaporators",
        badge: "ZLD with Salt Recovery",
        challenge:
          "Aromatic Solvents, High Salinity, Phenols & Non-Biodegradable COD",
        keyMetric: { label: "Phenol Stripping", value: "> 99.5%" },
        secondaryMetric: { label: "Condensate Purity", value: "TDS < 30 ppm" },
        gradient: "from-[#dc2626] via-[#ea580c] to-[#ca8a04]",
        iconBg:
          "bg-gradient-to-br from-red-600 to-amber-600 shadow-red-600/25",
        borderColor: "hover:border-red-400",
        recommendedPlant: "Effluent Treatment Plants (ETP)",
        processSummary:
          "Fenton advanced oxidation, stripping columns, and titanium multi-effect evaporators (MEE) engineered for hazardous refractory chemical streams.",
        steps: [
          {
            title: "Advanced Oxidation (AOP)",
            desc: "Hydroxyl free radical generation breaking refractory benzene rings and toxic organics.",
          },
          {
            title: "Steam Stripping",
            desc: "Counter-current column removing volatile hydrocarbons before biological treatment.",
          },
          {
            title: "Forced Circulation MEE",
            desc: "Corrosion-resistant titanium evaporators crystallizing concentrated salt cake.",
          },
        ],
      },
      {
        id: "hotels",
        name: "Hotels, IT & Real Estate",
        category: "civic",
        iconName: "Hotel",
        detail: "Odorless STP for Flushing & HVAC",
        badge: "Odor-Free Compact MBBR",
        challenge:
          "Space Constraints, Peak Hydraulic Surges, Kitchen Oil & Grease, Odor Controls",
        keyMetric: { label: "BOD Reduction", value: "< 5 mg/L" },
        secondaryMetric: {
          label: "Reuse Efficiency",
          value: "100% Flush/Cooling",
        },
        gradient: "from-[#0d9488] via-[#059669] to-[#0284c7]",
        iconBg:
          "bg-gradient-to-br from-teal-600 to-emerald-600 shadow-teal-600/25",
        borderColor: "hover:border-teal-400",
        recommendedPlant: "Sewage Treatment Plants (STP)",
        processSummary:
          "Basement-installed subterranean MBBR/MBR sewage treatment plants featuring bio-scrubber odor control, submerged ultrafiltration, and automated dual-plumbing reuse.",
        steps: [
          {
            title: "Grease Trap & Screening",
            desc: "Automated mechanical rotary screens and multi-compartment grease interceptors.",
          },
          {
            title: "MBBR / MBR Digestion",
            desc: "High-density microbial biofilm on HDPE carriers eliminating smells and solids.",
          },
          {
            title: "UF & Ozone Polishing",
            desc: "0.04-micron ultrafiltration and ozonation generating crystal-clear water for chillers.",
          },
        ],
      },
    ],
  },
  faqs: {
    badge: "Clarifications & Knowledge Base",
    title: "Industrial Clarifications & Frequently Asked Questions",
    description:
      "Direct engineering answers on CPCB discharge norms, MBBR vs SBR selection, membrane longevity, and turnkey project commissioning timelines.",
  },
};
