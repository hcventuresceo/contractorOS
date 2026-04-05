import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/status-badge";
import { notFound } from "next/navigation";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ContractorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contractor = await prisma.contractor.findUnique({
    where: { id },
    include: {
      projects: {
        include: {
          project: true,
        },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          project: { select: { name: true } },
        },
      },
      estimates: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      compliance: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!contractor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/contractors"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Contractors
      </Link>

      {/* Contractor Info Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{contractor.name}</h1>
            {contractor.company && (
              <p className="mt-1 text-sm text-gray-500">{contractor.company}</p>
            )}
          </div>
          <StatusBadge status={contractor.status} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Email</p>
            <p className="mt-1 text-sm text-gray-900">{contractor.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Phone</p>
            <p className="mt-1 text-sm text-gray-900">{contractor.phone}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Trade</p>
            <p className="mt-1 text-sm text-gray-900">{contractor.trade}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">License Number</p>
            <p className="mt-1 text-sm text-gray-900">{contractor.licenseNumber || "\u2014"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Insurance Expiry</p>
            <p className="mt-1 text-sm text-gray-900">{formatDate(contractor.insuranceExpiry)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Rating</p>
            <div className="mt-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < contractor.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Hourly Rate</p>
            <p className="mt-1 text-sm text-gray-900">
              {contractor.hourlyRate ? formatCurrency(contractor.hourlyRate) : "\u2014"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase text-gray-500">Notes</p>
            <p className="mt-1 text-sm text-gray-900">{contractor.notes || "\u2014"}</p>
          </div>
        </div>
      </div>

      {/* Assigned Projects */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Assigned Projects</h2>
        </div>
        {contractor.projects.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-400">No projects assigned</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {contractor.projects.map((pc) => (
              <div key={pc.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <Link
                    href={`/projects/${pc.project.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {pc.project.name}
                  </Link>
                  <p className="text-xs text-gray-500">{pc.project.propertyAddress}</p>
                </div>
                <div className="flex items-center gap-3">
                  {pc.role && (
                    <span className="text-xs text-gray-500">{pc.role}</span>
                  )}
                  <StatusBadge status={pc.project.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Invoices */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        </div>
        {contractor.invoices.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-400">No invoices yet</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contractor.invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {invoice.project.name}
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
        )}
      </div>

      {/* Compliance Documents */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Compliance Documents</h2>
        </div>
        {contractor.compliance.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-400">No compliance documents</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Expiration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contractor.compliance.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {doc.documentName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {doc.type}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(doc.expirationDate)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
