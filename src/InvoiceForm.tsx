import type { Invoice } from "./invoice";

type Props = {
  invoice: Invoice;
  onChange: (patch: Partial<Invoice>) => void;
};

type FieldProps = {
  label: string;
  value: string | number;
  type?: "text" | "number" | "date" | "email";
  multiline?: boolean;
  onChange: (v: string) => void;
};

function Field({ label, value, type = "text", multiline, onChange }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value as string}
          rows={2}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function InvoiceForm({ invoice, onChange }: Props) {
  const set =
    <K extends keyof Invoice>(key: K) =>
    (raw: string) => {
      const next: Partial<Invoice> =
        key === "amount"
          ? ({ [key]: Number(raw) } as Partial<Invoice>)
          : ({ [key]: raw } as Partial<Invoice>);
      onChange(next);
    };

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend>Invoice</legend>
        <Field label="Invoice #" value={invoice.invoiceNumber} onChange={set("invoiceNumber")} />
        <Field label="Creation date" type="date" value={invoice.creationDate} onChange={set("creationDate")} />
        <Field label="Due date" type="date" value={invoice.dueDate} onChange={set("dueDate")} />
        <Field label="Month of service" value={invoice.monthOfService} onChange={set("monthOfService")} />
        <Field label="Currency" value={invoice.currency} onChange={set("currency")} />
        <Field label="Amount" type="number" value={invoice.amount} onChange={set("amount")} />
      </fieldset>

      <fieldset>
        <legend>Bill From</legend>
        <Field label="Company name" value={invoice.billFromName} onChange={set("billFromName")} />
        <Field label="CNPJ" value={invoice.billFromCnpj} onChange={set("billFromCnpj")} />
        <Field label="Address" multiline value={invoice.billFromAddress} onChange={set("billFromAddress")} />
      </fieldset>

      <fieldset>
        <legend>Bill To</legend>
        <Field label="Client name" value={invoice.billToName} onChange={set("billToName")} />
        <Field label="Address" multiline value={invoice.billToAddress} onChange={set("billToAddress")} />
      </fieldset>

      <fieldset>
        <legend>Service</legend>
        <Field label="Title" value={invoice.serviceTitle} onChange={set("serviceTitle")} />
        <Field label="Description" multiline value={invoice.serviceDescription} onChange={set("serviceDescription")} />
      </fieldset>

      <fieldset>
        <legend>Banking</legend>
        <Field label="Beneficiary name" value={invoice.beneficiaryName} onChange={set("beneficiaryName")} />
        <Field label="IBAN" value={invoice.beneficiaryIban} onChange={set("beneficiaryIban")} />
        <Field label="SWIFT" value={invoice.bankSwift} onChange={set("bankSwift")} />
        <Field label="Bank name" value={invoice.bankName} onChange={set("bankName")} />
        <Field label="Bank address" multiline value={invoice.bankAddress} onChange={set("bankAddress")} />
      </fieldset>

      <fieldset>
        <legend>Intermediary bank (optional)</legend>
        <Field label="SWIFT" value={invoice.intermediarySwift} onChange={set("intermediarySwift")} />
        <Field label="Bank name" value={invoice.intermediaryBankName} onChange={set("intermediaryBankName")} />
        <Field label="Bank address" value={invoice.intermediaryBankAddress} onChange={set("intermediaryBankAddress")} />
        <Field label="Account number" value={invoice.intermediaryAccountNumber} onChange={set("intermediaryAccountNumber")} />
      </fieldset>

      <fieldset>
        <legend>Footer</legend>
        <Field label="Contact email" type="email" value={invoice.contactEmail} onChange={set("contactEmail")} />
      </fieldset>
    </form>
  );
}
