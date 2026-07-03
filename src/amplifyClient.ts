import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

// Created lazily so guest mode (and unconfigured deploys) never touch Amplify.
let _client: ReturnType<typeof generateClient<Schema>> | null = null;

export function getClient() {
  if (!_client) _client = generateClient<Schema>();
  return _client;
}

export type InvoiceRecord = Schema["Invoice"]["type"];
