import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatCard from "@/components/stat-card";
import StatusBadge from "@/components/status-badge";
import { HardHat, FolderKanban, FileText, DollarSign } from "lucide-react";

const statusColors: Record<string, string> = {
  planning: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  on_hold: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function DashboardPage() {
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

  const pendingCount = pendingInvoices._count;
  const pendingAmount = pendingInvoices._sum.amount ?? 0;
  const totalRevenue = paidInvoices._sum.amount ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your contractor operations
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contractors"
          value={totalContractors.toString()}
          icon={HardHat}
          subtitle="All registered contractors"
        />
        <StatCard
          title="Active Projects"
          value={activeProjects.toString()}
          icon={FolderKanban}
          subtitle="Currently in progress"
        />
        <StatCard
          title="Pending Invoices"
          value={pendingCount.toString()}
          icon={FileText}
          subtitle={formatCurrency(pendingAmount) + " outstanding"}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          subtitle="From paid invoices"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Invoices */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Invoices
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Invoice #</th>
                  <th className="px-6 py-3">Contractor</th>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentInvoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No invoices yet
                    </td>
                  </tr>
                ) : (
                  recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {invoice.contractor.name}
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {invoice.project.name}
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {formatDate(invoice.dueDate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects by Status */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Projects by Status
            </h2>
          </div>
          <div className="space-y-3 p-6">
            {projectStatusBreakdown.length === 0 ? (
              <p className="text-sm text-gray-400">No projects yet</p>
            ) : (
              projectStatusBreakdown.map((item) => {
                const style =
                  statusColors[item.status] || "bg-gray-100 text-gray-600";
                const label = item.status.replace(/_/g, " ");
                return (
                  <div
                    key={item.status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
                      >
                        {label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {item._count}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
