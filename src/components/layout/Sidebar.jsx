import styles from "./Sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/" },
  { icon: <Receipt size={20} />, label: "Transactions", path: "/transactions" },
  { icon: <BarChart3 size={20} />, label: "Insights", path: "/insights" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [disableHover, setDisableHover] = useState(false);

  const handleNavigation = (path) => {
    // prevent hover glitch
    setDisableHover(true);

    // smooth close on mobile
    setIsOpen(false);

    setTimeout(() => {
      navigate(path);
      setDisableHover(false);
    }, 200); // smooth UX delay
  };

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`${styles.sidebar} 
        ${isOpen ? styles.open : ""} 
        ${disableHover ? styles.noHover : ""}`}
      >
        {/* LOGO */}
        <div
          className={styles.logo}
          onClick={() => handleNavigation("/")}
        >
          <div className={styles.logoIcon}>F</div>
          <span className={styles.logoText}>FinTrack</span>
        </div>

        {/* MENU */}
        <div className={styles.menu}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <div
                key={index}
                className={`${styles.menuItem} ${
                  isActive ? styles.active : ""
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* SETTINGS */}
        <div className={styles.bottom}>
          <div
            className={`${styles.menuItem} ${
              location.pathname === "/settings" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("/settings")}
          >
            <span className={styles.icon}>
              <Settings size={20} />
            </span>
            <span className={styles.label}>Settings</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;