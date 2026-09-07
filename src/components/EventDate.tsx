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

  const formatSelectedDate = () => {
    if (!range) return "No date selected";
    if (range instanceof Date) {
      return format(range, "do MMMM, yyyy");
    }
    if (range[0].getMonth() === range[1].getMonth()) {
      return `${format(range[0], "do")} – ${format(range[1], "do MMMM, yyyy")}`;
    }
    return `${format(range[0], "do MMMM, yyyy")} – ${format(range[1], "do MMMM, yyyy")}`;
  };

  return (
    <div className="title">
      <div className="title-box">
        <button
          type="button"
          onClick={onBack}
          className="date-back-btn"
          aria-label="Go back"
        >
          <FaChevronLeft size={20} />
        </button>

        <button
          type="button"
          className="title-close-btn"
          aria-label="Close"
          onClick={onClose}
        >
          <IoClose size={20} className="close-btn-icon" />
        </button>

        <div className="date-header">
          <h2 className="title-head">When will this event happen?</h2>
          <p className="example-text">
            If the event will take place on multiple days,
            <br />
            you can tap on multiples dates
          </p>
        </div>

        <div className="calendar-wrapper">
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
        </div>

        <p className="selected-date-text">{formatSelectedDate()}</p>

        <button
          className={`${!range ? "title-disable" : "title-btn"}`}
          onClick={handleSubmit}
          disabled={!range}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default EventDate;
