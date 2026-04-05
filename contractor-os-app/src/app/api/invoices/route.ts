import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");

  const where = status ? { status } : {};

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      contractor: { select: { id: true, name: true, company: true } },
      project: { select: { id: true, name: true, propertyAddress: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(invoices);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const count = await prisma.invoice.count();
  const invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      contractorId: body.contractorId,
      projectId: body.projectId,
      amount: parseFloat(body.amount),
      description: body.description || null,
      dueDate: new Date(body.dueDate),
      status: body.status || "draft",
    },
  });

  return Response.json(invoice, { status: 201 });
}
