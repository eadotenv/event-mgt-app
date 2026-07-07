import { MdRadioButtonUnchecked } from "react-icons/md";
import { GoCheckCircle } from "react-icons/go";

interface Props {
  step: number;
}

function SideCircle({ step }: Props) {
  return (
    <aside className="btn-box">
      {step === 1 ? (
        <div className="radio-text">
          <MdRadioButtonUnchecked size={28} className="" />
          <p className="">Event Title</p>
        </div>
      ) : step === 2 ? (
        <div>
          <div className="radio-text">
            <GoCheckCircle size={28} className="" />
            <p className="">Event Title</p>
          </div>
          <div className="radio-text">
            <MdRadioButtonUnchecked size={28} className="" />
            <p className="">Details</p>
          </div>
        </div>
      ) : step === 3 ? (
        <div>
          <div className="radio-text">
            <GoCheckCircle size={28} className="" />
            <p className="">EventTitle</p>
          </div>
          <div className="radio-text">
            <GoCheckCircle size={28} className="" />
            <p className="">Details</p>
          </div>
          <div className="radio-text">
            <MdRadioButtonUnchecked size={28} className="" />
            <p className="">Location</p>
          </div>
        </div>
      ) : step > 3 ? (
        <div>
          <div className="radio-text">
            <GoCheckCircle size={28} className="" />
            <p className="">EventTitle</p>
          </div>
          <div className="radio-text">
            <GoCheckCircle size={28} className="" />
            <p className="">Details</p>
          </div>
          <div className="radio-text">
            <GoCheckCircle size={28} className="me-2" />
            <p className="">Location</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </aside>
  );
}

export default SideCircle;
