import { useState, useEffect } from "react";
import styles from "./TransactionModal.module.css";

const TransactionModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    date: "",
    category: "",
    description: "",
    type: "expense",
    amount: "",
  });

  const [errors, setErrors] = useState({});

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        date: new Date().toISOString().slice(0, 16),
        category: "",
        description: "",
        type: "expense",
        amount: "",
      });
    }
    setErrors({});
  }, [initialData]);

  if (!isOpen) return null;

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!form.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    }

    if (!form.amount || form.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  /* ================= UI ================= */
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{initialData ? "Edit" : "Add"} Transaction</h3>

        {/* DATE */}
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
          className={errors.date ? styles.errorInput : ""}
        />
        {errors.date && <span className={styles.error}>{errors.date}</span>}

        {/* CATEGORY */}
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          className={errors.category ? styles.errorInput : ""}
        />
        {errors.category && (
          <span className={styles.error}>{errors.category}</span>
        )}

        {/* DESCRIPTION */}
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className={errors.description ? styles.errorInput : ""}
        />
        {errors.description && (
          <span className={styles.error}>{errors.description}</span>
        )}

        {/* TYPE */}
        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: +e.target.value })
          }
          className={errors.amount ? styles.errorInput : ""}
        />
        {errors.amount && (
          <span className={styles.error}>{errors.amount}</span>
        )}

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;