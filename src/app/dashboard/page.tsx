"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import { Trade, TradeInput, createTrade, fetchTrades } from "@/lib/trades";

type User = {
  id: string;
  email: string;
  name: string | null;
};

type TradeFormState = {
  symbol: string;
  entryPrice: string;
  exitPrice: string;
  quantity: string;
  pnl: string;
  tradeDate: string;
  goodNotes: string;
  badNotes: string;
};

const emptyFormState: TradeFormState = {
  symbol: "",
  entryPrice: "",
  exitPrice: "",
  quantity: "",
  pnl: "",
  tradeDate: "",
  goodNotes: "",
  badNotes: "",
};

const formatNumber = (value: number) =>
  Number.isFinite(value)
    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : "-";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString();
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const [formState, setFormState] = useState<TradeFormState>(emptyFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load profile.");
        }

        const data = await response.json();
        setUser(data.user);

        const dashboardResponse = await fetch(`${API_URL}/api/dashboard`, {
          credentials: "include",
        });
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          setMessage(dashboardData.message);
        }

        const tradeData = await fetchTrades();
        setTrades(tradeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load profile.");
      } finally {
        setLoadingTrades(false);
      }
    };

    load();
  }, []);

  const summary = useMemo(() => {
    if (!trades.length) {
      return {
        totalPnL: 0,
        avgPnL: 0,
        winRate: 0,
        totalTrades: 0,
      };
    }

    const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const wins = trades.filter((trade) => trade.pnl >= 0).length;
    return {
      totalPnL,
      avgPnL: totalPnL / trades.length,
      winRate: (wins / trades.length) * 100,
      totalTrades: trades.length,
    };
  }, [trades]);

  const pnlScale = useMemo(() => {
    if (!trades.length) return 1;
    const max = Math.max(...trades.map((trade) => Math.abs(trade.pnl)));
    return max || 1;
  }, [trades]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      const payload: TradeInput = {
        symbol: formState.symbol,
        entryPrice: formState.entryPrice,
        exitPrice: formState.exitPrice,
        quantity: formState.quantity,
        pnl: formState.pnl,
        tradeDate: formState.tradeDate,
        goodNotes: formState.goodNotes,
        badNotes: formState.badNotes,
        source: "MANUAL",
      };

      const newTrade = await createTrade(payload);
      setTrades((prev) => [newTrade, ...prev]);
      setFormState(emptyFormState);
      setFormSuccess("Trade logged successfully.");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Unable to save the trade."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Trade Journal Dashboard
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">
                Your trading command center
              </h1>
              <p className="text-sm text-slate-400">
                Track entries, exits, and the mindset behind every trade.
              </p>
            </div>
            {user ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm">
                <p className="font-semibold text-white">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            ) : null}
          </div>
          {message ? (
            <p className="text-sm text-cyan-200">{message}</p>
          ) : null}
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            {
              label: "Total P&L",
              value: formatNumber(summary.totalPnL),
              helper: "Across all trades",
            },
            {
              label: "Average P&L",
              value: formatNumber(summary.avgPnL),
              helper: "Per trade",
            },
            {
              label: "Win rate",
              value: `${summary.winRate.toFixed(1)}%`,
              helper: "PnL >= 0",
            },
            {
              label: "Total trades",
              value: summary.totalTrades.toString(),
              helper: "Logged so far",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{card.helper}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">PnL momentum</h2>
            <p className="text-sm text-slate-400">
              A snapshot of recent wins and losses. Broker imports can replace
              manual entries later using the same trade schema.
            </p>
            <div className="mt-6 flex h-40 items-end gap-2">
              {trades.length ? (
                trades
                  .slice(0, 10)
                  .reverse()
                  .map((trade) => {
                    const height =
                      (Math.abs(trade.pnl) / pnlScale) * 100 || 2;
                    return (
                      <div
                        key={trade.id}
                        className="flex flex-1 flex-col items-center gap-2"
                      >
                        <div
                          className={`w-full rounded-md transition-all ${
                            trade.pnl >= 0
                              ? "bg-emerald-400/70"
                              : "bg-rose-400/70"
                          }`}
                          style={{ height: `${height}%` }}
                          title={`${trade.symbol}: ${formatNumber(trade.pnl)}`}
                        />
                        <span className="text-[10px] uppercase text-slate-500">
                          {trade.symbol}
                        </span>
                      </div>
                    );
                  })
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-slate-500">
                  Log a trade to see your momentum chart.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Log a trade</h2>
            <p className="text-sm text-slate-400">
              Capture the trade details plus what went well and what needs work.
            </p>

            {formError ? (
              <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {formError}
              </p>
            ) : null}
            {formSuccess ? (
              <p className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                {formSuccess}
              </p>
            ) : null}

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-xs text-slate-400">
                  Symbol
                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                    name="symbol"
                    value={formState.symbol}
                    onChange={handleInputChange}
                    placeholder="RELIANCE"
                    required
                  />
                </label>
                <label className="text-xs text-slate-400">
                  Trade date
                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                    name="tradeDate"
                    type="date"
                    value={formState.tradeDate}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label className="text-xs text-slate-400">
                  Entry price
                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                    name="entryPrice"
                    type="number"
                    step="0.01"
                    value={formState.entryPrice}
                    onChange={handleInputChange}
                    placeholder="102.50"
                    required
                  />
                </label>
                <label className="text-xs text-slate-400">
                  Exit price
                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                    name="exitPrice"
                    type="number"
                    step="0.01"
                    value={formState.exitPrice}
                    onChange={handleInputChange}
                    placeholder="110.80"
                    required
                  />
                </label>
                <label className="text-xs text-slate-400">
                  Quantity
                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                    name="quantity"
                    type="number"
                    value={formState.quantity}
                    onChange={handleInputChange}
                    placeholder="50"
                    required
                  />
                </label>
                <label className="text-xs text-slate-400">
                  P&L
                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                    name="pnl"
                    type="number"
                    step="0.01"
                    value={formState.pnl}
                    onChange={handleInputChange}
                    placeholder="420.50"
                    required
                  />
                </label>
              </div>

              <label className="text-xs text-slate-400">
                What went well? (Strategy execution)
                <textarea
                  className="mt-2 min-h-[80px] w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  name="goodNotes"
                  value={formState.goodNotes}
                  onChange={handleInputChange}
                  placeholder="Followed the breakout plan and sized correctly."
                />
              </label>
              <label className="text-xs text-slate-400">
                What needs work? (Greed, discipline, emotions)
                <textarea
                  className="mt-2 min-h-[80px] w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white"
                  name="badNotes"
                  value={formState.badNotes}
                  onChange={handleInputChange}
                  placeholder="Held too long after target; felt greedy."
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving trade..." : "Add trade"}
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">All trades</h2>
              <p className="text-sm text-slate-400">
                Manual entries today; broker sync fields are ready for future
                imports.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-xs text-slate-400">
              Source: Manual
            </span>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          ) : null}

          {loadingTrades ? (
            <p className="mt-4 text-sm text-slate-400">Loading trades...</p>
          ) : trades.length ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Symbol</th>
                    <th className="pb-3">Entry</th>
                    <th className="pb-3">Exit</th>
                    <th className="pb-3">Qty</th>
                    <th className="pb-3">P&L</th>
                    <th className="pb-3">Good</th>
                    <th className="pb-3">Bad</th>
                    <th className="pb-3">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {trades.map((trade) => (
                    <tr key={trade.id} className="text-slate-200">
                      <td className="py-3 text-slate-400">
                        {formatDate(trade.tradeDate)}
                      </td>
                      <td className="py-3 font-semibold text-white">
                        {trade.symbol}
                      </td>
                      <td className="py-3">{formatNumber(trade.entryPrice)}</td>
                      <td className="py-3">{formatNumber(trade.exitPrice)}</td>
                      <td className="py-3">{trade.quantity}</td>
                      <td
                        className={`py-3 font-semibold ${
                          trade.pnl >= 0 ? "text-emerald-300" : "text-rose-300"
                        }`}
                      >
                        {formatNumber(trade.pnl)}
                      </td>
                      <td className="py-3 text-slate-400">
                        {trade.goodNotes || "-"}
                      </td>
                      <td className="py-3 text-slate-400">
                        {trade.badNotes || "-"}
                      </td>
                      <td className="py-3 text-slate-400">
                        {trade.broker ? `${trade.source} (${trade.broker})` : trade.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              No trades yet. Start by logging your first entry.
            </p>
          )}
        </section>

        <Link className="text-sm text-cyan-300 hover:text-cyan-200" href="/">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
