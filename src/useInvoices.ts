import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { InvoiceRecord } from "./amplifyClient";
import { defaultInvoice, type Invoice } from "./invoice";
import {
  cloudStore,
  localStore,
  takeGuestInvoices,
  toCreatableInput,
  type CreateInput,
  type Store,
} from "./store";

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

export function useInvoices(authenticated: boolean) {
  const store: Store = useMemo(
    () => (authenticated ? cloudStore : localStore),
    [authenticated]
  );

  const [items, setItems] = useState<InvoiceRecord[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [current, setCurrent] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [migratedCount, setMigratedCount] = useState(0);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);

    // On sign-in, lift any locally-held drafts into the user's account.
    if (authenticated) {
      const guests = takeGuestInvoices();
      let migrated = 0;
      for (const g of guests) {
        const created = await cloudStore.create(toCreatableInput(g));
        if (created) migrated++;
      }
      if (migrated > 0) setMigratedCount(migrated);
    }

    const data = await store.list();
    const sorted = [...data].sort(byUpdatedDesc);
    setItems(sorted);
    if (sorted.length > 0) {
      setCurrentId(sorted[0].id);
      setCurrent(toInvoice(sorted[0]));
    } else {
      setCurrentId(null);
      setCurrent(null);
    }
    setLoading(false);
  }, [authenticated, store]);

  useEffect(() => {
    void load();
  }, [load]);

  const select = useCallback(
    (id: string) => {
      const found = items.find((i) => i.id === id);
      if (!found) return;
      setCurrentId(id);
      setCurrent(toInvoice(found));
    },
    [items]
  );

  const createNew = useCallback(async () => {
    const created = await store.create(toCreateInput(defaultInvoice));
    if (created) {
      setItems((prev) => [created, ...prev]);
      setCurrentId(created.id);
      setCurrent(toInvoice(created));
    }
  }, [store]);

  const duplicate = useCallback(
    async (id?: string) => {
      const targetId = id ?? currentId;
      const source = items.find((i) => i.id === targetId);
      if (!source) return;
      const created = await store.create(toCreateInput(toInvoice(source)));
      if (created) {
        setItems((prev) => [created, ...prev]);
        setCurrentId(created.id);
        setCurrent(toInvoice(created));
      }
    },
    [items, currentId, store]
  );

  const remove = useCallback(
    async (id?: string) => {
      const targetId = id ?? currentId;
      if (!targetId) return;
      if (!window.confirm("Delete this invoice?")) return;
      await store.remove(targetId);
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== targetId);
        if (targetId === currentId) {
          if (next.length > 0) {
            setCurrentId(next[0].id);
            setCurrent(toInvoice(next[0]));
          } else {
            setCurrentId(null);
            setCurrent(null);
          }
        }
        return next;
      });
    },
    [currentId, store]
  );

  const patch = useCallback(
    (p: Partial<Invoice>) => {
      if (!current || !currentId) return;
      const next = { ...current, ...p };
      setCurrent(next);

      if (saveTimer.current) clearTimeout(saveTimer.current);
      const id = currentId;
      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        const updated = await store.update(id, toCreateInput(next));
        setItems((prev) =>
          prev.map((i) => (i.id === id ? updated ?? i : i)).sort(byUpdatedDesc)
        );
        setSaving(false);
      }, 800);
    },
    [current, currentId, store]
  );

  const resetCurrentToDefaults = useCallback(() => {
    if (!currentId) return;
    patch(defaultInvoice);
  }, [currentId, patch]);

  const acknowledgeMigration = useCallback(() => setMigratedCount(0), []);

  return {
    items,
    currentId,
    current,
    loading,
    saving,
    migratedCount,
    acknowledgeMigration,
    select,
    createNew,
    duplicate,
    remove,
    patch,
    resetCurrentToDefaults,
  };
}
