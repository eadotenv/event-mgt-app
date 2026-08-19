import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/navbar.css";
import { FaHouse } from "react-icons/fa6";
import { IoMenuOutline, IoLogOutOutline } from "react-icons/io5";

interface Tab {
  name: string;
}

interface Props {
  tabs?: Tab[];
  active?: number;
  setActive?: (value: number) => void;
  header: string;
  onToggleSidebar?: () => void;
}

function NavBar({ tabs = [], active = 0, setActive, header, onToggleSidebar }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;
  const isHome = location.pathname === "/page-layout";

  const handleLogout = () => {
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      {!isHome && (
        <Link
          to="/page-layout"
          state={{ user }}
          className="navbar-home"
          aria-label="Go to homepage"
          title="Home"
        >
          <FaHouse size={16} />
        </Link>
      )}
      <h3 className="nav-header">{header}</h3>
      <ul className="nav-list">
        {tabs.map((tab, index) => (
          <li key={index} className="nav-item">
            <button
              className={active === index ? "nav-link active" : "nav-link"}
              onClick={() => setActive?.(index)}
              aria-current="page"
            >
              {tab.name}
            </button>
          </li>
        ))}
      </ul>
      <div className="navbar-actions">
        {onToggleSidebar && (
          <button
            type="button"
            className="navbar-toggle"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
            onClick={onToggleSidebar}
          >
            <IoMenuOutline size={22} />
          </button>
        )}
        <button
          type="button"
          className="navbar-hamburger"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <IoMenuOutline size={22} />
        </button>
        {mobileMenuOpen && (
          <>
            <div
              className="mobile-menu-backdrop"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="mobile-menu-dropdown">
              <Link
                to="/page-layout"
                state={{ user }}
                className="mobile-menu-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHouse size={18} />
                <span>Home</span>
              </Link>
              <button className="mobile-menu-item" onClick={handleLogout}>
                <IoLogOutOutline size={18} />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
