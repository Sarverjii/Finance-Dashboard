import { useSelector } from "react-redux";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  PieChart,
} from "lucide-react";

import styles from "./FinancialInsights.module.css";

const FinancialInsights = () => {
  const transactions = useSelector((state) => state.finance.transactions);

  /* ================= TOP SPENDING CATEGORY ================= */
  const categoryMap = {};

  transactions.forEach((tx) => {
    if (tx.type === "expense") {
      categoryMap[tx.category] =
        (categoryMap[tx.category] || 0) + tx.amount;
    }
  });

  let topCategory = "-";
  let maxSpent = 0;

  Object.keys(categoryMap).forEach((cat) => {
    if (categoryMap[cat] > maxSpent) {
      maxSpent = categoryMap[cat];
      topCategory = cat;
    }
  });

  /* ================= MONTHLY COMPARISON ================= */
  const now = new Date();

  const thisMonth = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const lastMonth = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return (
      d.getMonth() === now.getMonth() - 1 &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const getTotal = (arr) =>
    arr.reduce((sum, t) => sum + t.amount, 0);

  const thisTotal = getTotal(thisMonth);
  const lastTotal = getTotal(lastMonth);

  const percentage =
    lastTotal > 0
      ? (((thisTotal - lastTotal) / lastTotal) * 100).toFixed(1)
      : 0;

  /* ================= NET BALANCE ================= */
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  /* ================= AVG DAILY SPEND ================= */
  const expenseTx = transactions.filter((t) => t.type === "expense");

  const uniqueDays = new Set(
    expenseTx.map((t) => t.date.split("T")[0])
  );

  const avgDaily =
    uniqueDays.size > 0
      ? (expense / uniqueDays.size).toFixed(0)
      : 0;

  /* ================= SAVINGS RATE ================= */
  const savingsRate =
    income > 0 ? (((income - expense) / income) * 100).toFixed(1) : 0;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>FINANCIAL INSIGHTS</h3>

      {/* TOP CATEGORY */}
      <div className={styles.item}>
        <PieChart size={18} className={styles.icon} />
        <div>
          <div className={styles.label}>TOP SPENDING</div>
          <div className={styles.main}>{topCategory}</div>
          <div className={styles.sub}>₹{maxSpent} spent</div>
        </div>
      </div>

      {/* MONTHLY COMPARISON */}
      <div className={styles.item}>
        <BarChart3 size={18} className={styles.icon} />
        <div>
          <div className={styles.label}>MONTHLY CHANGE</div>
          <div className={styles.main}>
            {percentage > 0 ? "+" : ""}
            {percentage}%
          </div>
          <div className={styles.sub}>
            ₹{thisTotal} vs ₹{lastTotal}
          </div>
        </div>
      </div>

      {/* NET BALANCE */}
      <div className={styles.item}>
        <Wallet size={18} className={styles.icon} />
        <div>
          <div className={styles.label}>NET BALANCE</div>
          <div className={styles.main}>₹{balance}</div>
          <div className={styles.sub}>
            {balance >= 0
              ? "Healthy financial state"
              : "Overspending detected"}
          </div>
        </div>
      </div>

      {/* AVG DAILY SPEND */}
      <div className={styles.item}>
        <TrendingDown size={18} className={styles.icon} />
        <div>
          <div className={styles.label}>AVG DAILY SPEND</div>
          <div className={styles.main}>₹{avgDaily}</div>
          <div className={styles.sub}>Per active day</div>
        </div>
      </div>

      {/* SAVINGS RATE */}
      <div className={styles.item}>
        <TrendingUp size={18} className={styles.icon} />
        <div>
          <div className={styles.label}>SAVINGS RATE</div>
          <div className={styles.main}>{savingsRate}%</div>
          <div className={styles.sub}>
            Income retained after expenses
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialInsights;