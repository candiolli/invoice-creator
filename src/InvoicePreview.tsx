import { formatMoney, type Invoice } from "./invoice";

type Props = { invoice: Invoice };

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );
}

export function InvoicePreview({ invoice }: Props) {
  const total = formatMoney(invoice.amount, invoice.currency);

  const hasIntermediary =
    invoice.intermediarySwift ||
    invoice.intermediaryBankName ||
    invoice.intermediaryBankAddress ||
    invoice.intermediaryAccountNumber;

  return (
    <article className="invoice">
      <header className="invoice__top">
        <div className="invoice__company">
          {invoice.billFromName && <h1>{invoice.billFromName}</h1>}
          {invoice.billFromCnpj && (
            <p className="invoice__cnpj">
              <strong>CNPJ</strong>: {invoice.billFromCnpj}
            </p>
          )}
        </div>
        <div className="invoice__meta">
          {invoice.invoiceNumber && <h2>Invoice #{invoice.invoiceNumber}</h2>}
          <Row label="Creation date" value={invoice.creationDate} />
          <Row label="Due date" value={invoice.dueDate} />
        </div>
      </header>

      <hr className="invoice__rule" />

      <section className="invoice__parties">
        <div>
          <p className="invoice__label">Bill From:</p>
          {invoice.billFromName && (
            <p className="invoice__strong">{invoice.billFromName}</p>
          )}
          {invoice.billFromAddress && (
            <p className="invoice__muted">{invoice.billFromAddress}</p>
          )}
        </div>
        <div>
          <p className="invoice__label">Bill To:</p>
          {invoice.billToName && (
            <p className="invoice__strong">{invoice.billToName}</p>
          )}
          {invoice.billToAddress && (
            <p className="invoice__muted">{invoice.billToAddress}</p>
          )}
        </div>
      </section>

      <section className="invoice__services">
        <div className="invoice__services-head">
          <span>Services</span>
          <span>Amount</span>
        </div>
        <hr />
        <div className="invoice__services-row">
          <div>
            {invoice.serviceTitle && (
              <p className="invoice__strong">{invoice.serviceTitle}</p>
            )}
            {invoice.serviceDescription && (
              <p className="invoice__muted">{invoice.serviceDescription}</p>
            )}
            {invoice.monthOfService && (
              <p className="invoice__muted">
                Month of service: {invoice.monthOfService}
              </p>
            )}
          </div>
          <div className="invoice__amount">{total}</div>
        </div>
        <hr />
      </section>

      <section className="invoice__total">
        <span>Total</span>
        <strong>{total}</strong>
      </section>

      <section className="invoice__bank">
        <p className="invoice__strong">Pay to banking details below:</p>
        <Row label="Beneficiary name" value={invoice.beneficiaryName} />
        <Row label="Beneficiary Account Number (IBAN)" value={invoice.beneficiaryIban} />
        <Row label="SWIFT Code" value={invoice.bankSwift} />
        <Row label="Bank Name" value={invoice.bankName} />
        <Row label="Bank Address" value={invoice.bankAddress} />
      </section>

      {hasIntermediary && (
        <section className="invoice__bank">
          <p className="invoice__strong">
            (Optional information, always use it together with the bank details above) Intermediary bank details:
          </p>
          <Row label="SWIFT Code" value={invoice.intermediarySwift} />
          <Row label="Bank Name" value={invoice.intermediaryBankName} />
          <Row label="Bank Address" value={invoice.intermediaryBankAddress} />
          <Row label="Account Number" value={invoice.intermediaryAccountNumber} />
        </section>
      )}

      <hr className="invoice__rule" />

      <footer className="invoice__footer">
        {invoice.contactEmail ? (
          <span>
            <strong>Questions?</strong> Send an email to {invoice.contactEmail}
          </span>
        ) : (
          <span />
        )}
        <span>Created By Silas Candiolli.</span>
      </footer>
    </article>
  );
}
