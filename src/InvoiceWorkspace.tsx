import { InvoiceForm } from "./InvoiceForm";
import { InvoiceList } from "./InvoiceList";
import { InvoicePreview } from "./InvoicePreview";
import { useInvoices } from "./useInvoices";
import type { Invoice } from "./invoice";

type Props = {
  /** Whether cloud sign-in is available (Amplify configured). */
  authEnabled: boolean;
  authenticated: boolean;
  email?: string;
  onSignIn?: () => void;
  onSignOut?: () => void;
};

function crumbLabel(current: Invoice | null): string {
  if (!current) return "No invoice";
  const num = current.invoiceNumber?.trim();
  if (num) return `#${num}`;
  const month = current.monthOfService?.trim();
  if (month) return month;
  return "New draft";
}

export function InvoiceWorkspace({
  authEnabled,
  authenticated,
  email,
  onSignIn,
  onSignOut,
}: Props) {
  const {
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
  } = useInvoices(authenticated);

  const handlePrint = () => {
    if (!current) return;
    const parts = [current.billFromName, current.monthOfService].filter(Boolean);
    const filename = parts.length > 0 ? parts.join(" ") : "Invoice";
    const originalTitle = document.title;
    document.title = filename;
    const restore = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar__brand">
          <div className="topbar__logo">I</div>
          <div className="topbar__title">Invoice Creator</div>
          <div className="topbar__divider" />
          <div className="topbar__crumb">
            Invoices / <strong>{crumbLabel(current)}</strong>
          </div>
        </div>

        <div className="topbar__actions">
          {current && (
            <span
              className={`topbar__status ${saving ? "topbar__status--saving" : ""}`}
            >
              <span className="topbar__dot" />
              {saving
                ? "Saving…"
                : authenticated
                  ? "Saved to account"
                  : "Saved locally"}
            </span>
          )}

          {current && (
            <button type="button" className="btn btn--primary" onClick={handlePrint}>
              Download PDF
            </button>
          )}

          {authenticated ? (
            <div className="topbar__user">
              {email && <span className="topbar__email">{email}</span>}
              <div className="topbar__avatar">
                {(email?.[0] ?? "U").toUpperCase()}
              </div>
              {onSignOut && (
                <button type="button" className="btn btn--ghost" onClick={onSignOut}>
                  Sign out
                </button>
              )}
            </div>
          ) : (
            authEnabled &&
            onSignIn && (
              <button type="button" className="btn btn--ghost" onClick={onSignIn}>
                Sign in to save
              </button>
            )
          )}
        </div>
      </header>

      <div className="app">
        <aside className="app__sidebar">
          {authEnabled && !authenticated && (
            <div className="banner">
              <div className="banner__icon">💾</div>
              <div className="banner__text">
                <strong>Working locally.</strong> Your invoices are saved in this
                browser only.{" "}
                {onSignIn && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onSignIn();
                    }}
                    style={{ color: "var(--coral-ink)", fontWeight: 700 }}
                  >
                    Sign in to save them to your account.
                  </a>
                )}
              </div>
            </div>
          )}

          {migratedCount > 0 && (
            <div className="banner">
              <div className="banner__icon">✅</div>
              <div className="banner__text">
                <strong>
                  {migratedCount} local invoice
                  {migratedCount === 1 ? "" : "s"}
                </strong>{" "}
                moved to your account.{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    acknowledgeMigration();
                  }}
                  style={{ color: "var(--coral-ink)", fontWeight: 700 }}
                >
                  Dismiss
                </a>
              </div>
            </div>
          )}

          <InvoiceList
            items={items}
            currentId={currentId}
            onSelect={select}
            onNew={createNew}
            onDuplicate={duplicate}
            onDelete={remove}
          />

          {loading ? (
            <p className="app__status">Loading…</p>
          ) : current ? (
            <>
              <div className="app__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={resetCurrentToDefaults}
                >
                  Reset fields
                </button>
              </div>
              <InvoiceForm invoice={current} onChange={patch} />
            </>
          ) : (
            <p className="app__status">
              No invoice selected. Click <strong>+ New</strong> above to start.
            </p>
          )}
        </aside>

        <main className="app__preview">
          {current ? (
            <InvoicePreview invoice={current} />
          ) : (
            <div className="app__placeholder">
              Create or open an invoice to preview it here.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
