import { API_BASE_URL } from "@/lib/config";

export type Trade = {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  tradeDate: string;
  goodNotes: string | null;
  badNotes: string | null;
  source: "MANUAL" | "BROKER";
  broker: string | null;
  externalId: string | null;
};

export type TradeInput = {
  symbol: string;
  entryPrice: number | string;
  exitPrice: number | string;
  quantity: number | string;
  pnl: number | string;
  tradeDate: string;
  goodNotes?: string;
  badNotes?: string;
  source?: "MANUAL" | "BROKER";
  broker?: string;
  externalId?: string;
};

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

export const fetchTrades = async () => {
  const response = await fetch(buildUrl("/trades"), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch trades.");
  }

  const data = await response.json();
  return data.trades as Trade[];
};

export const createTrade = async (payload: TradeInput) => {
  const response = await fetch(buildUrl("/trades"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Unable to add trade.");
  }

  const data = await response.json();
  return data.trade as Trade;
};
