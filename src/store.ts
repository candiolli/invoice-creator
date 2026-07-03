import { getClient, type InvoiceRecord } from "./amplifyClient";

export type CreateInput = Partial<
  Omit<InvoiceRecord, "id" | "owner" | "createdAt" | "updatedAt">
>;

export type Store = {
  list: () => Promise<InvoiceRecord[]>;
  create: (input: CreateInput) => Promise<InvoiceRecord | null>;
  update: (id: string, input: CreateInput) => Promise<InvoiceRecord | null>;
  remove: (id: string) => Promise<void>;
};

/* -------------------------------------------------------------------------- */
/* Cloud store — DynamoDB via Amplify Data (requires an authenticated owner).  */
/* -------------------------------------------------------------------------- */
export const cloudStore: Store = {
  async list() {
    const { data } = await getClient().models.Invoice.list();
    return data;
  },
  async create(input) {
    const { data } = await getClient().models.Invoice.create(input);
    return data ?? null;
  },
  async update(id, input) {
    const { data } = await getClient().models.Invoice.update({ id, ...input });
    return data ?? null;
  },
  async remove(id) {
    await getClient().models.Invoice.delete({ id });
  },
};

/* -------------------------------------------------------------------------- */
/* Local store — browser localStorage, used before the user signs in.          */
/* -------------------------------------------------------------------------- */
const GUEST_KEY = "invoice-creator:guest";

function readGuest(): InvoiceRecord[] {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InvoiceRecord[]) : [];
  } catch {
    return [];
  }
}

function writeGuest(items: InvoiceRecord[]) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch {
    /* storage disabled or full — guest data just isn't persisted */
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

function stamp(): string {
  return new Date().toISOString();
}

export const localStore: Store = {
  async list() {
    return readGuest();
  },
  async create(input) {
    const now = stamp();
    const record = {
      id: newId(),
      createdAt: now,
      updatedAt: now,
      ...input,
    } as InvoiceRecord;
    writeGuest([record, ...readGuest()]);
    return record;
  },
  async update(id, input) {
    const items = readGuest();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...input, updatedAt: stamp() } as InvoiceRecord;
    items[idx] = updated;
    writeGuest(items);
    return updated;
  },
  async remove(id) {
    writeGuest(readGuest().filter((i) => i.id !== id));
  },
};

/** Number of invoices currently held only in the browser. */
export function guestCount(): number {
  return readGuest().length;
}

/** Read and clear all guest invoices — used to migrate them to the cloud. */
export function takeGuestInvoices(): InvoiceRecord[] {
  const items = readGuest();
  writeGuest([]);
  return items;
}

/** Strip server-managed metadata so a record can be re-created in the cloud. */
export function toCreatableInput(record: InvoiceRecord): CreateInput {
  const { id, owner, createdAt, updatedAt, ...rest } =
    record as InvoiceRecord & { owner?: unknown };
  void id;
  void owner;
  void createdAt;
  void updatedAt;
  return rest as CreateInput;
}
