import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import styles from "./MonthlyTrend.module.css";

const MonthlyTrend = () => {
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

  const data = Object.values(grouped).sort(
    (a, b) => new Date(a.month) - new Date(b.month)
  );

  /* ================= FORMAT LABEL ================= */
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
          <div>Income: ₹{payload[0].value}</div>
          <div>Expense: ₹{payload[1].value}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Monthly Trend</h3>
        <span>Income vs Expenses</span>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer>
          <BarChart data={data} barGap={8}>
            
            <CartesianGrid
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              stroke="#888"
            />

            <YAxis stroke="#888" />

            <Tooltip content={<CustomTooltip />} />

            {/* INCOME */}
            <Bar
              dataKey="income"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
            />

            {/* EXPENSE */}
            <Bar
              dataKey="expense"
              fill="#ef4444"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyTrend;