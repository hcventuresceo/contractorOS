import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");

  const where = status ? { status } : {};

  const estimates = await prisma.estimate.findMany({
    where,
    include: {
      contractor: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
      lineItems: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(estimates);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const lineItems = body.lineItems || [];
  const totalAmount = lineItems.reduce(
    (sum: number, item: { quantity: number; unitPrice: number }) =>
      sum + item.quantity * item.unitPrice,
    0
  );

  const estimate = await prisma.estimate.create({
    data: {
      contractorId: body.contractorId,
      projectId: body.projectId,
      description: body.description || null,
      totalAmount,
      validUntil: body.validUntil ? new Date(body.validUntil) : null,
      status: "pending",
      lineItems: {
        create: lineItems.map(
          (item: { description: string; quantity: number; unitPrice: number }) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })
        ),
      },
    },
    include: { lineItems: true },
  });

  return Response.json(estimate, { status: 201 });
}
