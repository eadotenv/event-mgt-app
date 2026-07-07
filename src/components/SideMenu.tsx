import type { IconType } from "react-icons";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import type { User } from "../entities/User";

interface Menu {
  label: string;
  path: string;
  icon: IconType;
}

interface Props {
  menu: Menu[];
  active: number;
  setActive: (num: number) => void;
  user: User;
}

function SideMenu({ menu, active, setActive, user }: Props) {
  return (
    <aside className="side-menu">
      <nav className="side-nav">
        <ul className="side-list">
          {menu.map((item, index) => (
            <li
              key={index}
              className={active === index ? "menu menu-active" : "menu"}
              onClick={() => setActive(index)}
            >
              <Link
                to={`${item.path}`}
                state={{ user }}
                className="side-list-nav-link"
              >
                <item.icon size={18} className="service-icon" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bottom-menu-container">
        <div className="provider-box">
          <h3 className="provider-head">Are you a service provider?</h3>
          <button className="login-btn">Start listing</button>
        </div>
        <div className="name-settings">
          <div className="name-div">
            <h2 className="name-head">
              {user?.firstname.charAt(0).toUpperCase()}
            </h2>
            <span className="full-name">
              {user?.firstname.charAt(0).toUpperCase() +
                user?.firstname.slice(1)}{" "}
              {user?.lastname.charAt(0).toUpperCase() + user?.lastname.slice(1)}
            </span>
          </div>
          <div className="settings">
            <IoSettingsOutline size={22} />
            <span className="settings-text">Settings</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideMenu;
