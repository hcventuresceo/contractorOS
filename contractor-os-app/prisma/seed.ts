import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const adapter = new PrismaBetterSqlite3({
  url: `file:${path.join(process.cwd(), "prisma", "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.estimateLineItem.deleteMany();
  await prisma.estimate.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.complianceDocument.deleteMany();
  await prisma.projectContractor.deleteMany();
  await prisma.project.deleteMany();
  await prisma.contractor.deleteMany();

  // Create contractors
  const contractors = await Promise.all([
    prisma.contractor.create({
      data: {
        name: "Mike Rodriguez",
        company: "Rodriguez Electric LLC",
        email: "mike@rodriguezelectric.com",
        phone: "(555) 123-4567",
        trade: "Electrician",
        licenseNumber: "EL-2024-0891",
        insuranceExpiry: new Date("2027-03-15"),
        rating: 5,
        hourlyRate: 95,
        status: "active",
        notes: "Excellent work, always on time. Preferred for large projects.",
      },
    }),
    prisma.contractor.create({
      data: {
        name: "Sarah Chen",
        company: "Chen Plumbing Services",
        email: "sarah@chenplumbing.com",
        phone: "(555) 234-5678",
        trade: "Plumber",
        licenseNumber: "PL-2024-1432",
        insuranceExpiry: new Date("2026-11-30"),
        rating: 4,
        hourlyRate: 85,
        status: "active",
        notes: "Reliable for residential and light commercial work.",
      },
    }),
    prisma.contractor.create({
      data: {
        name: "James Williams",
        company: "Comfort Zone HVAC",
        email: "james@comfortzonehvac.com",
        phone: "(555) 345-6789",
        trade: "HVAC",
        licenseNumber: "HV-2023-0567",
        insuranceExpiry: new Date("2026-08-20"),
        rating: 4,
        hourlyRate: 110,
        status: "active",
      },
    }),
    prisma.contractor.create({
      data: {
        name: "David Thompson",
        company: "Thompson General Contracting",
        email: "david@thompsongc.com",
        phone: "(555) 456-7890",
        trade: "General Contractor",
        licenseNumber: "GC-2024-2201",
        insuranceExpiry: new Date("2027-01-10"),
        rating: 5,
        hourlyRate: 75,
        status: "active",
        notes: "Great project manager. Handles full renovations.",
      },
    }),
    prisma.contractor.create({
      data: {
        name: "Lisa Martinez",
        company: "Martinez Roofing Co",
        email: "lisa@martinezroofing.com",
        phone: "(555) 567-8901",
        trade: "Roofing",
        licenseNumber: "RF-2024-0334",
        insuranceExpiry: new Date("2026-06-15"),
        rating: 3,
        hourlyRate: 70,
        status: "active",
      },
    }),
    prisma.contractor.create({
      data: {
        name: "Robert Kim",
        company: "Kim's Premium Painting",
        email: "robert@kimpremiumpainting.com",
        phone: "(555) 678-9012",
        trade: "Painting",
        licenseNumber: "PT-2024-0112",
        insuranceExpiry: new Date("2026-09-25"),
        rating: 4,
        hourlyRate: 55,
        status: "active",
      },
    }),
    prisma.contractor.create({
      data: {
        name: "Angela Foster",
        company: "Foster Flooring Solutions",
        email: "angela@fosterflooring.com",
        phone: "(555) 789-0123",
        trade: "Flooring",
        licenseNumber: "FL-2023-0889",
        insuranceExpiry: new Date("2026-04-01"),
        rating: 4,
        hourlyRate: 65,
        status: "active",
      },
    }),
    prisma.contractor.create({
      data: {
        name: "Carlos Gutierrez",
        company: "Green Scapes Landscaping",
        email: "carlos@greenscapes.com",
        phone: "(555) 890-1234",
        trade: "Landscaping",
        insuranceExpiry: new Date("2026-12-20"),
        rating: 3,
        hourlyRate: 50,
        status: "active",
      },
    }),
    prisma.contractor.create({
      data: {
        name: "Patricia Nguyen",
        company: "Nguyen Electric & Data",
        email: "patricia@nguyenelectric.com",
        phone: "(555) 901-2345",
        trade: "Electrician",
        licenseNumber: "EL-2023-1567",
        insuranceExpiry: new Date("2026-02-28"),
        rating: 2,
        hourlyRate: 80,
        status: "suspended",
        notes: "Suspended due to missed deadlines on Oak Street project.",
      },
    }),
    prisma.contractor.create({
      data: {
        name: "Tom Bradley",
        company: "Bradley Plumbing & Drain",
        email: "tom@bradleyplumbing.com",
        phone: "(555) 012-3456",
        trade: "Plumber",
        licenseNumber: "PL-2024-0998",
        insuranceExpiry: new Date("2027-05-15"),
        rating: 5,
        hourlyRate: 90,
        status: "active",
        notes: "Specialist in commercial plumbing. Emergency availability.",
      },
    }),
  ]);

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: "Oak Street Duplex Renovation",
        propertyAddress: "142 Oak Street, Austin, TX 78701",
        description: "Full interior renovation of a 1960s duplex. Both units getting new kitchens, bathrooms, flooring, and electrical upgrades.",
        status: "in_progress",
        budget: 185000,
        spent: 97500,
        startDate: new Date("2026-01-15"),
        endDate: new Date("2026-06-30"),
      },
    }),
    prisma.project.create({
      data: {
        name: "Maple Avenue Flip",
        propertyAddress: "2847 Maple Avenue, Austin, TX 78704",
        description: "Quick cosmetic flip — new paint, flooring, landscaping, and kitchen refresh.",
        status: "in_progress",
        budget: 65000,
        spent: 42000,
        startDate: new Date("2026-02-01"),
        endDate: new Date("2026-04-15"),
      },
    }),
    prisma.project.create({
      data: {
        name: "River Road 4-Plex",
        propertyAddress: "901 River Road, Austin, TX 78702",
        description: "Major renovation of a 4-unit property. New HVAC systems, roof replacement, and unit upgrades.",
        status: "planning",
        budget: 420000,
        spent: 0,
        startDate: new Date("2026-05-01"),
        endDate: new Date("2026-12-31"),
      },
    }),
    prisma.project.create({
      data: {
        name: "Cedar Park SFH",
        propertyAddress: "5632 Cedar Park Drive, Cedar Park, TX 78613",
        description: "Single family home renovation — roof, exterior paint, landscaping, and interior updates.",
        status: "completed",
        budget: 95000,
        spent: 88200,
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-12-20"),
      },
    }),
    prisma.project.create({
      data: {
        name: "Downtown Condo Unit 12B",
        propertyAddress: "300 Congress Ave, Unit 12B, Austin, TX 78701",
        description: "High-end condo renovation — luxury finishes, smart home integration.",
        status: "on_hold",
        budget: 150000,
        spent: 23000,
        startDate: new Date("2026-03-01"),
      },
    }),
    prisma.project.create({
      data: {
        name: "Southside Triplex",
        propertyAddress: "1818 South Lamar Blvd, Austin, TX 78704",
        description: "Acquisition rehab — bringing 3 units up to code with modern finishes.",
        status: "planning",
        budget: 275000,
        spent: 0,
        startDate: new Date("2026-07-01"),
        endDate: new Date("2027-02-28"),
      },
    }),
  ]);

  // Assign contractors to projects
  await Promise.all([
    prisma.projectContractor.create({ data: { projectId: projects[0].id, contractorId: contractors[0].id, role: "Lead Electrician" } }),
    prisma.projectContractor.create({ data: { projectId: projects[0].id, contractorId: contractors[1].id, role: "Plumber" } }),
    prisma.projectContractor.create({ data: { projectId: projects[0].id, contractorId: contractors[3].id, role: "General Contractor" } }),
    prisma.projectContractor.create({ data: { projectId: projects[0].id, contractorId: contractors[6].id, role: "Flooring" } }),
    prisma.projectContractor.create({ data: { projectId: projects[1].id, contractorId: contractors[5].id, role: "Painter" } }),
    prisma.projectContractor.create({ data: { projectId: projects[1].id, contractorId: contractors[6].id, role: "Flooring" } }),
    prisma.projectContractor.create({ data: { projectId: projects[1].id, contractorId: contractors[7].id, role: "Landscaping" } }),
    prisma.projectContractor.create({ data: { projectId: projects[3].id, contractorId: contractors[3].id, role: "General Contractor" } }),
    prisma.projectContractor.create({ data: { projectId: projects[3].id, contractorId: contractors[4].id, role: "Roofer" } }),
    prisma.projectContractor.create({ data: { projectId: projects[3].id, contractorId: contractors[5].id, role: "Painter" } }),
    prisma.projectContractor.create({ data: { projectId: projects[4].id, contractorId: contractors[0].id, role: "Electrician" } }),
    prisma.projectContractor.create({ data: { projectId: projects[4].id, contractorId: contractors[2].id, role: "HVAC" } }),
  ]);

  // Create invoices
  await Promise.all([
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0001",
        contractorId: contractors[3].id,
        projectId: projects[0].id,
        amount: 35000,
        status: "paid",
        dueDate: new Date("2026-02-15"),
        paidDate: new Date("2026-02-12"),
        description: "Phase 1 — demolition and framing, Unit A",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0002",
        contractorId: contractors[0].id,
        projectId: projects[0].id,
        amount: 18500,
        status: "paid",
        dueDate: new Date("2026-03-01"),
        paidDate: new Date("2026-02-28"),
        description: "Electrical rough-in, both units",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0003",
        contractorId: contractors[1].id,
        projectId: projects[0].id,
        amount: 12000,
        status: "paid",
        dueDate: new Date("2026-03-15"),
        paidDate: new Date("2026-03-14"),
        description: "Plumbing rough-in and fixture prep",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0004",
        contractorId: contractors[6].id,
        projectId: projects[0].id,
        amount: 15000,
        status: "sent",
        dueDate: new Date("2026-04-15"),
        description: "LVP flooring installation — Unit A",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0005",
        contractorId: contractors[3].id,
        projectId: projects[0].id,
        amount: 17000,
        status: "sent",
        dueDate: new Date("2026-04-30"),
        description: "Phase 2 — kitchen cabinets and countertops, Unit A",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0006",
        contractorId: contractors[5].id,
        projectId: projects[1].id,
        amount: 8500,
        status: "paid",
        dueDate: new Date("2026-02-28"),
        paidDate: new Date("2026-02-25"),
        description: "Full interior paint — walls and trim",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0007",
        contractorId: contractors[6].id,
        projectId: projects[1].id,
        amount: 12500,
        status: "paid",
        dueDate: new Date("2026-03-10"),
        paidDate: new Date("2026-03-08"),
        description: "Hardwood flooring throughout",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0008",
        contractorId: contractors[7].id,
        projectId: projects[1].id,
        amount: 6500,
        status: "sent",
        dueDate: new Date("2026-04-10"),
        description: "Front and back yard landscaping",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0009",
        contractorId: contractors[3].id,
        projectId: projects[3].id,
        amount: 45000,
        status: "paid",
        dueDate: new Date("2025-11-15"),
        paidDate: new Date("2025-11-12"),
        description: "Full renovation — GC services",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0010",
        contractorId: contractors[4].id,
        projectId: projects[3].id,
        amount: 22000,
        status: "paid",
        dueDate: new Date("2025-10-30"),
        paidDate: new Date("2025-10-28"),
        description: "Complete roof replacement — architectural shingles",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0011",
        contractorId: contractors[5].id,
        projectId: projects[3].id,
        amount: 9200,
        status: "paid",
        dueDate: new Date("2025-12-01"),
        paidDate: new Date("2025-11-29"),
        description: "Exterior and interior painting",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0012",
        contractorId: contractors[0].id,
        projectId: projects[4].id,
        amount: 15000,
        status: "draft",
        dueDate: new Date("2026-05-01"),
        description: "Smart home electrical prewire",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0013",
        contractorId: contractors[2].id,
        projectId: projects[4].id,
        amount: 8000,
        status: "draft",
        dueDate: new Date("2026-05-15"),
        description: "Mini-split HVAC system",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0014",
        contractorId: contractors[0].id,
        projectId: projects[0].id,
        amount: 12500,
        status: "overdue",
        dueDate: new Date("2026-03-25"),
        description: "Electrical finish — fixtures and panels, Unit B",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-0015",
        contractorId: contractors[9].id,
        projectId: projects[0].id,
        amount: 7800,
        status: "sent",
        dueDate: new Date("2026-04-20"),
        description: "Emergency drain repair and water heater install",
      },
    }),
  ]);

  // Create estimates
  const estimates = await Promise.all([
    prisma.estimate.create({
      data: {
        contractorId: contractors[2].id,
        projectId: projects[2].id,
        description: "HVAC system replacement — all 4 units",
        totalAmount: 68000,
        validUntil: new Date("2026-05-15"),
        status: "pending",
        lineItems: {
          create: [
            { description: "4x Carrier 3-ton AC units", quantity: 4, unitPrice: 8500, total: 34000 },
            { description: "4x Gas furnace units", quantity: 4, unitPrice: 4500, total: 18000 },
            { description: "Ductwork modification per unit", quantity: 4, unitPrice: 2500, total: 10000 },
            { description: "Thermostat install (Ecobee)", quantity: 4, unitPrice: 500, total: 2000 },
            { description: "Labor — installation", quantity: 1, unitPrice: 4000, total: 4000 },
          ],
        },
      },
    }),
    prisma.estimate.create({
      data: {
        contractorId: contractors[4].id,
        projectId: projects[2].id,
        description: "Complete roof replacement — 4-plex",
        totalAmount: 52000,
        validUntil: new Date("2026-05-30"),
        status: "pending",
        lineItems: {
          create: [
            { description: "Tear-off existing roof", quantity: 1, unitPrice: 8000, total: 8000 },
            { description: "Architectural shingles — 60 sq", quantity: 60, unitPrice: 450, total: 27000 },
            { description: "Underlayment and ice shield", quantity: 1, unitPrice: 5000, total: 5000 },
            { description: "Flashing and ridge vents", quantity: 1, unitPrice: 4000, total: 4000 },
            { description: "Labor", quantity: 1, unitPrice: 8000, total: 8000 },
          ],
        },
      },
    }),
    prisma.estimate.create({
      data: {
        contractorId: contractors[3].id,
        projectId: projects[2].id,
        description: "General contracting — unit renovations",
        totalAmount: 240000,
        validUntil: new Date("2026-06-01"),
        status: "approved",
        lineItems: {
          create: [
            { description: "Kitchen renovation per unit", quantity: 4, unitPrice: 25000, total: 100000 },
            { description: "Bathroom renovation per unit", quantity: 8, unitPrice: 8000, total: 64000 },
            { description: "Framing and drywall", quantity: 1, unitPrice: 36000, total: 36000 },
            { description: "Painting — interior", quantity: 4, unitPrice: 5000, total: 20000 },
            { description: "Project management", quantity: 1, unitPrice: 20000, total: 20000 },
          ],
        },
      },
    }),
    prisma.estimate.create({
      data: {
        contractorId: contractors[0].id,
        projectId: projects[2].id,
        description: "Electrical upgrade — all units",
        totalAmount: 44000,
        validUntil: new Date("2026-05-20"),
        status: "approved",
        lineItems: {
          create: [
            { description: "Panel upgrade to 200A per unit", quantity: 4, unitPrice: 4500, total: 18000 },
            { description: "Rewire per unit", quantity: 4, unitPrice: 5000, total: 20000 },
            { description: "Fixtures and outlets per unit", quantity: 4, unitPrice: 1500, total: 6000 },
          ],
        },
      },
    }),
    prisma.estimate.create({
      data: {
        contractorId: contractors[7].id,
        projectId: projects[5].id,
        description: "Landscaping — curb appeal package",
        totalAmount: 18500,
        validUntil: new Date("2026-07-15"),
        status: "pending",
        lineItems: {
          create: [
            { description: "Sod installation — 3000 sq ft", quantity: 3000, unitPrice: 2, total: 6000 },
            { description: "Shrub and plant installation", quantity: 1, unitPrice: 4500, total: 4500 },
            { description: "Mulch and edging", quantity: 1, unitPrice: 2000, total: 2000 },
            { description: "Irrigation system", quantity: 1, unitPrice: 3500, total: 3500 },
            { description: "Tree planting (3 trees)", quantity: 3, unitPrice: 833, total: 2500 },
          ],
        },
      },
    }),
    prisma.estimate.create({
      data: {
        contractorId: contractors[1].id,
        projectId: projects[5].id,
        description: "Plumbing — full replumb",
        totalAmount: 36000,
        validUntil: new Date("2026-07-20"),
        status: "pending",
        lineItems: {
          create: [
            { description: "PEX repipe per unit", quantity: 3, unitPrice: 6000, total: 18000 },
            { description: "Water heater replacement", quantity: 3, unitPrice: 3000, total: 9000 },
            { description: "Fixture installation per unit", quantity: 3, unitPrice: 2000, total: 6000 },
            { description: "Sewer line inspection and repair", quantity: 1, unitPrice: 3000, total: 3000 },
          ],
        },
      },
    }),
    prisma.estimate.create({
      data: {
        contractorId: contractors[5].id,
        projectId: projects[1].id,
        description: "Exterior paint — rejected, chose another vendor",
        totalAmount: 7500,
        validUntil: new Date("2026-02-15"),
        status: "rejected",
        lineItems: {
          create: [
            { description: "Pressure wash exterior", quantity: 1, unitPrice: 500, total: 500 },
            { description: "Prime and paint — Sherwin Williams", quantity: 1, unitPrice: 5500, total: 5500 },
            { description: "Trim and accent paint", quantity: 1, unitPrice: 1500, total: 1500 },
          ],
        },
      },
    }),
    prisma.estimate.create({
      data: {
        contractorId: contractors[0].id,
        projectId: projects[4].id,
        description: "Smart home electrical package",
        totalAmount: 28000,
        validUntil: new Date("2026-04-30"),
        status: "approved",
        lineItems: {
          create: [
            { description: "Lutron Caseta smart lighting system", quantity: 1, unitPrice: 8000, total: 8000 },
            { description: "Structured wiring — Cat6 and coax", quantity: 1, unitPrice: 6000, total: 6000 },
            { description: "Smart panel and monitoring", quantity: 1, unitPrice: 5000, total: 5000 },
            { description: "In-wall speaker prewire", quantity: 6, unitPrice: 500, total: 3000 },
            { description: "EV charger installation", quantity: 1, unitPrice: 3000, total: 3000 },
            { description: "Labor", quantity: 1, unitPrice: 3000, total: 3000 },
          ],
        },
      },
    }),
  ]);

  // Create compliance documents
  await Promise.all([
    prisma.complianceDocument.create({ data: { contractorId: contractors[0].id, type: "insurance", documentName: "General Liability — State Farm", expirationDate: new Date("2027-03-15"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[0].id, type: "license", documentName: "Master Electrician License — TX", expirationDate: new Date("2027-06-30"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[0].id, type: "w9", documentName: "W-9 — Rodriguez Electric LLC", status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[1].id, type: "insurance", documentName: "General Liability — Nationwide", expirationDate: new Date("2026-11-30"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[1].id, type: "license", documentName: "Master Plumber License — TX", expirationDate: new Date("2027-02-28"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[1].id, type: "w9", documentName: "W-9 — Chen Plumbing Services", status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[2].id, type: "insurance", documentName: "General Liability — Allstate", expirationDate: new Date("2026-08-20"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[2].id, type: "license", documentName: "HVAC Contractor License — TX", expirationDate: new Date("2026-05-15"), status: "expiring_soon" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[3].id, type: "insurance", documentName: "General Liability + Umbrella", expirationDate: new Date("2027-01-10"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[3].id, type: "license", documentName: "General Contractor License — TX", expirationDate: new Date("2027-04-30"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[3].id, type: "w9", documentName: "W-9 — Thompson General Contracting", status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[3].id, type: "bond", documentName: "Surety Bond — $500K", expirationDate: new Date("2027-01-10"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[4].id, type: "insurance", documentName: "General Liability — Progressive", expirationDate: new Date("2026-06-15"), status: "expiring_soon" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[4].id, type: "license", documentName: "Roofing Contractor License — TX", expirationDate: new Date("2026-12-31"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[5].id, type: "insurance", documentName: "General Liability — GEICO", expirationDate: new Date("2026-09-25"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[5].id, type: "w9", documentName: "W-9 — Kim's Premium Painting", status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[6].id, type: "insurance", documentName: "General Liability — Hartford", expirationDate: new Date("2026-04-01"), status: "expiring_soon", notes: "Renewal in process" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[6].id, type: "w9", documentName: "W-9 — Foster Flooring Solutions", status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[7].id, type: "insurance", documentName: "General Liability — Farmers", expirationDate: new Date("2026-12-20"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[8].id, type: "insurance", documentName: "General Liability — Expired", expirationDate: new Date("2026-02-28"), status: "expired", notes: "Coverage lapsed — contractor suspended" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[8].id, type: "license", documentName: "Electrician License — TX", expirationDate: new Date("2026-01-31"), status: "expired" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[8].id, type: "w9", documentName: "W-9 — Nguyen Electric & Data", status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[9].id, type: "insurance", documentName: "General Liability — Liberty Mutual", expirationDate: new Date("2027-05-15"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[9].id, type: "license", documentName: "Master Plumber License — TX", expirationDate: new Date("2027-08-31"), status: "valid" } }),
    prisma.complianceDocument.create({ data: { contractorId: contractors[9].id, type: "w9", documentName: "W-9 — Bradley Plumbing & Drain", status: "valid" } }),
  ]);

  console.log("Seed data created successfully!");
  console.log(`  ${contractors.length} contractors`);
  console.log(`  ${projects.length} projects`);
  console.log(`  15 invoices`);
  console.log(`  ${estimates.length} estimates`);
  console.log(`  25 compliance documents`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
