"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";

interface SelectOption {
  id: string;
  name: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [contractors, setContractors] = useState<SelectOption[]>([]);
  const [projects, setProjects] = useState<SelectOption[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/contractors")
      .then((r) => r.json())
      .then((data) => setContractors(data.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))));
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(data.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }))));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const body = {
      contractorId: form.get("contractorId"),
      projectId: form.get("projectId"),
      amount: form.get("amount"),
      description: form.get("description"),
      dueDate: form.get("dueDate"),
    };

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/invoices");
    } else {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="New Invoice" description="Create a new contractor invoice" />

      <form onSubmit={handleSubmit} className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="contractorId" className="block text-sm font-medium text-gray-700">Contractor</label>
            <select name="contractorId" id="contractorId" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Select contractor...</option>
              {contractors.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">Project</label>
            <select name="projectId" id="projectId" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Select project...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
            <input type="number" name="amount" id="amount" step="0.01" min="0" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
            <input type="date" name="dueDate" id="dueDate" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" rows={3} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
            {submitting ? "Creating..." : "Create Invoice"}
          </button>
          <button type="button" onClick={() => router.push("/invoices")} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
