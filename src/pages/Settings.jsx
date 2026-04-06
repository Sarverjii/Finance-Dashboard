import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import {
  addCategory,
  removeCategory,
} from "../store/slices/categorySlice";

import {
  setBudget,
  createCategoryBudget, // ✅ FIXED IMPORT
} from "../store/slices/budgetSlice";

import styles from "../styles/Settings.module.css";

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const categoryListRef = useRef(null);
  const budgetListRef = useRef(null);

  const categories = useSelector((state) => state.category.categories);
  const budgets = useSelector((state) => state.budget.budgets);

  const dispatch = useDispatch();

  /* ================= ADD CATEGORY ================= */
  const handleAddCategory = () => {
    if (!newCategory.trim() || categories.includes(newCategory)) return;

    const name = newCategory.trim();

    dispatch(addCategory(name));
    dispatch(createCategoryBudget(name)); // ✅ FIXED

    setNewCategory("");

    setTimeout(() => {
      categoryListRef.current?.scrollTo({
        top: categoryListRef.current.scrollHeight,
        behavior: "smooth",
      });

      budgetListRef.current?.scrollTo({
        top: budgetListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  /* ================= REMOVE ================= */
  const handleDelete = (category) => {
    dispatch(removeCategory(category));
  };

  /* ================= UPDATE ================= */
  const handleBudgetChange = (category, type, value) => {
    dispatch(
      setBudget({
        category,
        type,
        amount: Number(value),
      })
    );
  };

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="mainContent">
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(true)}
          isSidebarOpen={isSidebarOpen}
        />

        <div className={styles.container}>
          <h2 className={styles.title}>Settings</h2>

          <div className={styles.grid}>
            
            {/* ================= CATEGORIES ================= */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Categories</h3>

              <div className={styles.addRow}>
                <input
                  placeholder="e.g. Travel"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={handleAddCategory}>Add</button>
              </div>

              <div className={styles.list} ref={categoryListRef}>
                {categories.map((cat, index) => (
                  <div key={index} className={styles.listItem}>
                    <span>{cat}</span>
                    <button onClick={() => handleDelete(cat)}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= BUDGETS ================= */}
            <div className={styles.card}> {/* ✅ FIXED CARD WRAPPER */}
              <h3 className={styles.cardTitle}>Budgets</h3>

              <div className={styles.list} ref={budgetListRef}>
                {categories.map((cat, index) => (
                  <div key={index} className={styles.budgetRow}>
                    <span className={styles.catName}>{cat}</span>

                    <div className={styles.budgetInputs}>
                      <input
                        type="number"
                        placeholder="W"
                        value={budgets[cat]?.weekly || ""}
                        onChange={(e) =>
                          handleBudgetChange(cat, "weekly", e.target.value)
                        }
                      />

                      <input
                        type="number"
                        placeholder="M"
                        value={budgets[cat]?.monthly || ""}
                        onChange={(e) =>
                          handleBudgetChange(cat, "monthly", e.target.value)
                        }
                      />

                      <input
                        type="number"
                        placeholder="Y"
                        value={budgets[cat]?.yearly || ""}
                        onChange={(e) =>
                          handleBudgetChange(cat, "yearly", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;