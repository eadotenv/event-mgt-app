import { Link, useLocation } from "react-router-dom";
import "../css/navbar.css";
import { FaHouse } from "react-icons/fa6";
import { IoMenuOutline } from "react-icons/io5";

interface Tab {
  name: string;
}

interface Props {
  tabs: Tab[];
  active: number;
  setActive: (value: number) => void;
  header: string;
  onToggleSidebar?: () => void;
}

function NavBar({ tabs, active, setActive, header, onToggleSidebar }: Props) {
  const location = useLocation();
  const user = location.state?.user;

  return (
    <nav className="navbar">
      <Link
        to="/page-layout"
        state={{ user }}
        className="navbar-home"
        aria-label="Go to homepage"
        title="Home"
      >
        <FaHouse size={16} />
      </Link>
      <h3 className="nav-header">{header}</h3>
      <ul className="nav-list">
        {tabs.map((tab, index) => (
          <li key={index} className="nav-item">
            <button
              className={active === index ? "nav-link active" : "nav-link"}
              onClick={() => setActive(index)}
              aria-current="page"
            >
              {tab.name}
            </button>
          </li>
        ))}
      </ul>
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
    </nav>
  );
}

export default NavBar;
