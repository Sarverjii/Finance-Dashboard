import { useSelector } from "react-redux";
import styles from "./BudgetProgress.module.css";

const BudgetProgress = () => {
  const categories = useSelector((state) => state.category.categories);
  const budgets = useSelector((state) => state.budget.budgets);
  const transactions = useSelector((state) => state.finance.transactions);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>BUDGET PROGRESS</h3>

      <div className={styles.list}>
        {categories.map((cat, index) => {
          const spent = transactions
            .filter(
              (t) => t.category === cat && t.type === "expense"
            )
            .reduce((sum, t) => sum + t.amount, 0);

          const budget = budgets[cat] || 0;

          const percentage =
            budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

          // COLOR LOGIC
          let colorClass = styles.green;
          if (percentage > 80) colorClass = styles.red;
          else if (percentage > 50) colorClass = styles.yellow;

          return (
            <div key={index} className={styles.item}>
              
              {/* TOP ROW */}
              <div className={styles.row}>
                <span>{cat}</span>
                <span>
                  ₹{spent} / ₹{budget}
                </span>
              </div>

              {/* PROGRESS BAR */}
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