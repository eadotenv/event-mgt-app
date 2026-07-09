import { useState } from "react";
import { IoClose } from "react-icons/io5";
import type { ChecklistItem } from "../entities/EventData";

interface Props {
  items: ChecklistItem[];
  setItem: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  setShowChecklistModal: (val: boolean) => void;
  handleSaveAllDetails: () => void;
}

function CheckModal({
  setItem,
  setShowChecklistModal,
  handleSaveAllDetails,
}: Props) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newItem: ChecklistItem = {
      itemId: Date.now().toString(),
      item: inputValue,
      isDone: false,
    };

    setItem((prevItems) => [...prevItems, newItem]);

    setTimeout(() => {
      handleSaveAllDetails();
      setShowChecklistModal(false);
    }, 50);
  };

  return (
    <div className="checklist-modal">
      <form className="mod-form" onSubmit={handleSubmit}>
        <div className="header-close-btn">
          <h3 className="check-header">Checklist</h3>
          <IoClose size={22} onClick={() => setShowChecklistModal(false)} />
        </div>
        <div className="check-modal-form-input">
          <label htmlFor="check-mod" className="check-modal-label">
            Item
          </label>
          <input
            id="check-mod"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="check-modal-input"
            placeholder="enter an item"
            autoFocus
          />
        </div>
        <button type="submit" className="mod-btn mod-save-btn">
          Save
        </button>
        <button type="button" className="mod-btn mod-del-btn">
          Delete
        </button>
      </form>
    </div>
  );
}

export default CheckModal;
