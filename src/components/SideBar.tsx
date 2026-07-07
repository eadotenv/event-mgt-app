import { Link } from "react-router-dom";
import { BsCalendarEventFill } from "react-icons/bs";
import { GrServices } from "react-icons/gr";
import { IoMdNotifications } from "react-icons/io";
import { useEffect, useState } from "react";

import "../css/SideBar.css";
import SideCircle from "./SideCircle";
import SideMenu from "./SideMenu";
import type { User } from "../entities/User";

interface Props {
  showModal: boolean;
  step: number;
  user: User;
  // setShowModal: (val: boolean) => void;
  // setStep: (num: number) => void;
  // onOpen: () => void;
  // onClose: () => void;
  // onNext: () => void;
  // onBack: () => void;
}

function SideBar({ showModal, step, user }: Props) {
  const [active, setActive] = useState(-1);
  const menu = [
    { label: "Events", path: "event", icon: BsCalendarEventFill },
    { label: "Services", path: "services", icon: GrServices },
    { label: "Notifications", path: "notifications", icon: IoMdNotifications },
  ];

  // const location = useLocation();

  // const navigate = useNavigate();
  // const user = location.state?.user;

  const [mobileScreen, setMobileScreen] = useState(window.innerWidth <= 991);

  useEffect(() => {
    const handleResize = () => setMobileScreen(window.innerWidth <= 991);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {showModal && mobileScreen ? (
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
      ) : (
        <div className="side-bar">
          <Link
            to="/page-layout"
            className="home-link"
            state={{ user }}
            onClick={() => setActive(-1)}
          >
            <h3 className="menu-header">Planlite</h3>
          </Link>
          {showModal ? (
            <SideCircle step={step} />
          ) : (
            <SideMenu
              menu={menu}
              user={user}
              active={active}
              setActive={setActive}
            />
          )}
        </div>
      )}
    </>
  );
}

export default SideBar;
