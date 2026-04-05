import { useSelector } from "react-redux";
import styles from "./RecentTransactions.module.css";

const RecentTransactions = () => {
  const transactions = useSelector((state) => state.finance.transactions);

  const latest = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>RECENT TRANSACTIONS</h3>

      <div className={styles.list}>
        {latest.map((tx) => (
          <div key={tx.id} className={styles.item}>
            
            {/* LEFT */}
            <div className={styles.left}>
              <div className={styles.category}>
                {tx.category}
              </div>
              <div className={styles.date}>
                {formatDate(tx.date)}
              </div>
            </div>

            {/* RIGHT */}
            <div
              className={
                tx.type === "income"
                  ? styles.income
                  : styles.expense
              }
            >
              {tx.type === "income" ? "+" : "-"}₹{tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;