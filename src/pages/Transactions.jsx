import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import TransactionTable from "../components/transactions/TransactionTable";

const Transactions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="mainContent">
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(true)}
          isSidebarOpen={isSidebarOpen}
        />

        <div style={{ padding: "20px" }}>
          <TransactionTable />
        </div>
      </div>
    </>
  );
};

export default Transactions;