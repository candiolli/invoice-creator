import type { InvoiceRecord } from "./amplifyClient";
import { formatMoney } from "./invoice";

type Props = {
  items: InvoiceRecord[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function InvoiceList({ items, currentId, onSelect, onNew, onDuplicate, onDelete }: Props) {
  return (
    <section className="list">
      <div className="list__head">
        <span>My invoices</span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onNew}>
          + New
        </button>
      </div>
      {items.length === 0 ? (
        <p className="list__empty">No invoices yet. Click <strong>+ New</strong> to start.</p>
      ) : (
        <ul className="list__items">
          {items.map((item) => {
            const active = item.id === currentId;
            const total =
              item.amount != null
                ? formatMoney(item.amount, item.currency ?? "USD")
                : "—";
            const title = item.monthOfService || item.invoiceNumber || "Untitled";
            const client = item.billToName ?? "";
            return (
              <li key={item.id} className={`list__row ${active ? "list__row--active" : ""}`}>
                <button
                  type="button"
                  className="list__item"
                  onClick={() => onSelect(item.id)}
                >
                  <span className="list__item-title">{title}</span>
                  {client && <span className="list__item-client">{client}</span>}
                  <span className="list__item-total">{total}</span>
                </button>
                <div className="list__row-actions">
                  <button
                    type="button"
                    className="list__action"
                    title="Duplicate"
                    onClick={() => onDuplicate(item.id)}
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="list__action list__action--danger"
                    title="Delete"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
