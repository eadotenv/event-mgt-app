import { useState } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { FaChevronLeft } from "react-icons/fa";
import type { ValuePiece } from "./Upcoming";
import type { EventData } from "../entities/EventData";
import { IoClose } from "react-icons/io5";

interface Props {
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onSave: (value: Partial<EventData>) => void;
}
function EventDate({ onNext, onBack, onSave, onClose }: Props) {
  // const [date, setDate] = useState("");
  const [range, setRange] = useState<ValuePiece | undefined>(null);

  const handleDayClick = (date: Date) => {
    if (!range) {
      setRange(date);
    } else if (range instanceof Date) {
      setRange([range, date]);
    } else {
      setRange(date);
    }
  };

  const handleSubmit = () => {
    onSave({ date: range });
    onNext();
  };
  return (
    <div className="title">
      <div className="title-box">
        <div className="date-box">
          <h4 className="title-head">When will this Event happen?</h4>
          <p className="example-text">
            If the event will take place in multiple days, <br />
            you can tap on multiple days
          </p>

          <Calendar
            selectRange
            showNeighboringMonth={false}
            prev2Label={null}
            next2Label={null}
            onClickDay={handleDayClick}
            value={range}
            tileClassName="cal-color"
            onChange={(value) => setRange(value as [Date, Date])}
            className="cal"
          />

          <div className="">
            {range ? (
              range instanceof Date ? (
                <p className="example-text">{format(range, "do MMM yyyy")}</p>
              ) : (
                <p className="example-text">
                  {range[0].getMonth() === range[1].getMonth()
                    ? `${format(range[0], "do")} – ${format(
                        range[1],
                        "do MMM yyyy",
                      )}`
                    : `${format(range[0], "do MMM yyyy")} – ${format(
                        range[1],
                        "do MMM yyyy",
                      )}`}
                </p>
              )
            ) : (
              <p className="example-text">No date selected</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="left-btn"
          aria-label="Close"
        >
          <FaChevronLeft size={16} className="left-btn-icon" />
        </button>
        <button
          className={`${!range ? "title-disable" : "title-btn"}`}
          onClick={handleSubmit}
          disabled={!range}
        >
          Next
        </button>

        <button
          type="button"
          className="title-close-btn"
          aria-label="Close"
          onClick={onClose}
        >
          <IoClose size={20} className="close-btn-icon" />
        </button>
      </div>
    </div>
  );
}

export default EventDate;
