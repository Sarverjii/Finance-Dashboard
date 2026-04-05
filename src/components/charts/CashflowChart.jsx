import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Scatter,
} from "recharts";

const CashflowChart = () => {
  const transactions = useSelector((state) => state.finance.transactions);

  /* ================= SORT ================= */
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  /* ================= BUILD DATA ================= */
  let balance = 0;
  let totalExpense = 0;

  const data = sorted.map((tx) => {
    if (tx.type === "income") {
      balance += tx.amount;
    } else {
      balance -= tx.amount;
      totalExpense += tx.amount;
    }

    return {
      date: tx.date,
      balance,
      totalExpense,
      incomeDot: tx.type === "income" ? balance : null, // 🔥 only show dot on income
    };
  });

  /* ================= FORMAT DATE ================= */
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer>
        <LineChart data={data}>

          {/* GRID */}
          <CartesianGrid
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />

          {/* X AXIS */}
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#888"
          />

          {/* Y AXIS */}
          <YAxis stroke="#888" />

          {/* TOOLTIP */}
          <Tooltip
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
            }}
            labelFormatter={formatDate}
            formatter={(value, name) => {
              if (name === "balance") return [`₹${value}`, "Balance"];
              if (name === "totalExpense") return [`₹${value}`, "Total Expense"];
              return [`₹${value}`, name];
            }}
          />

          {/* LEGEND */}
          <Legend />

          {/* 🔴 TOTAL EXPENSE LINE */}
          <Line
            type="monotone"
            dataKey="totalExpense"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="Total Expense"
          />

          {/* 🟣 BALANCE LINE */}
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#7c3aed"
            strokeWidth={3}
            dot={false}
            name="Balance"
          />

          {/* 🟢 INCOME DOTS */}
          <Scatter
            dataKey="incomeDot"
            fill="#22c55e"
            name="Income Events"
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashflowChart;