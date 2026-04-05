import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import FinancialInsights from "../components/insights/FinancialInsights";
import CategoryBreakdown from "../components/insights/CategoryBreakdown";
import MonthlyTrend from "../components/insights/MonthlyTrend";
import NetBalanceChart from "../components/insights/NetBalanceChart";

import styles from "../styles/Insights.module.css";

const Insights = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          
          {/* TOP GRID */}
          <div className={styles.gridTop}>
            <FinancialInsights />
            <CategoryBreakdown />
          </div>

          {/* BOTTOM GRID */}
          <div className={styles.gridBottom}>
            <MonthlyTrend />
            <NetBalanceChart />
          </div>

        </div>
      </div>
    </>
  );
};

export default Insights;