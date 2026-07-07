import { useState } from "react";
import SideBar from "./SideBar";
import { Outlet, useLocation } from "react-router-dom";
import "../css/page-layout.css";

function PageLayout() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const location = useLocation();

  // const navigate = useNavigate();
  const user = location.state?.user;

  return (
    <div className="page-layout">
      <div className="page-sidebar">
        <SideBar showModal={showModal} step={step} user={user} />
      </div>
      <div className="page-outlet">
        <Outlet context={{ step, showModal, setShowModal, setStep }} />
      </div>
    </div>
  );
}

export default PageLayout;
