import styles from "./SummaryCard.module.css";

const SummaryCard = ({ title, amount, type }) => {
  return (
    <div className={`${styles.card} ${styles[type]}`}>
      <div className={styles.title}>{title}</div>

      <div className={styles.amount}>
        ₹ {amount.toLocaleString()}
      </div>

      <div className={styles.subtext}>
        {type === "income" && "Money earned"}
        {type === "expense" && "Money spent"}
        {type === "balance" && "Available balance"}
      </div>
    </div>
  );
};

export default SummaryCard;