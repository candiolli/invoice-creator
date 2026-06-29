import { useCallback, useEffect, useRef, useState } from "react";
import { client, type InvoiceRecord } from "./amplifyClient";
import { defaultInvoice, type Invoice } from "./invoice";

type CreateInput = Partial<Omit<InvoiceRecord, "id" | "owner" | "createdAt" | "updatedAt">>;

function toInvoice(record: InvoiceRecord): Invoice {
  return {
    invoiceNumber: record.invoiceNumber ?? "",
    creationDate: record.creationDate ?? "",
    dueDate: record.dueDate ?? "",
    monthOfService: record.monthOfService ?? "",
    amount: record.amount ?? 0,
    currency: record.currency ?? "USD",

    billFromName: record.billFromName ?? "",
    billFromCnpj: record.billFromCnpj ?? "",
    billFromAddress: record.billFromAddress ?? "",

    billToName: record.billToName ?? "",
    billToAddress: record.billToAddress ?? "",

    serviceTitle: record.serviceTitle ?? "",
    serviceDescription: record.serviceDescription ?? "",

    beneficiaryName: record.beneficiaryName ?? "",
    beneficiaryIban: record.beneficiaryIban ?? "",
    bankSwift: record.bankSwift ?? "",
    bankName: record.bankName ?? "",
    bankAddress: record.bankAddress ?? "",

    intermediarySwift: record.intermediarySwift ?? "",
    intermediaryBankName: record.intermediaryBankName ?? "",
    intermediaryBankAddress: record.intermediaryBankAddress ?? "",
    intermediaryAccountNumber: record.intermediaryAccountNumber ?? "",

    contactEmail: record.contactEmail ?? "",
  };
}

function toCreateInput(invoice: Invoice): CreateInput {
  return { ...invoice };
}

function byUpdatedDesc(a: InvoiceRecord, b: InvoiceRecord): number {
  const aT = a.updatedAt ?? "";
  const bT = b.updatedAt ?? "";
  return bT.localeCompare(aT);
}

export function useInvoices() {
  const [items, setItems] = useState<InvoiceRecord[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [current, setCurrent] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await client.models.Invoice.list();
    const sorted = [...data].sort(byUpdatedDesc);
    setItems(sorted);
    if (sorted.length > 0) {
      setCurrentId(sorted[0].id);
      setCurrent(toInvoice(sorted[0]));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const select = useCallback((id: string) => {
    const found = items.find((i) => i.id === id);
    if (!found) return;
    setCurrentId(id);
    setCurrent(toInvoice(found));
  }, [items]);

  const createNew = useCallback(async () => {
    const result = await client.models.Invoice.create(toCreateInput(defaultInvoice));
    if (result.data) {
      setItems((prev) => [result.data!, ...prev]);
      setCurrentId(result.data.id);
      setCurrent({ ...defaultInvoice });
    }
  }, []);

  const duplicate = useCallback(async () => {
    if (!current) return;
    const result = await client.models.Invoice.create(toCreateInput(current));
    if (result.data) {
      setItems((prev) => [result.data!, ...prev]);
      setCurrentId(result.data.id);
      setCurrent({ ...current });
    }
  }, [current]);

  const remove = useCallback(async () => {
    if (!currentId) return;
    if (!window.confirm("Delete this invoice?")) return;
    await client.models.Invoice.delete({ id: currentId });
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== currentId);
      if (next.length > 0) {
        setCurrentId(next[0].id);
        setCurrent(toInvoice(next[0]));
      } else {
        setCurrentId(null);
        setCurrent(null);
      }
      return next;
    });
  }, [currentId]);

  const patch = useCallback((p: Partial<Invoice>) => {
    if (!current || !currentId) return;
    const next = { ...current, ...p };
    setCurrent(next);

    if (saveTimer.current) clearTimeout(saveTimer.current);
    const id = currentId;
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      const updated = await client.models.Invoice.update({ id, ...toCreateInput(next) });
      setItems((prev) =>
        prev
          .map((i) => (i.id === id ? updated.data ?? i : i))
          .sort(byUpdatedDesc)
      );
      setSaving(false);
    }, 800);
  }, [current, currentId]);

  const resetCurrentToDefaults = useCallback(() => {
    if (!currentId) return;
    patch(defaultInvoice);
  }, [currentId, patch]);

  return {
    items,
    currentId,
    current,
    loading,
    saving,
    select,
    createNew,
    duplicate,
    remove,
    patch,
    resetCurrentToDefaults,
  };
}
