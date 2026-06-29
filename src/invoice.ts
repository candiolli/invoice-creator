export type Invoice = {
  invoiceNumber: string;
  creationDate: string;
  dueDate: string;
  monthOfService: string;
  amount: number;
  currency: string;

  billFromName: string;
  billFromCnpj: string;
  billFromAddress: string;

  billToName: string;
  billToAddress: string;

  serviceTitle: string;
  serviceDescription: string;

  beneficiaryName: string;
  beneficiaryIban: string;
  bankSwift: string;
  bankName: string;
  bankAddress: string;

  intermediarySwift: string;
  intermediaryBankName: string;
  intermediaryBankAddress: string;
  intermediaryAccountNumber: string;

  contactEmail: string;
};

export const defaultInvoice: Invoice = {
  invoiceNumber: "100000626",
  creationDate: "2026-05-27",
  dueDate: "2026-07-20",
  monthOfService: "Jun2026",
  amount: 5544,
  currency: "USD",

  billFromName: "",
  billFromCnpj: "",
  billFromAddress:
    "",

  billToName: "",
  billToAddress: "",

  serviceTitle: "Software development",
  serviceDescription: "Consulting in systems analysis and development.",

  beneficiaryName: "",
  beneficiaryIban: "",
  bankSwift: "",
  bankName: "",
  bankAddress: "",

  intermediarySwift: "",
  intermediaryBankName: "",
  intermediaryBankAddress: "",
  intermediaryAccountNumber: "",

  contactEmail: "",
};

export function formatMoney(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency} ${formatted}`;
}
