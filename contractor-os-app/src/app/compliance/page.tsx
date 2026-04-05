import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import PageHeader from "@/components/page-header";
import StatusBadge from "@/components/status-badge";
import EmptyState from "@/components/empty-state";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function CompliancePage() {
  const documents = await prisma.complianceDocument.findMany({
    include: {
      contractor: { select: { id: true, name: true, company: true } },
    },
    orderBy: { expirationDate: "asc" },
  });

  const stats = {
    valid: documents.filter((d) => d.status === "valid").length,
    expiring: documents.filter((d) => d.status === "expiring_soon").length,
    expired: documents.filter((d) => d.status === "expired").length,
    missing: documents.filter((d) => d.status === "missing").length,
  };

  const typeLabels: Record<string, string> = {
    insurance: "Insurance Certificate",
    license: "Contractor License",
    w9: "W-9 Form",
    bond: "Surety Bond",
    certification: "Certification",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance"
        description="Track contractor compliance documents and certifications"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Valid</p>
          <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Expiring Soon</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.expiring}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Expired</p>
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Missing</p>
          <p className="text-2xl font-bold text-gray-600">{stats.missing}</p>
        </div>
      </div>

      {(stats.expiring > 0 || stats.expired > 0) && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm font-medium text-yellow-800">
              {stats.expiring + stats.expired} document(s) need attention — {stats.expiring} expiring soon, {stats.expired} expired.
            </p>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No compliance documents"
          description="Compliance documents will appear here once contractors are added with their documentation."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contractor</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Document Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Document Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Expiration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    <Link href={`/contractors/${doc.contractorId}`} className="hover:text-blue-600">
                      {doc.contractor.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {typeLabels[doc.type] || doc.type}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {doc.documentName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(doc.expirationDate)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {doc.notes || "—"}
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
