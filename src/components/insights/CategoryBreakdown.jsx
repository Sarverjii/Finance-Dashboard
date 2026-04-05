import { useSelector } from "react-redux";
import styles from "./CategoryBreakdown.module.css";

const CategoryBreakdown = () => {
  const transactions = useSelector((state) => state.finance.transactions);

  /* ================= GROUP EXPENSES ================= */
  const grouped = {};

  transactions.forEach((tx) => {
    if (tx.type === "expense") {
      grouped[tx.category] =
        (grouped[tx.category] || 0) + tx.amount;
    }
  });

  const totalExpense = Object.values(grouped).reduce(
    (sum, val) => sum + val,
    0
  );

  const data = Object.keys(grouped)
    .map((cat) => ({
      category: cat,
      amount: grouped[cat],
      percent:
        totalExpense > 0
          ? ((grouped[cat] / totalExpense) * 100).toFixed(0)
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  /* ================= COLORS ================= */
  const COLORS = [
    "#f97316", // orange
    "#ef4444", // red
    "#22c55e", // green
    "#64748b", // gray
    "#a855f7", // purple
    "#0ea5e9", // blue
    "#eab308", // yellow
  ];

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Category Breakdown</h3>

      <div className={styles.list}>
        {data.map((item, index) => (
          <div key={index} className={styles.row}>
            
            {/* TOP LINE */}
            <div className={styles.top}>
              <div className={styles.left}>
                <span
                  className={styles.dot}
                  style={{
                    background: COLORS[index % COLORS.length],
                  }}
                />
                <span className={styles.name}>
                  {item.category}
                </span>
              </div>

              <div className={styles.right}>
                <span className={styles.percent}>
                  {item.percent}%
                </span>
                <span className={styles.amount}>
                  ₹{item.amount}
                </span>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className={styles.bar}>
              <div
                className={styles.fill}
                style={{
                  width: `${item.percent}%`,
                  background:
                    COLORS[index % COLORS.length],
                }}
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;