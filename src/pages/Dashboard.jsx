import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { useSelector } from "react-redux";
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

  const transactions = useSelector((state) => state.finance.transactions);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
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
            <SummaryCard title="Total Balance" amount={balance} type="balance" />
            <SummaryCard title="Income" amount={income} type="income" />
            <SummaryCard title="Expenses" amount={expense} type="expense" />
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
              <h3 style={{ marginBottom: "10px" }}>
                Cashflow Overview
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "10px" }}>
                Income vs Expenses over time
              </p>

              <CashflowChart />
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
              <h3 style={{ marginBottom: "10px" }}>
                Spending Breakdown
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "10px" }}>
                Expenses by category
              </p>

              <CategoryChart />
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            marginTop: "20px"
          }}>
            <BudgetProgress />
            <RecentTransactions />
            <TopTransactions/>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            marginTop: "20px"
          }}>
            
            <TransactionTable limit={6} />
            <FinancialInsights />
          </div>


        </div>
      </div>
    </>
  );
};

export default Dashboard;