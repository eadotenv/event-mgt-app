import { useState } from "react";
import SideBar from "./SideBar";
import { Outlet, useLocation } from "react-router-dom";
import "../css/page-layout.css";

function PageLayout() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const location = useLocation();
  const isDetails = location.pathname.includes("/details/");
  const [collapsed, setCollapsed] = useState<boolean>(isDetails);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [prevIsDetails, setPrevIsDetails] = useState<boolean>(isDetails);

  if (isDetails !== prevIsDetails) {
    setPrevIsDetails(isDetails);
    setCollapsed(isDetails);
    setDrawerOpen(false);
  }

  const user = location.state?.user;

  return (
    <div className={collapsed ? "page-layout collapsed" : "page-layout"}>
      <div className="page-sidebar">
        <SideBar
          showModal={showModal}
          step={step}
          user={user}
          collapsed={collapsed}
          drawerOpen={drawerOpen}
          onCloseDrawer={() => setDrawerOpen(false)}
        />
      </div>
      <div className="page-outlet">
        <Outlet
          context={{
            step,
            showModal,
            setShowModal,
            setStep,
            isDetails,
            collapsed,
            setCollapsed,
            drawerOpen,
            setDrawerOpen,
          }}
        />
      </div>
    </div>
  );
}

export default PageLayout;
