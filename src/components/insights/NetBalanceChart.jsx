import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

import styles from "./NetBalanceChart.module.css";

const NetBalanceChart = () => {
  const transactions = useSelector((state) => state.finance.transactions);

  /* ================= GROUP BY MONTH ================= */
  const grouped = {};

  transactions.forEach((tx) => {
    const d = new Date(tx.date);

    const key = `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!grouped[key]) {
      grouped[key] = {
        month: key,
        income: 0,
        expense: 0,
      };
    }

    if (tx.type === "income") {
      grouped[key].income += tx.amount;
    } else {
      grouped[key].expense += tx.amount;
    }
  });

  /* ================= CALCULATE NET ================= */
  const data = Object.values(grouped)
    .map((item) => ({
      ...item,
      net: item.income - item.expense,
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  /* ================= FORMAT ================= */
  const formatMonth = (month) => {
    const d = new Date(month);
    return d.toLocaleString("en-IN", {
      month: "short",
      year: "2-digit",
    });
  };

  /* ================= TOOLTIP ================= */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipTitle}>
            {formatMonth(label)}
          </div>
          <div>Net: ₹{payload[0].value}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Net Balance</h3>
        <span>Monthly net (income - expenses)</span>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer>
          <LineChart data={data}>
            
            {/* GRID */}
            <CartesianGrid
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            {/* AXES */}
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              stroke="#888"
            />

            <YAxis stroke="#888" />

            {/* TOOLTIP */}
            <Tooltip content={<CustomTooltip />} />

            {/* AREA (SOFT GLOW) */}
            <Area
              type="monotone"
              dataKey="net"
              stroke="none"
              fill="rgba(124,58,237,0.15)"
            />

            {/* LINE */}
            <Line
              type="monotone"
              dataKey="net"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetBalanceChart;