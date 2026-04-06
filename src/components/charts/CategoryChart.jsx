import { useSelector } from "react-redux";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#7c3aed",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#3b82f6",
  "#14b8a6",
  "#eab308",
  "#ff00d0",
  "#ff3434",
  "#00ffa6",
  "#365409",
  "#4c00ff",
];

/* 🔥 FILTER BUTTON STYLE */
const filterBtn = (active) => ({
  padding: "6px 12px",
  borderRadius: "10px",
  fontSize: "12px",
  border: "1px solid var(--border-color)",
  background: active
    ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
    : "var(--bg-primary)",
  color: active ? "#fff" : "var(--text-secondary)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: active
    ? "0 0 10px rgba(124,58,237,0.4)"
    : "none",
});

const CategoryChart = () => {
  const transactions = useSelector((state) => state.finance.transactions);
  const [filter, setFilter] = useState("monthly");

  if (!transactions.length) return null;

  /* ================= SORT ================= */
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const latestDate = new Date(sorted[sorted.length - 1].date);

  /* ================= RANGE ================= */
  let startDate = new Date(latestDate);

  if (filter === "weekly") {
    startDate.setDate(latestDate.getDate() - 6);
  }

  if (filter === "monthly") {
    startDate = new Date(
      latestDate.getFullYear(),
      latestDate.getMonth(),
      1
    );
  }

  if (filter === "yearly") {
    startDate = new Date(latestDate.getFullYear(), 0, 1);
  }

  /* ================= FILTER ================= */
  const filtered = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return (
      d >= startDate &&
      d <= latestDate &&
      tx.type === "expense"
    );
  });

  /* ================= GROUP ================= */
  const grouped = {};

  filtered.forEach((tx) => {
    grouped[tx.category] =
      (grouped[tx.category] || 0) + tx.amount;
  });

  const data = Object.keys(grouped).map((key) => ({
    name: key,
    value: grouped[key],
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const sortedData = [...data].sort((a, b) => b.value - a.value);

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <h3>Spending Breakdown</h3>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Expenses by category
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, height: 30 }}>
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

      {/* 🔥 MAIN CONTENT (SIDE-BY-SIDE) */}
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        {/* DONUT */}
        <div style={{ flex: 1, position: "relative", height: 240 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(v, n) => [`₹${v}`, n]} />
            </PieChart>
          </ResponsiveContainer>

          {/* CENTER TEXT */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Total
            </div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              ₹{total}
            </div>
          </div>
        </div>

        {/* 🔥 CATEGORY LIST */}
        <div style={{ flex: 1 }}>
          {sortedData.map((item, index) => {
            const percent = ((item.value / total) * 100).toFixed(1);

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                  fontSize: 13,
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: COLORS[index % COLORS.length],
                      marginRight: 8,
                    }}
                  />
                  {item.name}
                </span>

                <span style={{ color: "var(--text-secondary)" }}>
                  ₹{item.value} ({percent}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;