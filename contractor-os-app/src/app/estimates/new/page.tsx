"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import { Plus, Trash2 } from "lucide-react";

interface SelectOption {
  id: string;
  name: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewEstimatePage() {
  const router = useRouter();
  const [contractors, setContractors] = useState<SelectOption[]>([]);
  const [projects, setProjects] = useState<SelectOption[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/contractors")
      .then((r) => r.json())
      .then((data) => setContractors(data.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))));
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(data.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }))));
  }, []);

  function addLineItem() {
    setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeLineItem(index: number) {
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  function updateLineItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  }

  const total = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    const body = {
      contractorId: form.get("contractorId"),
      projectId: form.get("projectId"),
      description: form.get("description"),
      validUntil: form.get("validUntil") || null,
      lineItems: lineItems.filter((item) => item.description.trim()),
    };

    const res = await fetch("/api/estimates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/estimates");
    } else {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="New Estimate" description="Create a new contractor estimate with line items" />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Estimate Details</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="contractorId" className="block text-sm font-medium text-gray-700">Contractor</label>
              <select name="contractorId" id="contractorId" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select contractor...</option>
                {contractors.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">Project</label>
              <select name="projectId" id="projectId" required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700">Valid Until</label>
              <input type="date" name="validUntil" id="validUntil" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <input type="text" name="description" id="description" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Line Items</h3>
            <button
              type="button"
              onClick={addLineItem}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>}
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, "description", e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Item description"
                    required
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>}
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, "quantity", parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Unit Price</label>}
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Total</label>}
                  <p className="py-2 text-sm font-medium text-gray-900">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </p>
                </div>
                <div className="col-span-1">
                  {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">&nbsp;</label>}
                  {lineItems.length > 1 && (
                    <button type="button" onClick={() => removeLineItem(index)} className="p-2 text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end border-t border-gray-200 pt-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
            {submitting ? "Creating..." : "Create Estimate"}
          </button>
          <button type="button" onClick={() => router.push("/estimates")} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
