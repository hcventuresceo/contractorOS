import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");

  const where = status ? { status } : {};

  const documents = await prisma.complianceDocument.findMany({
    where,
    include: {
      contractor: { select: { id: true, name: true, company: true } },
    },
    orderBy: { expirationDate: "asc" },
  });

  return Response.json(documents);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const document = await prisma.complianceDocument.create({
    data: {
      contractorId: body.contractorId,
      type: body.type,
      documentName: body.documentName,
      expirationDate: body.expirationDate ? new Date(body.expirationDate) : null,
      status: body.status || "valid",
      notes: body.notes || null,
    },
  });

  return Response.json(document, { status: 201 });
}
