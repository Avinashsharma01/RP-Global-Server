"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const User_1 = require("../models/User");
const Product_1 = require("../models/Product");
const JobOpening_1 = require("../models/JobOpening");
const ProjectGallery_1 = require("../models/ProjectGallery");
const ClientTestimonial_1 = require("../models/ClientTestimonial");
const FAQ_1 = require("../models/FAQ");
const initialFaqs_1 = require("../data/initialFaqs");
const seedData = async () => {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rpglobal";
    console.log(`[Seed Script] Connecting to MongoDB: ${mongoURI}`);
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log("[Seed Script] Connected successfully.");
        // 1. Seed Default Admin User
        const existingAdmin = await User_1.User.findOne({ email: "admin@rpglobalprojects.com" });
        if (!existingAdmin) {
            await User_1.User.create({
                email: "admin@rpglobalprojects.com",
                password: "Admin@RPGlobal2026!",
                fullName: "RP Global Administration Desk",
                role: "SUPER_ADMIN",
                isActive: true,
            });
            console.log("✔ Admin User seeded: admin@rpglobalprojects.com / Admin@RPGlobal2026!");
        }
        else {
            console.log("✔ Admin User already exists.");
        }
        // 2. Clear and Seed 6 Core Industrial Plant Products
        await Product_1.Product.deleteMany({});
        console.log("✔ Cleared old product entries.");
        const products = [
            {
                name: "Demineralization (DM) Plant",
                slug: "demineralization-plants",
                category: "DEMINERALIZATION_DM",
                tagline: "High-Purity Deionized Water for High-Pressure Boilers, Power & Pharmaceutical Processing",
                capacityRange: "500 LPH to 100 m³/hr",
                summary: "Engineered two-bed and mixed-bed ion exchange demineralization systems producing high-purity water with conductivity < 0.1 µS/cm and silica < 0.02 ppm.",
                description: "R P Global Projects designs, fabricates, and commissions state-of-the-art Demineralization (DM) Plants engineered to remove dissolved mineral salts, ions, and reactive silica from process feed water. Utilizing premium Strong Acid Cation (SAC) and Strong Base Anion (SBA) resins alongside optional Mixed Bed (MB) polishers, our systems ensure ultra-pure deionized water compliance for critical boiler feeds and pharmaceutical formulations.",
                keyFeatures: [
                    "Conductivity guaranteed below 0.1 µS/cm with mixed bed polishing",
                    "Automatic acid (HCl) and caustic (NaOH) regeneration skids with zero leak containment",
                    "FRP / Rubber-Lined Mild Steel (MSRL) pressure vessels resistant to corrosive reagents",
                    "Digital PLC/SCADA control panel with online conductivity & silica monitoring",
                    "Low chemical consumption through counter-current regeneration technology",
                ],
                processSteps: [
                    {
                        stepNumber: 1,
                        title: "Pre-Filtration & Coagulation",
                        description: "Raw feed water passes through Dual Media Filter (DMF) and Activated Carbon Filter (ACF) to eliminate suspended solids and free chlorine.",
                        equipmentUsed: "Dual Media Sand & Carbon Pressure Vessels",
                    },
                    {
                        stepNumber: 2,
                        title: "Strong Acid Cation Exchanger (SAC)",
                        description: "Cations (Ca2+, Mg2+, Na+, K+) are exchanged for Hydrogen ions (H+) across strong acid polystyrene resin bed.",
                        equipmentUsed: "SAC Resin Tower with multiport distributor",
                    },
                    {
                        stepNumber: 3,
                        title: "Degasser Tower (Decarbonation)",
                        description: "Low pH carbonic acid breaks down into water and gaseous CO2, which is stripped via counter-flow air blower.",
                        equipmentUsed: "FRP Packed Bed Degasser Tower with Air Blower",
                    },
                    {
                        stepNumber: 4,
                        title: "Strong Base Anion Exchanger (SBA)",
                        description: "Anions (SO4 2-, Cl-, NO3-, SiO2) are exchanged for Hydroxyl ions (OH-), yielding neutral demineralized water.",
                        equipmentUsed: "SBA Resin Tower with caustic dosing",
                    },
                    {
                        stepNumber: 5,
                        title: "Mixed Bed Polisher (MB)",
                        description: "Intimately mixed SAC and SBA resins eliminate remaining traces of ions, producing ultra-pure water.",
                        equipmentUsed: "Mixed Bed Polish Cylinder with internal regenerant header",
                    },
                ],
                technicalSpecs: [
                    { label: "Product Water Conductivity", value: "< 0.1 µS/cm (with MB) / < 10 µS/cm (Two-Bed)", unit: "µS/cm", category: "Water Quality" },
                    { label: "Reactive Silica as SiO2", value: "< 0.02", unit: "ppm", category: "Water Quality" },
                    { label: "Treated Water pH", value: "6.8 – 7.2", unit: "pH", category: "Water Quality" },
                    { label: "Vessel Material of Construction", value: "FRP / MSRL (Mild Steel Rubber Lined)", category: "Mechanical" },
                    { label: "Frontal Piping & Valves", value: "uPVC / CPVC / SS316 with diaphragm/pneumatic valves", category: "Mechanical" },
                    { label: "Automation Level", value: "Manual, Semi-Automatic, or Full PLC/SCADA", category: "Control System" },
                ],
                comparisonMatrix: [
                    {
                        parameter: "Product Conductivity",
                        techOptionA: "5 to 15 µS/cm (Two-Bed DM)",
                        techOptionB: "< 0.1 µS/cm (Two-Bed + Mixed Bed)",
                        techOptionC: "< 0.05 µS/cm (RO + EDI Electro-deionization)",
                    },
                    {
                        parameter: "Chemical Footprint",
                        techOptionA: "Requires regular HCl & NaOH regeneration",
                        techOptionB: "Requires acid & alkali regeneration",
                        techOptionC: "Chemical-free continuous electric regeneration",
                    },
                    {
                        parameter: "Capital Expenditure (CAPEX)",
                        techOptionA: "Cost-Effective / Economical",
                        techOptionB: "Moderate",
                        techOptionC: "Higher initial equipment investment",
                    },
                ],
                applications: [
                    "Thermal & Captive Power Plant Boiler Feed",
                    "Pharmaceutical APIs & Liquid Formulations",
                    "Semiconductor & Electronics Rinse Water",
                    "Chemical Processing & Synthesis Reaction Dilution",
                    "Electroplating & Automotive Paint Lines",
                ],
                imageUrl: "/images/plants/dm-plant.jpg",
                brochureUrl: "/downloads/rpglobal-dm-plants-spec.pdf",
                order: 1,
                isPublished: true,
            },
            {
                name: "Effluent Treatment Plant (ETP)",
                slug: "effluent-treatment-plants",
                category: "EFFLUENT_TREATMENT_ETP",
                tagline: "Industrial Wastewater Remediation, Heavy Metal Removal & Zero Liquid Discharge (ZLD)",
                capacityRange: "10 KLD to 2,000+ KLD",
                summary: "Heavy-duty turnkey industrial wastewater plants combining physico-chemical precipitation, biological treatment, and tertiary filtration guaranteeing 100% CPCB compliance.",
                description: "R P Global Projects delivers robust industrial Effluent Treatment Plants (ETP) tailored to treat hazardous, chemical-laden, high-COD/BOD industrial discharge. From textile dye houses and chemical refineries to electroplating units and food processing facilities, our plants utilize advanced dissolved air flotation (DAF), moving bed biofilm reactors (MBBR), and membrane bioreactors (MBR) engineered to achieve Zero Liquid Discharge (ZLD).",
                keyFeatures: [
                    "Guaranteed discharge meeting state (SPCB) and central (CPCB) pollution control parameters",
                    "Over 90% Chemical Oxygen Demand (COD) and 95% Biochemical Oxygen Demand (BOD) reduction",
                    "Compact Skid-Mounted ETP options for space-constrained industrial premises",
                    "Automated chemical dosing (Coagulant, Flocculant, Lime, Alum, Poly-electrolyte)",
                    "Integrated sludge dewatering filter press reducing hazardous cake volume",
                ],
                processSteps: [
                    {
                        stepNumber: 1,
                        title: "Screening & Oil Separation",
                        description: "Effluent passes through mechanical bar screens and grease traps to remove coarse debris and free floating hydrocarbons.",
                        equipmentUsed: "Mechanical Bar Screen & Multi-Plate Oil Skimmer",
                    },
                    {
                        stepNumber: 2,
                        title: "Equalization & Neutralization",
                        description: "Surge volume buffering with coarse bubble diffused aeration and automated pH correction dosing.",
                        equipmentUsed: "RCC / Epoxy Coated Equalization Tank with Air Grid",
                    },
                    {
                        stepNumber: 3,
                        title: "Flash Mixing & Primary Clarification",
                        description: "Chemical precipitation using PAC/Alum and polyelectrolyte flocculants followed by laminar tube settling.",
                        equipmentUsed: "Flash Mixer, Flocculation Tank & Tube Settler Clarifier",
                    },
                    {
                        stepNumber: 4,
                        title: "Biological Aerobic / Anaerobic Oxidation",
                        description: "Bacterial degradation of soluble organics in aeration tank via MBBR fluidized carriers or activated sludge.",
                        equipmentUsed: "MBBR Bioreactor with fine bubble membrane diffusers",
                    },
                    {
                        stepNumber: 5,
                        title: "Tertiary Filtration & Sludge Dewatering",
                        description: "Treated supernatant is filtered through pressure sand and carbon beds, while wet sludge is pressed into dry cake.",
                        equipmentUsed: "Dual Media Filters & Hydraulic Plate-and-Frame Filter Press",
                    },
                ],
                technicalSpecs: [
                    { label: "BOD Reduction Efficiency", value: "> 95%", unit: "%", category: "Efficiency" },
                    { label: "COD Reduction Efficiency", value: "> 90%", unit: "%", category: "Efficiency" },
                    { label: "Treated Effluent TSS", value: "< 20", unit: "mg/L", category: "Water Quality" },
                    { label: "Treated Effluent Oil & Grease", value: "< 5", unit: "mg/L", category: "Water Quality" },
                    { label: "Sludge Cake Moisture Content", value: "< 60%", unit: "%", category: "Mechanical" },
                    { label: "Plant Control System", value: "Microprocessor / PLC with Automated Dosing Loops", category: "Automation" },
                ],
                comparisonMatrix: [
                    {
                        parameter: "Treatment Strategy",
                        techOptionA: "Conventional Physico-Chemical + ASP",
                        techOptionB: "Physico-Chemical + MBBR Bio-Tower",
                        techOptionC: "ZLD System (ETP + RO + MEE Evaporator)",
                    },
                    {
                        parameter: "Land Footprint",
                        techOptionA: "Large civil aeration basins required",
                        techOptionB: "40% smaller footprint with carrier media",
                        techOptionC: "Moderate footprint with dedicated mechanical shed",
                    },
                    {
                        parameter: "Environmental Outcome",
                        techOptionA: "Surface discharge compliance",
                        techOptionB: "Water suitable for gardening / flushing",
                        techOptionC: "100% water recovery with zero liquid discharge",
                    },
                ],
                applications: [
                    "Textile Processing & Fabric Dyeing Units",
                    "Automotive & Electroplating Surface Treatment",
                    "Pharmaceutical Bulk Drug & API Facilities",
                    "Food Processing, Dairies & Breweries",
                    "Chemical Manufacturing & Petrochemical Compounds",
                ],
                imageUrl: "/images/plants/etp-plant.jpg",
                brochureUrl: "/downloads/rpglobal-etp-plants-spec.pdf",
                order: 2,
                isPublished: true,
            },
            {
                name: "Reverse Osmosis (RO) Plant",
                slug: "reverse-osmosis-plants",
                category: "REVERSE_OSMOSIS_RO",
                tagline: "High-Rejection Membrane Separation for Industrial Water Purification & Desalination",
                capacityRange: "250 LPH to 200 m³/hr",
                summary: "Commercial and industrial RO skids incorporating high-flux thin-film composite (TFC) membranes for brackish and sea water desalination with >98.5% salt rejection.",
                description: "R P Global Projects engineers high-efficiency industrial Reverse Osmosis (RO) plants built with premium grade pressure vessels, multistage vertical booster pumps, and computerized instrumentation. Our RO skids remove dissolved solids, heavy minerals, bacteria, and chemical contaminants from ground borewells, river supplies, and recycled wastewater.",
                keyFeatures: [
                    "Salt and dissolved solid rejection rate exceeding 98.5%",
                    "Energy-efficient recovery rates between 70% and 85% with concentrate recycling",
                    "Stainless Steel (SS304/SS316) high-pressure manifolds with anti-corrosion protection",
                    "Programmable microprocessor / PLC with automatic flush and CIP (Clean-In-Place) skid",
                    "Online digital conductivity, flow rotameters, and high/low pressure cut-off trips",
                ],
                processSteps: [
                    {
                        stepNumber: 1,
                        title: "Multi-Grade Sand & Carbon Filtration",
                        description: "Turbidity, silt, colloidal matter, and chlorine are removed to prevent membrane fouling.",
                        equipmentUsed: "Automatic Pressure Sand Filter & Activated Carbon Absorber",
                    },
                    {
                        stepNumber: 2,
                        title: "Anti-Scalant & SMBS Chemical Dosing",
                        description: "Scale inhibitors prevent calcium carbonate precipitation; sodium metabisulfite eliminates residual chlorine.",
                        equipmentUsed: "Electronic Metering Dosing Pumps & Dosing Tanks",
                    },
                    {
                        stepNumber: 3,
                        title: "Micron Sediment Cartridge Filtration",
                        description: "5-micron spun polypropylene filters trap fine particulates before entering high-pressure pumps.",
                        equipmentUsed: "SS316 Multi-Cartridge Housing with 5µm filter elements",
                    },
                    {
                        stepNumber: 4,
                        title: "High-Pressure Booster Pumping",
                        description: "Vertical multistage pump raises feedwater pressure above osmotic pressure threshold.",
                        equipmentUsed: "Grundfos / CNP Vertical Multistage SS Pump",
                    },
                    {
                        stepNumber: 5,
                        title: "RO Membrane Cross-Flow Separation",
                        description: "Pure water permeates across spiral-wound polyamide membranes into storage; brine is rejected or recycled.",
                        equipmentUsed: "Hydranautics / Toray 8040 Spiral-Wound Membranes in FRP Housings",
                    },
                ],
                technicalSpecs: [
                    { label: "TDS Salt Rejection Rate", value: "> 98.5%", unit: "%", category: "Performance" },
                    { label: "Permeate Water Recovery", value: "70% – 85%", unit: "%", category: "Performance" },
                    { label: "Membrane Type", value: "Polyamide Thin Film Composite (TFC) 4040 / 8040", category: "Mechanical" },
                    { label: "High Pressure Piping MOC", value: "SS304 / SS316 Food Grade", category: "Mechanical" },
                    { label: "Operating Pressure", value: "10 – 16", unit: "kg/cm²", category: "Operating Parameters" },
                    { label: "Inlet Feed TDS Tolerance", value: "Up to 5,000 (Brackish) / 35,000 (Sea Water)", unit: "ppm", category: "Operating Parameters" },
                ],
                comparisonMatrix: [
                    {
                        parameter: "Configuration",
                        techOptionA: "Standard Brackish RO Skid",
                        techOptionB: "Two-Pass Ultra-Pure RO",
                        techOptionC: "Sea Water RO (SWRO)",
                    },
                    {
                        parameter: "Feed TDS Capability",
                        techOptionA: "Up to 3,500 ppm",
                        techOptionB: "Up to 2,000 ppm (Produces < 5 ppm TDS)",
                        techOptionC: "Up to 40,000 ppm High Salinity",
                    },
                    {
                        parameter: "Typical Use Case",
                        techOptionA: "Factory Drinking Water & Cooling Makeup",
                        techOptionB: "Pharma WFI & Boiler High-Pressure Feed",
                        techOptionC: "Coastal Hotels, Marine & Offshore Rigs",
                    },
                ],
                applications: [
                    "Packaged Drinking Water & Mineral Bottling Units",
                    "Beverage, Brewery & Dairy Processing Water",
                    "Industrial Cooling Towers & Boiler Feed Water",
                    "Hospitals, Dialysis Centers & Healthcare Campuses",
                    "Hotels, Commercial Malls & Corporate Offices",
                ],
                imageUrl: "/images/plants/ro-plant.jpg",
                brochureUrl: "/downloads/rpglobal-ro-plants-spec.pdf",
                order: 3,
                isPublished: true,
            },
            {
                name: "Sewage Treatment Plant (STP)",
                slug: "sewage-treatment-plants",
                category: "SEWAGE_TREATMENT_STP",
                tagline: "Odourless Biological Domestic Sewage Treatment for Water Recycling in High-Rises & Campuses",
                capacityRange: "25 KLD to 5,000+ KLD",
                summary: "Modern biological sewage treatment plants employing MBBR, SBR, and MBR technologies designed to produce odor-free, crystal-clear water compliant with CPCB standards for flushing and horticulture.",
                description: "R P Global Projects is a market leader in designing and constructing odorless, high-efficiency Sewage Treatment Plants (STP). Serving residential gated communities, commercial IT tech parks, educational campuses, and hotels, our systems treat domestic black and grey water with maximum nutrient removal and zero nuisance.",
                keyFeatures: [
                    "Treated water fully compliant with Central Pollution Control Board (CPCB) norms",
                    "Zero foul odor execution with enclosed tank covers and bio-filter venting",
                    "Up to 75% water recycling for toilet flushing, gardening, and HVAC cooling towers",
                    "Options for underground, semi-underground, or modular containerized configurations",
                    "Low operating cost and minimal maintenance footprint with automated blowers",
                ],
                processSteps: [
                    {
                        stepNumber: 1,
                        title: "Bar Screening & Grit Separation",
                        description: "Incoming raw sewage passes through stainless steel fine screens to capture rags, plastics, and debris.",
                        equipmentUsed: "Coarse and Fine Screen Chambers",
                    },
                    {
                        stepNumber: 2,
                        title: "Equalization & Homogenization",
                        description: "Surge buffer tank equipped with air grid ensures uniform organic loading and flow balancing.",
                        equipmentUsed: "Equalization Tank with Air Diffusers & Submersible Pumps",
                    },
                    {
                        stepNumber: 3,
                        title: "Moving Bed Biofilm Reactor (MBBR)",
                        description: "Engineered plastic carrier media provides massive surface area for biological biofilm culture.",
                        equipmentUsed: "MBBR Tank with Virgin Polypropylene Bio-Media & Fine Bubble Diffusers",
                    },
                    {
                        stepNumber: 4,
                        title: "Tube Settling Clarification",
                        description: "Biomass and biological sludge settle out in laminar inclined tube settler modules.",
                        equipmentUsed: "Clarifier with PVC Tube Settler Media & Sludge Hopper",
                    },
                    {
                        stepNumber: 5,
                        title: "Tertiary Sand, Carbon & Disinfection Filtration",
                        description: "Supernatant is polished through pressure sand and carbon filters and disinfected via chlorine / ozone.",
                        equipmentUsed: "Multi-Grade Sand Filter, Activated Carbon Filter & UV / Chlorinator",
                    },
                ],
                technicalSpecs: [
                    { label: "Treated BOD", value: "< 10", unit: "mg/L", category: "Water Quality" },
                    { label: "Treated COD", value: "< 50", unit: "mg/L", category: "Water Quality" },
                    { label: "Treated Total Suspended Solids (TSS)", value: "< 10", unit: "mg/L", category: "Water Quality" },
                    { label: "Turbidity", value: "< 2", unit: "NTU", category: "Water Quality" },
                    { label: "Faecal Coliform", value: "< 100", unit: "MPN/100ml", category: "Microbiological" },
                    { label: "Core Technologies Offered", value: "MBBR, SBR (Sequencing Batch), MBR (Membrane Bioreactor)", category: "Process" },
                ],
                comparisonMatrix: [
                    {
                        parameter: "Technology Metric",
                        techOptionA: "MBBR (Fluidized Biofilm)",
                        techOptionB: "SBR (Sequencing Batch Reactor)",
                        techOptionC: "MBR (Membrane Bioreactor)",
                    },
                    {
                        parameter: "Footprint Required",
                        techOptionA: "Compact (40% less than ASP)",
                        techOptionB: "Moderate footprint (Batch tanks)",
                        techOptionC: "Ultra-compact (Smallest footprint)",
                    },
                    {
                        parameter: "Treated Water Quality",
                        techOptionA: "BOD < 10 ppm (Gardening/Flushing)",
                        techOptionB: "BOD < 10 ppm with nutrient removal",
                        techOptionC: "BOD < 5 ppm, Turbidity < 0.2 NTU (Ultra-Pure)",
                    },
                ],
                applications: [
                    "Residential High-Rise Societies & Gated Townships",
                    "Commercial IT Hubs, Corporate Offices & Shopping Malls",
                    "Hospitals, Medical Colleges & University Campuses",
                    "Luxury Hotels, Resorts & Clubhouses",
                    "Industrial Estates Domestic Wastewater Management",
                ],
                imageUrl: "/images/plants/stp-plant.jpg",
                brochureUrl: "/downloads/rpglobal-stp-plants-spec.pdf",
                order: 4,
                isPublished: true,
            },
            {
                name: "Water Softening Plant",
                slug: "water-softening-plants",
                category: "WATER_SOFTENING",
                tagline: "Ion-Exchange Hardness Reduction for Boilers, Cooling Towers & Hospitality",
                capacityRange: "500 LPH to 150 m³/hr",
                summary: "Automatic and manual ion-exchange water softeners utilizing high-capacity sodium (Na+) cation exchange resins to eliminate calcium and magnesium scaling.",
                description: "R P Global Projects manufactures industrial and commercial Water Softening Plants engineered to eliminate hard water problems including scale deposition, pipe clogging, and boiler tube rupture. By replacing scale-forming calcium (Ca2+) and magnesium (Mg2+) ions with soluble sodium ions, our softeners protect expensive heat exchangers, cooling towers, and laundry machinery.",
                keyFeatures: [
                    "Treated water hardness consistently reduced to below 5 ppm (as CaCO3)",
                    "Automatic multiport valves with timer or flow-meter controlled regeneration cycles",
                    "High-capacity cross-linked polystyrene gel cation exchange resin",
                    "Corrosion-resistant FRP composite pressure vessels with internal distribution headers",
                    "Complete brine saturator tank with salt grid, suction float valve, and brine tubing",
                ],
                processSteps: [
                    {
                        stepNumber: 1,
                        title: "Hard Water Service Run",
                        description: "Hard water percolates through sodium-charged cation resin bed, exchanging hardness ions for sodium.",
                        equipmentUsed: "FRP Vessel with top distributor & bottom collector hub",
                    },
                    {
                        stepNumber: 2,
                        title: "Backwash Phase",
                        description: "Water flows upward to expand the resin bed, flushing away trapped particulate impurities.",
                        equipmentUsed: "Automatic Multiport Control Valve",
                    },
                    {
                        stepNumber: 3,
                        title: "Brine Suction & Regeneration",
                        description: "Concentrated NaCl brine solution is drawn into the vessel via ejector, recharging resin beads with Na+.",
                        equipmentUsed: "Brine Tank with brine well and suction assembly",
                    },
                    {
                        stepNumber: 4,
                        title: "Slow & Fast Rinse",
                        description: "Fresh water displaces remaining brine solution and compacts the resin bed back into service readiness.",
                        equipmentUsed: "Multiport Valve Rinse Cycle",
                    },
                ],
                technicalSpecs: [
                    { label: "Treated Water Hardness", value: "< 5", unit: "ppm (as CaCO3)", category: "Water Quality" },
                    { label: "Resin Type", value: "Strong Acid Cation (Gel Type Polystyrene)", category: "Chemical" },
                    { label: "Operating Pressure", value: "2.0 – 3.5", unit: "kg/cm²", category: "Operating Limits" },
                    { label: "Regenerant Chemical", value: "Commercial Grade Sodium Chloride (Salt NaCl)", category: "Regeneration" },
                    { label: "Vessel Material", value: "FRP (Fiberglass Reinforced Polymer) / Mild Steel", category: "Mechanical" },
                ],
                comparisonMatrix: [
                    {
                        parameter: "Regeneration Mode",
                        techOptionA: "Manual Multiport Valve",
                        techOptionB: "Automatic Time-Clock Control",
                        techOptionC: "Automatic Metered (Volumetric) Valve",
                    },
                    {
                        parameter: "Operator Oversight",
                        techOptionA: "Requires manual valve rotation by operator",
                        techOptionB: "Regenerates automatically on set days/times",
                        techOptionC: "Regenerates strictly upon water volume consumption",
                    },
                    {
                        parameter: "Salt Efficiency",
                        techOptionA: "Risk of salt wastage on low consumption",
                        techOptionB: "Good",
                        techOptionC: "Maximum salt & water efficiency",
                    },
                ],
                applications: [
                    "Low & Medium Pressure Industrial Boilers",
                    "Cooling Towers & Heat Exchanger Makeup Water",
                    "Commercial Laundries & Textile Finishing",
                    "Hotels, Commercial Kitchens & Restaurants",
                    "Residential Apartments & Condominium Complexes",
                ],
                imageUrl: "/images/plants/softening-plant.jpg",
                brochureUrl: "/downloads/rpglobal-softener-plants-spec.pdf",
                order: 5,
                isPublished: true,
            },
            {
                name: "Water Treatment Plant (WTP)",
                slug: "water-treatment-plants",
                category: "WATER_TREATMENT_WTP",
                tagline: "Surface & River Water Clarification, Rapid Sand Filtration & Municipal Potable Water",
                capacityRange: "1 MLD to 50 MLD / 10 m³/hr to 500 m³/hr",
                summary: "Turnkey municipal and industrial surface water treatment plants engineered with coagulation, flocculation, lamella clarification, and rapid gravity filtration delivering WHO/BIS potable standards.",
                description: "R P Global Projects specializes in turnkey EPC delivery of large-scale Water Treatment Plants (WTP) sourcing raw water from rivers, lakes, canals, and reservoirs. Our engineering expertise spans raw water intake structures, alum/PAC chemical coagulant flash mixers, flocculators, lamella tube clarifiers, rapid sand filters, and chlorination systems designed to supply drinking and industrial-grade water.",
                keyFeatures: [
                    "Treated water compliant with BIS 10500:2012 Drinking Water Standards",
                    "High-rate Lamella / Tube Settler technology delivering compact clarifier footprints",
                    "Automated backwash rapid gravity and dual media pressure filtration systems",
                    "Continuous disinfection dosing ensuring residual chlorine pathogen protection",
                    "Heavy-duty civil RCC constructions or modular skid-mounted steel package systems",
                ],
                processSteps: [
                    {
                        stepNumber: 1,
                        title: "Intake & Coarse Screening",
                        description: "Raw canal/river water enters via intake well with trash racks and fine mechanical screens.",
                        equipmentUsed: "Mechanical Trash Rack & Intake Screen",
                    },
                    {
                        stepNumber: 2,
                        title: "Coagulant Flash Mixing",
                        description: "Alum or Poly Aluminum Chloride (PAC) is dosed into rapid turbulent mixer to destabilize colloidal charges.",
                        equipmentUsed: "High-Speed Flash Mixer & Chemical Dosing Skid",
                    },
                    {
                        stepNumber: 3,
                        title: "Flocculation Baffle Chamber",
                        description: "Slow paddle agitation facilitates agglomeration of destabilized micro-particles into settleable flocs.",
                        equipmentUsed: "Variable Speed Paddle Flocculator",
                    },
                    {
                        stepNumber: 4,
                        title: "Lamella / Tube Settler Clarification",
                        description: "Flocs settle rapidly across inclined honeycomb tube modules; clean water overflows to collection launders.",
                        equipmentUsed: "Clarifier Basin with Lamella Media Packs",
                    },
                    {
                        stepNumber: 5,
                        title: "Rapid Gravity Sand Filtration & Disinfection",
                        description: "Water passes through multi-layer quartz sand and anthracite coal, followed by sodium hypochlorite chlorination.",
                        equipmentUsed: "Rapid Sand Filter Bed & Chlorination Contact Tank",
                    },
                ],
                technicalSpecs: [
                    { label: "Treated Water Turbidity", value: "< 1", unit: "NTU", category: "Water Quality" },
                    { label: "Color", value: "< 5", unit: "Hazen Units", category: "Water Quality" },
                    { label: "Pathogen / Coliform Removal", value: "> 99.9%", unit: "%", category: "Microbiological" },
                    { label: "Treated Water Standards", value: "IS 10500:2012 / WHO Potable Guidelines", category: "Compliance" },
                    { label: "Construction Type", value: "Reinforced Cement Concrete (RCC) or Skid Mounted Package", category: "Civil / Structural" },
                ],
                comparisonMatrix: [
                    {
                        parameter: "Plant Architecture",
                        techOptionA: "Conventional RCC Civil WTP",
                        techOptionB: "Modular Package Skid WTP",
                        techOptionC: "Ultrafiltration (UF) Membrane WTP",
                    },
                    {
                        parameter: "Execution Time",
                        techOptionA: "9 to 18 Months (Large civil works)",
                        techOptionB: "2 to 4 Months (Factory fabricated)",
                        techOptionC: "3 to 6 Months",
                    },
                    {
                        parameter: "Output Purity",
                        techOptionA: "Potable standard (< 1 NTU)",
                        techOptionB: "Potable standard (< 1 NTU)",
                        techOptionC: "Absolute physical barrier (< 0.1 NTU)",
                    },
                ],
                applications: [
                    "Municipal Drinking Water Supply Schemes",
                    "Smart City Townships & Urban Development Projects",
                    "Industrial Parks & Special Economic Zones (SEZs)",
                    "Educational Universities & Armed Forces Cantonments",
                    "River & Canal Raw Water Clarification for Factories",
                ],
                imageUrl: "/images/plants/wtp-plant.jpg",
                brochureUrl: "/downloads/rpglobal-wtp-plants-spec.pdf",
                order: 6,
                isPublished: true,
            },
        ];
        await Product_1.Product.insertMany(products);
        console.log(`✔ Successfully seeded ${products.length} industrial plant models.`);
        // 3. Clear and Seed Sample Job Openings
        await JobOpening_1.JobOpening.deleteMany({});
        const jobs = [
            {
                title: "Senior Water Treatment Process Engineer",
                slug: "senior-water-treatment-process-engineer",
                department: "Engineering & Design",
                location: "Noida, Uttar Pradesh",
                employmentType: "Full-time",
                experienceRequired: "5-8 Years",
                positionsOpen: 2,
                responsibilities: [
                    "Prepare mass balance calculations, P&ID schematics, and hydraulic flow diagrams for ETP and STP projects.",
                    "Size biological aeration tanks, clarifiers, blowers, and membrane RO systems according to inlet water parameters.",
                    "Coordinate with fabrication teams on Skid mechanical layouts and bill of materials (BOM).",
                    "Lead technical discussions with client engineering consultants during design review meetings.",
                ],
                qualifications: [
                    "B.Tech / B.E. in Chemical or Environmental Engineering.",
                    "Proficiency in AutoCAD, hydraulic sizing calculations, and water design software.",
                    "Prior experience in EPC water treatment projects.",
                ],
                salaryRange: "₹8,00,000 – ₹14,00,000 P.A.",
                isActive: true,
            },
            {
                title: "STP / ETP Plant Commissioning Specialist",
                slug: "stp-etp-plant-commissioning-specialist",
                department: "Operations & Commissioning",
                location: "Site Locations (Pan-India)",
                employmentType: "Full-time",
                experienceRequired: "3-6 Years",
                positionsOpen: 3,
                responsibilities: [
                    "Supervise on-site erection, civil checking, piping alignment, and electrical panel connections.",
                    "Execute hydro-testing, motor no-load/load trials, and chemical dosing calibrations.",
                    "Develop biological biomass / MLSS culture in MBBR and activated sludge aeration tanks.",
                    "Conduct compliance water testing and handover signed performance certificates to client.",
                ],
                qualifications: [
                    "Diploma or Degree in Mechanical / Chemical / Environmental Engineering.",
                    "Hands-on expertise in commissioning pumps, blowers, clarifiers, and filter presses.",
                    "Willingness to travel across client sites in India.",
                ],
                salaryRange: "₹5,00,000 – ₹8,50,000 P.A.",
                isActive: true,
            },
            {
                title: "Industrial Sales & Business Development Manager - Water EPC",
                slug: "sales-manager-water-epc",
                department: "Sales & Marketing",
                location: "Noida, Uttar Pradesh",
                employmentType: "Full-time",
                experienceRequired: "4-7 Years",
                positionsOpen: 1,
                responsibilities: [
                    "Identify and generate industrial sales leads for turnkey STP, ETP, and RO plant projects across NCR, UP, Haryana, and Bihar.",
                    "Collaborate with internal design teams to formulate competitive techno-commercial proposals.",
                    "Lead contract negotiations and close EPC equipment and AMC operation contracts.",
                ],
                qualifications: [
                    "B.Tech in Engineering + MBA (Marketing preferred).",
                    "Strong network with manufacturing plants, real estate developers, and MEP consultants.",
                    "Demonstrated track record of closing B2B capital equipment sales.",
                ],
                salaryRange: "₹7,50,000 – ₹12,00,000 P.A. + Performance Incentives",
                isActive: true,
            },
        ];
        await JobOpening_1.JobOpening.insertMany(jobs);
        console.log(`✔ Successfully seeded ${jobs.length} career openings.`);
        // 4. Seed Project Gallery Installations
        await ProjectGallery_1.ProjectGallery.deleteMany({});
        const galleryItems = [
            {
                title: "1,200 KLD Industrial Zero Liquid Discharge (ZLD) Plant with MEE",
                category: "ETP Plants",
                capacityKLD: "1,200 KLD",
                location: "Dahej PCPIR, Gujarat",
                clientSector: "Petrochemicals & Specialty Chemicals",
                imageUrl: "/images/plant-etp.jpg",
                status: "RUNNING",
                progressPercentage: 78,
                currentStage: "Multi-Effect Evaporator Skid & Titanium Heat Exchanger Assembly",
                expectedCompletion: "December 2026",
                keyHighlights: ["Zero Liquid Discharge Assured", "Condensate Recovery 96%", "SCADA Controlled Automation"],
                completionYear: 2026,
                isFeatured: true,
                order: 1,
            },
            {
                title: "800 KLD Submerged Aerobic Fixed Film (SAFF) STP Plant",
                category: "STP Plants",
                capacityKLD: "800 KLD",
                location: "Manesar, Haryana",
                clientSector: "Automotive Manufacturing Campus",
                imageUrl: "/images/plant-stp.jpg",
                status: "RUNNING",
                progressPercentage: 55,
                currentStage: "Civil Reactor Tank Casting & Fine Bubble Diffuser Grid Installation",
                expectedCompletion: "November 2026",
                keyHighlights: ["Cooling Tower Reuse Spec", "BOD < 5 mg/L", "Dual Media Pressure Sand Filtration"],
                completionYear: 2026,
                isFeatured: true,
                order: 2,
            },
            {
                title: "40 m³/hr High-Recovery Industrial RO & EDI Skid",
                category: "RO Systems",
                capacityKLD: "960 KLD",
                location: "Baddi, Himachal Pradesh",
                clientSector: "Pharmaceutical Sterile API",
                imageUrl: "/images/plant-ro.jpg",
                status: "RUNNING",
                progressPercentage: 88,
                currentStage: "Membrane Loading, Hydrostatic Pressure Test & Calibration",
                expectedCompletion: "October 2026",
                keyHighlights: ["Conductivity < 0.1 µS/cm", "Dow Filmtec Membranes", "SS 316L Sanitary Piping"],
                completionYear: 2026,
                isFeatured: true,
                order: 3,
            },
            {
                title: "500 KLD MBBR Sewage Treatment Plant",
                category: "STP Plants",
                capacityKLD: "500 KLD",
                location: "Greater Noida, UP",
                clientSector: "Residential High-Rise Society",
                imageUrl: "/images/plant-stp.jpg",
                status: "COMPLETED",
                progressPercentage: 100,
                currentStage: "Commissioned & Handed Over (Operational)",
                expectedCompletion: "Commissioned 2024",
                keyHighlights: ["CPCB Norms Certified", "BOD < 10 mg/L", "Automated Bio-Carrier Fluidization"],
                completionYear: 2024,
                isFeatured: true,
                order: 4,
            },
            {
                title: "250 KLD Industrial Effluent Treatment & Sludge Dewatering Plant",
                category: "ETP Plants",
                capacityKLD: "250 KLD",
                location: "Bhiwadi, Rajasthan",
                clientSector: "Textile Dyeing & Processing",
                imageUrl: "/images/plant-etp.jpg",
                status: "COMPLETED",
                progressPercentage: 100,
                currentStage: "Commissioned & Handed Over (Operational)",
                expectedCompletion: "Commissioned 2023",
                keyHighlights: ["Recessed Chamber Filter Press", "Color & Heavy Metal Removal 99%"],
                completionYear: 2023,
                isFeatured: true,
                order: 5,
            },
            {
                title: "50 m³/hr Two-Bed Demineralization (DM) Plant with Mixed Bed",
                category: "DM Plants",
                capacityKLD: "1,200 KLD",
                location: "Panipat, Haryana",
                clientSector: "Thermal Power & Boiler Feed",
                imageUrl: "/images/plant-ro.jpg",
                status: "COMPLETED",
                progressPercentage: 100,
                currentStage: "Commissioned & Handed Over (Operational)",
                expectedCompletion: "Commissioned 2023",
                keyHighlights: ["Silica < 0.02 ppm", "Conductivity < 0.2 µS/cm", "Degasser Tower Integration"],
                completionYear: 2023,
                isFeatured: true,
                order: 6,
            },
            {
                title: "5 MLD Municipal River Intake Water Treatment Plant (WTP)",
                category: "WTP Plants",
                capacityKLD: "5,000 KLD",
                location: "Gopalganj, Bihar",
                clientSector: "Municipal Potable Water Supply",
                imageUrl: "/images/plant-etp.jpg",
                status: "COMPLETED",
                progressPercentage: 100,
                currentStage: "Commissioned & Handed Over (Operational)",
                expectedCompletion: "Commissioned 2022",
                keyHighlights: ["Rapid Gravity Sand Filters", "Pulsator Clarifier", "IS 10500 Drinking Water Norms"],
                completionYear: 2022,
                isFeatured: true,
                order: 7,
            },
        ];
        await ProjectGallery_1.ProjectGallery.insertMany(galleryItems);
        console.log(`✔ Successfully seeded ${galleryItems.length} project gallery installations.`);
        // 5. Seed Client Testimonials
        await ClientTestimonial_1.ClientTestimonial.deleteMany({});
        const testimonials = [
            {
                clientName: "Rajesh Singhania",
                designation: "Vice President - Operations",
                company: "Vardhman Textiles Ltd",
                feedback: "R P Global Projects delivered our 250 KLD ETP plant ahead of schedule. The treated effluent comfortably meets all state pollution board parameters, and their automated dosing systems reduced our chemical overhead by 18%.",
                rating: 5,
                plantInstalled: "250 KLD Textile ETP with Filter Press",
                isApproved: true,
                order: 1,
            },
            {
                clientName: "Col. Sanjeev Verma (Retd.)",
                designation: "Estate General Manager",
                company: "Ajnara Grand Heritage Residents Welfare Association",
                feedback: "Our 500 KLD MBBR STP installed by RP Global has been operating flawlessly for over two years with zero odor complaints. We recycle 100% of the treated water for our 14-acre horticulture and toilet flushing.",
                rating: 5,
                plantInstalled: "500 KLD MBBR Sewage Treatment Plant",
                isApproved: true,
                order: 2,
            },
            {
                clientName: "Dr. Arvind Mehta",
                designation: "Director - Quality & Engineering",
                company: "Apex Formulations & Labs",
                feedback: "For high-purity pharmaceutical boiler feed water, RP Global's DM and Mixed Bed plant gave us water conductivity below 0.1 µS/cm consistently. Their after-sales technical AMC response is exemplary.",
                rating: 5,
                plantInstalled: "50 m³/hr DM Plant with Mixed Bed Polisher",
                isApproved: true,
                order: 3,
            },
        ];
        await ClientTestimonial_1.ClientTestimonial.insertMany(testimonials);
        console.log(`✔ Successfully seeded ${testimonials.length} client testimonials.`);
        // 6. Clear and Seed FAQs
        await FAQ_1.FAQ.deleteMany({});
        await FAQ_1.FAQ.insertMany(initialFaqs_1.INITIAL_FAQS.map(({ _id, ...rest }) => rest));
        console.log(`✔ Successfully seeded ${initialFaqs_1.INITIAL_FAQS.length} industrial FAQs.`);
        console.log("\n=======================================================");
        console.log("  ALL RP GLOBAL INDUSTRIAL DATA SEEDED SUCCESSFULLY!    ");
        console.log("=======================================================\n");
        process.exit(0);
    }
    catch (error) {
        console.error("[Seed Error]", error);
        process.exit(1);
    }
};
seedData();
//# sourceMappingURL=seed.js.map