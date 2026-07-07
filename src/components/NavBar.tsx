// import { useState } from "react";
import "../css/navbar.css";

interface Tab {
  name: string;
}

interface Props {
  tabs: Tab[];
  active: number;
  setActive: (value: number) => void;
  header: string;
}

function NavBar({ tabs, active, setActive, header }: Props) {
  return (
    <>
      <nav className="navbar">
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
      </nav>
    </>
  );
}

export default NavBar;
