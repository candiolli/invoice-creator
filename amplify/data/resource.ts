import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Invoice: a
    .model({
      invoiceNumber: a.string(),
      creationDate: a.string(),
      dueDate: a.string(),
      monthOfService: a.string(),
      amount: a.float(),
      currency: a.string(),

      billFromName: a.string(),
      billFromCnpj: a.string(),
      billFromAddress: a.string(),

      billToName: a.string(),
      billToAddress: a.string(),

      serviceTitle: a.string(),
      serviceDescription: a.string(),

      beneficiaryName: a.string(),
      beneficiaryIban: a.string(),
      bankSwift: a.string(),
      bankName: a.string(),
      bankAddress: a.string(),

      intermediarySwift: a.string(),
      intermediaryBankName: a.string(),
      intermediaryBankAddress: a.string(),
      intermediaryAccountNumber: a.string(),

      contactEmail: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
