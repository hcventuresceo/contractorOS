import { prisma } from "@/lib/prisma";

export async function GET() {
  const [
    totalContractors,
    activeProjects,
    pendingInvoices,
    paidInvoices,
    recentInvoices,
    projectStatusBreakdown,
  ] = await Promise.all([
    prisma.contractor.count(),
    prisma.project.count({ where: { status: "in_progress" } }),
    prisma.invoice.aggregate({
      where: { status: "pending" },
      _count: true,
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
    }),
    prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        contractor: { select: { name: true } },
        project: { select: { name: true } },
      },
    }),
    prisma.project.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  return Response.json({
    totalContractors,
    activeProjects,
    pendingInvoices: {
      count: pendingInvoices._count,
      totalAmount: pendingInvoices._sum.amount ?? 0,
    },
    totalRevenue: paidInvoices._sum.amount ?? 0,
    recentInvoices,
    projectStatusBreakdown: projectStatusBreakdown.map((item) => ({
      status: item.status,
      count: item._count,
    })),
  });
}
