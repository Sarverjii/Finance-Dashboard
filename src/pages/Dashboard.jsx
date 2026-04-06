import { useState } from "react";
import { useSelector } from "react-redux";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import SummaryCard from "../components/cards/SummaryCard";
import CashflowChart from "../components/charts/CashflowChart";
import CategoryChart from "../components/charts/CategoryChart";

import BudgetProgress from "../components/widgets/BudgetProgress";
import RecentTransactions from "../components/widgets/RecentTransactions";
import TopTransactions from "../components/widgets/TopTransactions";

import TransactionTable from "../components/transactions/TransactionTable";
import FinancialInsights from "../components/insights/FinancialInsights";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("monthly");

  const transactions = useSelector((state) => state.finance.transactions);

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

  /* ================= CALCULATIONS ================= */
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

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

        <div style={{ padding: "20px" }}>

          {/* ================= SUMMARY CARDS ================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <SummaryCard
              title="Total Balance"
              amount={balance}
              type="balance"
              filter={filter}
            />
            <SummaryCard
              title="Income"
              amount={income}
              type="income"
              filter={filter}
            />
            <SummaryCard
              title="Expenses"
              amount={expense}
              type="expense"
              filter={filter}
            />
          </div>

          {/* ================= CHARTS ================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "20px",
            }}
          >
            {/* CASHFLOW */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "16px",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
              }}
            >
              <CashflowChart filter={filter} />
            </div>

            {/* CATEGORY */}
            <div
              style={{
                background: "var(--bg-card)",
                padding: "16px",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
              }}
            >
              <CategoryChart filter={filter} />
            </div>
          </div>

          {/* ================= WIDGETS ================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <BudgetProgress filter={filter} />
            <RecentTransactions filter={filter} />
            <TopTransactions filter={filter} />
          </div>

          {/* ================= TABLE + INSIGHTS ================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <TransactionTable limit={6} filter={filter} />
            <FinancialInsights filter={filter} />
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;