import { useSelector, useDispatch } from "react-redux";
import {
  updateTransaction,
  deleteTransaction,
  addTransaction,
} from "../../store/slices/financeSlice";
import { useState } from "react";

import { Pencil, Trash2, Plus } from "lucide-react";
import styles from "./TransactionTable.module.css";

import TransactionModal from "../modal/TransactionModal";

const TransactionTable = ({ limit }) => {
  const transactions = useSelector((state) => state.finance.transactions);
  const role = useSelector((state) => state.ui.role);

  const dispatch = useDispatch();

  /* ================= MODAL ================= */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  /* ================= FILTER ================= */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* ================= SORT ================= */
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "desc" };
    });
  };

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  /* ================= FILTER + SORT ================= */
  let filtered = transactions
    .filter((tx) => {
      const matchesSearch =
        tx.category.toLowerCase().includes(search.toLowerCase()) ||
        tx.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ? true : tx.type === filter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];

      if (sortConfig.key === "date") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      return sortConfig.direction === "asc"
        ? valueA > valueB
          ? 1
          : -1
        : valueA < valueB
        ? 1
        : -1;
    });

  /* ================= APPLY LIMIT AFTER FILTER ================= */
  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  /* ================= DATE ================= */
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className={styles.container}>
      
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <h3>Transactions</h3>

        {role === "Admin" && (
          <button
            className={styles.addBtn}
            onClick={() => {
              setEditData(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.select}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* TABLE */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort("date")}>
              Date {getArrow("date")}
            </th>
            <th>Category</th>
            <th>Description</th>
            <th>Type</th>
            <th onClick={() => handleSort("amount")}>
              Amount {getArrow("amount")}
            </th>
            {role === "Admin" && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {filtered.map((tx) => (
            <tr key={tx.id}>
              <td>{formatDate(tx.date)}</td>

              <td>{tx.category}</td>

              <td className={styles.description}>
                {tx.description}
              </td>

              <td>
                <span
                  className={`${styles.type} ${
                    tx.type === "income"
                      ? styles.income
                      : styles.expense
                  }`}
                >
                  {tx.type}
                </span>
              </td>

              <td
                className={
                  tx.type === "income"
                    ? styles.amountIncome
                    : styles.amountExpense
                }
              >
                {tx.type === "income" ? "+" : "-"}₹{tx.amount}
              </td>

              {role === "Admin" && (
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => {
                        setEditData(tx);
                        setIsModalOpen(true);
                      }}
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      className={styles.iconBtn}
                      onClick={() =>
                        dispatch(deleteTransaction(tx.id))
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editData}
        onSave={(data) => {
          if (editData) {
            dispatch(updateTransaction({ ...data, id: editData.id }));
          } else {
            dispatch(addTransaction(data));
          }
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default TransactionTable;