import { Authenticator } from "@aws-amplify/ui-react";
import { InvoiceForm } from "./InvoiceForm";
import { InvoiceList } from "./InvoiceList";
import { InvoicePreview } from "./InvoicePreview";
import { useInvoices } from "./useInvoices";

export default function App() {
  return (
    <Authenticator hideSignUp={false}>
      {({ signOut, user }) => <AppInner signOut={signOut} email={user?.signInDetails?.loginId} />}
    </Authenticator>
  );
}

function AppInner({ signOut, email }: { signOut?: () => void; email?: string }) {
  const {
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
  } = useInvoices();

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
    <div className="app">
      <aside className="app__sidebar">
        <div className="app__sidebar-head">
          <h1>Invoice Creator</h1>
          <div className="app__user">
            {email && <span className="app__user-email">{email}</span>}
            {signOut && (
              <button type="button" className="app__btn app__btn--ghost" onClick={signOut}>
                Sign out
              </button>
            )}
          </div>
        </div>

        <InvoiceList
          items={items}
          currentId={currentId}
          onSelect={select}
          onNew={createNew}
        />

        {loading ? (
          <p className="app__status">Loading…</p>
        ) : current ? (
          <>
            <div className="app__actions">
              <button type="button" className="app__btn app__btn--ghost" onClick={duplicate}>
                Duplicate
              </button>
              <button type="button" className="app__btn app__btn--ghost" onClick={resetCurrentToDefaults}>
                Reset fields
              </button>
              <button type="button" className="app__btn app__btn--ghost app__btn--danger" onClick={remove}>
                Delete
              </button>
              <button type="button" className="app__btn" onClick={handlePrint}>
                Print / Save as PDF
              </button>
            </div>
            <p className="app__status app__status--muted">
              {saving ? "Saving…" : "Saved"}
            </p>
            <InvoiceForm invoice={current} onChange={patch} />
          </>
        ) : (
          <p className="app__status">No invoice selected. Click <strong>+ New</strong> above.</p>
        )}
      </aside>

      <main className="app__preview">
        {current ? (
          <InvoicePreview invoice={current} />
        ) : (
          <div className="app__placeholder">Create or open an invoice to preview it here.</div>
        )}
      </main>
    </div>
  );
}
