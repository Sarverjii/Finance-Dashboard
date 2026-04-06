import { useSelector } from "react-redux";
import { useState } from "react";
import styles from "./BudgetProgress.module.css";

const BudgetProgress = () => {
  const categories = useSelector((state) => state.category.categories);
  const budgets = useSelector((state) => state.budget.budgets);
  const transactions = useSelector((state) => state.finance.transactions);

  const [filter, setFilter] = useState("monthly");

  if (!transactions.length) return null;

  /* ================= GET DATE RANGE ================= */
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const latestDate = new Date(sorted[sorted.length - 1].date);

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

  /* ================= FILTERED TRANSACTIONS ================= */
  const filteredTx = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d >= startDate && d <= latestDate;
  });

  return (
    <div className={styles.card}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <h3 className={styles.title}>Budget Progress</h3>

        <div className={styles.filters}>
          {["weekly", "monthly", "yearly"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`${styles.filterBtn} ${
                filter === f ? styles.active : ""
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className={styles.list}>
        {categories.map((cat, index) => {
          
          /* SPENT IN THIS PERIOD */
          const spent = filteredTx
            .filter(
              (t) => t.category === cat && t.type === "expense"
            )
            .reduce((sum, t) => sum + t.amount, 0);

          /* GET CORRECT BUDGET */
          const budget = budgets[cat]?.[filter] || 0;

          const percentage =
            budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

          /* COLOR LOGIC */
          let colorClass = styles.green;
          if (percentage > 80) colorClass = styles.red;
          else if (percentage > 50) colorClass = styles.yellow;

          return (
            <div key={index} className={styles.item}>
              
              {/* ROW */}
              <div className={styles.row}>
                <span>{cat}</span>
                <span>
                  ₹{spent} / ₹{budget}
                </span>
              </div>

              {/* BAR */}
              <div className={styles.bar}>
                <div
                  className={`${styles.fill} ${colorClass}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;