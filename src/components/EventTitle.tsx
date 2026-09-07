import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  onClose: () => void;
  onNext: () => void;
  onSave: (data: { title: string }) => void;
}

function EventTitle({ onClose, onNext, onSave }: Props) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    onSave({ title });
    onNext();
  };
  return (
    <div className="title">
      <div className="title-box">
        <button
          type="button"
          className="title-close-btn"
          aria-label="Close"
          onClick={onClose}
        >
          <IoClose size={20} className="close-btn-icon" />
        </button>
        <div className="title-header">
          <h2 className="title-head">Event title</h2>
          <p className="example-text">
            Eg. Nana's wedding, Our 10 years anniversary
            <br />
            or Josephine's birthday party etc
          </p>
        </div>
        <input
          type="text"
          placeholder="Start typing..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
        <button
          className={`${!title ? "title-disable" : "title-btn"}`}
          disabled={!title}
          onClick={handleSubmit}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default EventTitle;
