import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import styles from "./Navbar.module.css";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slices/uiSlice";

const users = [
  {
    name: "Shashank Sarth Verma",
    role: "Employee",
  },
  {
    name: "Raj Kishor Pattnaik",
    role: "Admin",
  },
];

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ui.currentUser);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={styles.navbar}>
      {/* LEFT */}
      <div className={styles.left}>
        {/* MOBILE HAMBURGER */}
        {!isSidebarOpen && (
          <button
            className={styles.menuButton}
            onClick={toggleSidebar}
          >
            <Menu size={20} className={styles.menuIcon} />
          </button>
        )}

        <h2 className={styles.logo}>FinTrack</h2>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <button onClick={toggleTheme} className={styles.themeBtn}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className={styles.profileWrapper}>
          <div
            className={styles.profile}
            onClick={() => setOpen(!open)}
          >
            <div className={styles.avatar}>
              {currentUser.name[0]}
            </div>

            <div className={styles.profileInfo}>
              <span className={styles.name}>
                {currentUser.name}
              </span>
              <span className={styles.role}>
                {currentUser.role}
              </span>
            </div>

            <span
              className={`${styles.chevron} ${
                open ? styles.rotate : ""
              }`}
            >
              ▼
            </span>
          </div>

          {open && (
            <div className={styles.dropdown}>
              {users.map((user, index) => (
                <div
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => {
                  dispatch(setUser(user)); // 🔥 store in redux
                  setOpen(false);
                }}
                >
                  <div className={styles.avatarSmall}>
                    {user.name[0]}
                  </div>

                  <div className={styles.dropdownInfo}>
                    <div className={styles.name}>
                      {user.name}
                    </div>
                    <div className={styles.role}>
                      {user.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;