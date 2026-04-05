import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import PageHeader from "@/components/page-header";
import StatusBadge from "@/components/status-badge";
import EmptyState from "@/components/empty-state";
import { FileText } from "lucide-react";
import Link from "next/link";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: {
      contractor: { select: { name: true } },
      project: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === "draft").reduce((s, i) => s + i.amount, 0),
    pending: invoices.filter((i) => i.status === "sent").reduce((s, i) => s + i.amount, 0),
    paid: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Track and manage contractor invoices"
        actionLabel="New Invoice"
        actionHref="/invoices/new"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Draft</p>
          <p className="text-xl font-bold text-gray-600">{formatCurrency(stats.draft)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Sent</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.pending)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(stats.paid)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(stats.overdue)}</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create your first invoice to start tracking payments."
          actionLabel="New Invoice"
          actionHref="/invoices/new"
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contractor</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    <Link href={`/contractors/${invoice.contractorId}`} className="hover:text-blue-600">
                      {invoice.contractor.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    <Link href={`/projects/${invoice.projectId}`} className="hover:text-blue-600">
                      {invoice.project.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(invoice.dueDate)}
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
