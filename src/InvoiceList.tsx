import type { InvoiceRecord } from "./amplifyClient";
import { formatMoney } from "./invoice";

type Props = {
  items: InvoiceRecord[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
};

export function InvoiceList({ items, currentId, onSelect, onNew }: Props) {
  return (
    <section className="list">
      <div className="list__head">
        <span>My invoices</span>
        <button type="button" className="app__btn app__btn--ghost list__new" onClick={onNew}>
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
              <li key={item.id}>
                <button
                  type="button"
                  className={`list__item ${active ? "list__item--active" : ""}`}
                  onClick={() => onSelect(item.id)}
                >
                  <span className="list__item-title">{title}</span>
                  {client && <span className="list__item-client">{client}</span>}
                  <span className="list__item-total">{total}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
