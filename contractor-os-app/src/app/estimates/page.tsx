import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import PageHeader from "@/components/page-header";
import StatusBadge from "@/components/status-badge";
import EmptyState from "@/components/empty-state";
import { Calculator } from "lucide-react";
import Link from "next/link";

export default async function EstimatesPage() {
  const estimates = await prisma.estimate.findMany({
    include: {
      contractor: { select: { name: true } },
      project: { select: { name: true } },
      _count: { select: { lineItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totals = {
    pending: estimates.filter((e) => e.status === "pending").reduce((s, e) => s + e.totalAmount, 0),
    approved: estimates.filter((e) => e.status === "approved").reduce((s, e) => s + e.totalAmount, 0),
    rejected: estimates.filter((e) => e.status === "rejected").reduce((s, e) => s + e.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Estimates"
        description="Manage contractor proposals and estimates"
        actionLabel="New Estimate"
        actionHref="/estimates/new"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Pending Review</p>
          <p className="text-xl font-bold text-yellow-600">{formatCurrency(totals.pending)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totals.approved)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totals.rejected)}</p>
        </div>
      </div>

      {estimates.length === 0 ? (
        <EmptyState
          icon={Calculator}
          title="No estimates yet"
          description="Create your first estimate to start tracking proposals."
          actionLabel="New Estimate"
          actionHref="/estimates/new"
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contractor</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Line Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {estimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    <Link href={`/contractors/${estimate.contractorId}`} className="hover:text-blue-600">
                      {estimate.contractor.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    <Link href={`/projects/${estimate.projectId}`} className="hover:text-blue-600">
                      {estimate.project.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {estimate._count.lineItems} items
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(estimate.totalAmount)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={estimate.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(estimate.validUntil)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(estimate.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
