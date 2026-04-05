import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: {
      _count: { select: { contractors: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const project = await prisma.project.create({
    data: {
      name: body.name,
      propertyAddress: body.propertyAddress,
      description: body.description || null,
      status: body.status || "planning",
      budget: parseFloat(body.budget),
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });

  return Response.json(project, { status: 201 });
}
