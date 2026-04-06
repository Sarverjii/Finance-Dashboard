import { useSelector } from "react-redux";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* 🔥 COMPACT FILTER BUTTON */
const filterBtn = (active) => ({
  padding: "4px 10px", // ✅ smaller
  borderRadius: "8px",
  fontSize: "11px",
  border: "1px solid var(--border-color)",
  background: active
    ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
    : "var(--bg-primary)",
  color: active ? "#fff" : "var(--text-secondary)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: active
    ? "0 0 8px rgba(124,58,237,0.4)"
    : "none",
});

/* 🔥 TOOLTIP */
const CustomTooltip = ({ active, payload, label, formatLabel }) => {
  if (!active || !payload) return null;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        padding: 10,
        borderRadius: 10,
        fontSize: 12,
      }}
    >
      <div style={{ marginBottom: 6 }}>{formatLabel(label)}</div>

      <div style={{ color: "#22c55e" }}>
        Income: ₹{payload[0]?.value}
      </div>
      <div style={{ color: "#ef4444" }}>
        Expense: ₹{payload[1]?.value}
      </div>
      <div style={{ color: "#7c3aed" }}>
        Balance: ₹{payload[2]?.value}
      </div>
    </div>
  );
};

const CashflowChart = () => {
  const transactions = useSelector((state) => state.finance.transactions);
  const [filter, setFilter] = useState("weekly");

  if (!transactions.length) return null;

  /* ================= SORT ================= */
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const latestDate = new Date(sorted[sorted.length - 1].date);

  /* ================= RANGE ================= */
  let startDate = new Date(latestDate);

  if (filter === "weekly") startDate.setDate(latestDate.getDate() - 6);
  if (filter === "monthly")
    startDate = new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
  if (filter === "yearly")
    startDate = new Date(latestDate.getFullYear(), 0, 1);

  /* ================= FILTER ================= */
  const filtered = sorted.filter((tx) => {
    const d = new Date(tx.date);
    return d >= startDate && d <= latestDate;
  });

  /* ================= GROUP ================= */
  const grouped = {};

  filtered.forEach((tx) => {
    const d = new Date(tx.date);

    let key =
      filter === "yearly"
        ? `${d.getFullYear()}-${d.getMonth()}`
        : d.toISOString().split("T")[0];

    if (!grouped[key]) {
      grouped[key] = { income: 0, expense: 0 };
    }

    if (tx.type === "income") grouped[key].income += tx.amount;
    else grouped[key].expense += tx.amount;
  });

  /* ================= BUILD ================= */
  let cumulativeIncome = 0;
  let cumulativeExpense = 0;
  let balance = 0;

  const data = [];
  let current = new Date(startDate);

  while (current <= latestDate) {
    let key =
      filter === "yearly"
        ? `${current.getFullYear()}-${current.getMonth()}`
        : current.toISOString().split("T")[0];

    if (filter === "yearly") current.setMonth(current.getMonth() + 1);
    else current.setDate(current.getDate() + 1);

    const item = grouped[key] || { income: 0, expense: 0 };

    cumulativeIncome += item.income;
    cumulativeExpense += item.expense;
    balance += item.income - item.expense;

    data.push({
      key,
      income: cumulativeIncome,
      expense: cumulativeExpense,
      balance,
    });
  }

  /* ================= FORMAT ================= */
  const formatLabel = (key) => {
    if (filter === "yearly") {
      const [y, m] = key.split("-");
      return new Date(y, m).toLocaleString("en-IN", { month: "short" });
    }
    return new Date(key).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div
      style={{
        padding: 16,
        background: "var(--bg-card)",
        borderRadius: 16,
        border: "1px solid var(--border-color)",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h3>Cashflow Overview</h3>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Cumulative Income vs Expense
          </span>
        </div>

        {/* 🔥 FIXED BUTTONS */}
        <div style={{ display: "flex", gap: 10, height: 30 }}>
          {["weekly", "monthly", "yearly"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={filterBtn(filter === f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 🔥 CLEAN LEGEND */}
      <div style={{ margin: "12px 0", fontSize: 12 }}>
        <span style={{ color: "#22c55e", marginRight: 12 }}>● Income</span>
        <span style={{ color: "#ef4444", marginRight: 12 }}>● Expense</span>
        <span style={{ color: "#7c3aed" }}>● Balance</span>
      </div>

      {/* CHART */}
      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            {/* 🔥 SOFT GRID */}
            <CartesianGrid
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="key"
              tickFormatter={formatLabel}
              stroke="var(--text-secondary)"
            />

            <YAxis stroke="var(--text-secondary)" />

            <Tooltip content={<CustomTooltip formatLabel={formatLabel} />} />

            {/* 🔥 LINES */}
            <Line
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={false}
            />

            <Line
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={false}
            />

            <Line
              dataKey="balance"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashflowChart;