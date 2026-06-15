/**
 * File: src/services/doubleEntry.ts
 * Double-Entry module: balance sheets (CRUD + lifecycle) and the read-only
 * financial reports (trial balance, P&L, ledger summary, general ledger,
 * account balance, cash flow, journal entry, expense report).
 */

import { createResourceHooks } from "@/hooks/useResource";
import type { Entity } from "@/lib/api/types";
import { getList, getOne, postJson, deleteJson, makeResource } from "./_http";

const BASE = "/double-entry";

export interface DateRange {
  from_date?: string;
  to_date?: string;
  as_of_date?: string;
  status?: string;
  account_id?: string;
  [key: string]: unknown;
}

// ─── Balance Sheets ─────────────────────────────────────────────────────────

export interface BalanceSheet extends Entity {
  balance_sheet_date: string;
  financial_year: string;
  status?: "draft" | "finalized" | string;
  total_assets?: number;
  total_liabilities?: number;
  total_equity?: number;
  notes?: Array<{ _id?: string; id?: string; note_title: string; note_content: string }>;
  createdAt?: string;
}

/** Balance sheets: list at `/balance-sheets/list`, create at `/balance-sheets`. */
export const balanceSheetsService = makeResource<BalanceSheet>({
  list: `${BASE}/balance-sheets/list`,
  single: (id) => `${BASE}/balance-sheets/${id}`,
  create: `${BASE}/balance-sheets`,
  update: (id) => `${BASE}/balance-sheets/${id}`,
  remove: (id) => `${BASE}/balance-sheets/${id}`,
});

export const balanceSheetHooks = createResourceHooks("balance-sheets", balanceSheetsService);

export const balanceSheetActions = {
  latest: () => getOne<BalanceSheet>(`${BASE}/balance-sheets/latest`),
  show: (id: string) => getOne<BalanceSheet>(`${BASE}/balance-sheets/${id}`),
  finalize: (id: string) => postJson(`${BASE}/balance-sheets/${id}/finalize`),
  addNote: (id: string, body: { note_title: string; note_content: string }) =>
    postJson(`${BASE}/balance-sheets/${id}/notes`, body),
  deleteNote: (id: string, noteId: string) =>
    deleteJson(`${BASE}/balance-sheets/${id}/notes/${noteId}`),
  compare: (body: { current_period_id: string; previous_period_id: string }) =>
    postJson(`${BASE}/balance-sheets/compare`, body),
  comparisons: () => getList(`${BASE}/balance-sheets/comparisons`),
  yearEndClose: (body: { financial_year: string; closing_date: string }) =>
    postJson(`${BASE}/balance-sheets/year-end-close`, body),
  printUrl: (id: string) => `${BASE}/balance-sheets/${id}/print`,
};

// ─── Reports (read-only) ────────────────────────────────────────────────────

export const doubleEntryReports = {
  index: () => getOne(`${BASE}/reports`),
  trialBalance: (p: DateRange) => getOne(`${BASE}/trial-balance`, p),
  profitLoss: (p: DateRange) => getOne(`${BASE}/profit-loss`, p),
  ledgerSummary: (p: DateRange) => getOne(`${BASE}/ledger-summary`, p),
  generalLedger: (p: DateRange) => getOne(`${BASE}/reports/general-ledger`, p),
  accountStatement: (p: DateRange) => getOne(`${BASE}/reports/account-statement`, p),
  journalEntry: (p: DateRange) => getOne(`${BASE}/reports/journal-entry`, p),
  accountBalance: (p: DateRange) => getOne(`${BASE}/reports/account-balance`, p),
  cashFlow: (p: DateRange) => getOne(`${BASE}/reports/cash-flow`, p),
  expenseReport: (p: DateRange) => getOne(`${BASE}/reports/expense-report`, p),
};

// ─── Shared: Chart of Accounts (used by reports + budget allocations) ───────

export interface ChartAccount extends Entity {
  name?: string;
  account_name?: string;
  account_code?: string;
  account_type?: string;
}

export const fetchChartOfAccounts = (params?: { limit?: number; page?: number; searchTerm?: string }) =>
  getList<ChartAccount>(`/account/chart-of-accounts/all`, { limit: 100, ...params });
