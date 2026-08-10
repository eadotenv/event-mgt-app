import { Link, useLocation } from "react-router-dom";
import {
  MdEvent,
  MdMiscellaneousServices,
  MdNotificationsActive,
} from "react-icons/md";
import { useEffect, useState } from "react";

import "../css/SideBar.css";
import SideCircle from "./SideCircle";
import SideMenu from "./SideMenu";
import type { User } from "../entities/User";

interface Props {
  showModal: boolean;
  step: number;
  user: User;
  collapsed: boolean;
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}

function SideBar({
  showModal,
  step,
  user,
  collapsed,
  drawerOpen,
  onCloseDrawer,
}: Props) {
  const [active, setActive] = useState(-1);
  const menu = [
    { label: "Events", path: "event", icon: MdEvent },
    { label: "Services", path: "services", icon: MdMiscellaneousServices },
    {
      label: "Notifications",
      path: "notifications",
      icon: MdNotificationsActive,
    },
  ];

  const location = useLocation();
  const isDetails = location.pathname.includes("/details/");

  const [mobileScreen, setMobileScreen] = useState(window.innerWidth <= 991);

  useEffect(() => {
    const handleResize = () => setMobileScreen(window.innerWidth <= 991);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderSideMenu = () => (
    <SideMenu
      menu={menu}
      user={user}
      active={active}
      setActive={setActive}
      onNavigate={onCloseDrawer}
    />
  );

  if (mobileScreen) {
    if (showModal) {
      return (
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
      );
    }
    if (isDetails) {
      return (
        <>
          <div
            className={drawerOpen ? "side-drawer open" : "side-drawer"}
            aria-hidden={!drawerOpen}
          >
            <div className="side-bar drawer-bar">
              <Link
                to="/page-layout"
                className="home-link"
                state={{ user }}
                onClick={() => setActive(-1)}
              >
                <h3 className="menu-header">Planlite</h3>
              </Link>
              {renderSideMenu()}
            </div>
          </div>
          {drawerOpen && (
            <div
              className="drawer-backdrop"
              onClick={onCloseDrawer}
              aria-hidden="true"
            />
          )}
        </>
      );
    }
    // non-details mobile pages keep the bottom nav
    return (
      <div className="side-bar">
        <Link
          to="/page-layout"
          className="home-link"
          state={{ user }}
          onClick={() => setActive(-1)}
        >
          <h3 className="menu-header">Planlite</h3>
        </Link>
        {showModal ? <SideCircle step={step} /> : renderSideMenu()}
      </div>
    );
  }

  return (
    <div className={collapsed ? "side-bar collapsed" : "side-bar"}>
      <Link
        to="/page-layout"
        className="home-link"
        state={{ user }}
        onClick={() => setActive(-1)}
      >
        <h3 className="menu-header">Planlite</h3>
      </Link>
      {showModal ? <SideCircle step={step} /> : renderSideMenu()}
    </div>
  );
}

export default SideBar;
