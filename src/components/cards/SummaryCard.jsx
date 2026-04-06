import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./SummaryCard.module.css";

const SummaryCard = ({ title, type }) => {
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
  const filtered = sorted.filter((tx) => {
    const d = new Date(tx.date);
    return d >= startDate && d <= latestDate;
  });

  /* ================= CALCULATE ================= */
  let amount = 0;

  if (type === "income") {
    amount = filtered
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }

  if (type === "expense") {
    amount = filtered
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }

  if (type === "balance") {
    const income = filtered
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filtered
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    amount = income - expense;
  }

  return (
    <div className={`${styles.card} ${styles[type]}`}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>

        <div className={styles.filters}>
          {["weekly", "monthly", "yearly"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`${styles.filterBtn} ${
                filter === f ? styles.active : ""
              }`}
            >
              {f[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* AMOUNT */}
      <div className={styles.amount}>
        ₹ {amount.toLocaleString()}
      </div>

      {/* SUBTEXT */}
      <div className={styles.subtext}>
        {type === "income" && "Money earned"}
        {type === "expense" && "Money spent"}
        {type === "balance" && "Available balance"}
      </div>
    </div>
  );
};

export default SummaryCard;