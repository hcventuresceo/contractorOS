import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { company: { contains: search } },
          { trade: { contains: search } },
        ],
      }
    : {};

  const contractors = await prisma.contractor.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(contractors);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const contractor = await prisma.contractor.create({
    data: {
      name: body.name,
      company: body.company || null,
      email: body.email,
      phone: body.phone,
      trade: body.trade,
      licenseNumber: body.licenseNumber || null,
      hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : null,
      notes: body.notes || null,
    },
  });

  return Response.json(contractor, { status: 201 });
}
