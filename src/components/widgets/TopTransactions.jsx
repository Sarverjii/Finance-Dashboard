import { useSelector } from "react-redux";
import styles from "./TopTransactions.module.css";

const TopTransactions = () => {
  const transactions = useSelector((state) => state.finance.transactions);

  const incomes = transactions.filter((t) => t.type === "income");
  const expenses = transactions.filter((t) => t.type === "expense");

  const highestIncome =
    incomes.length > 0
      ? incomes.reduce((max, t) =>
          t.amount > max.amount ? t : max
        )
      : null;

  const largestExpense =
    expenses.length > 0
      ? expenses.reduce((max, t) =>
          t.amount > max.amount ? t : max
        )
      : null;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>TOP TRANSACTIONS</h3>

      <div className={styles.list}>
        
        {/* HIGHEST INCOME */}
        {highestIncome && (
          <div className={styles.item}>
            <div className={styles.left}>
              <div className={styles.label}>Highest Income</div>
              <div className={styles.category}>
                {highestIncome.category}
              </div>
              <div className={styles.desc}>
                {highestIncome.description || "—"}
              </div>
            </div>

            <div className={styles.income}>
              +₹{highestIncome.amount}
            </div>
          </div>
        )}

        {/* LARGEST EXPENSE */}
        {largestExpense && (
          <div className={styles.item}>
            <div className={styles.left}>
              <div className={styles.label}>Largest Expense</div>
              <div className={styles.category}>
                {largestExpense.category}
              </div>
              <div className={styles.desc}>
                {largestExpense.description || "—"}
              </div>
            </div>

            <div className={styles.expense}>
              -₹{largestExpense.amount}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TopTransactions;