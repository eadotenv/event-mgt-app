import { useState } from "react";
import { IoClose } from "react-icons/io5";
import type { ProgramItem } from "../entities/EventData";

interface Props {
  program: ProgramItem[];
  setProgram: React.Dispatch<React.SetStateAction<ProgramItem[]>>;
  setShowProgramModal: (val: boolean) => void;
  handleSaveProgram: (updatedProgram: ProgramItem[]) => void;
}

function ProgramModal({
  program,
  setProgram,
  setShowProgramModal,
  handleSaveProgram: saveProgram,
}: Props) {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !time.trim()) return;

    const newItem: ProgramItem = {
      itemId: Date.now().toString(),
      time,
      title,
      name,
    };

    const updatedProgram = [...program, newItem];
    setProgram(updatedProgram);
    saveProgram(updatedProgram);
    setShowProgramModal(false);
  };

  return (
    <div className="checklist-modal">
      <form className="mod-form" onSubmit={handleSubmit}>
        <div className="header-close-btn">
          <h3 className="check-header">Program Lineup</h3>
          <IoClose size={22} onClick={() => setShowProgramModal(false)} />
        </div>
        <div className="check-modal-form-input">
          <label htmlFor="program-title" className="check-modal-label">
            Title
          </label>
          <input
            id="program-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="check-modal-input"
            placeholder="e.g. Opening remarks"
            autoFocus
          />
        </div>
        <div className="check-modal-form-input">
          <label htmlFor="program-name" className="check-modal-label">
            Name
          </label>
          <input
            id="program-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="check-modal-input"
            placeholder="e.g. MC Kwame"
          />
        </div>
        <div className="check-modal-form-input">
          <label htmlFor="program-time" className="check-modal-label">
            Time
          </label>
          <input
            id="program-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="check-modal-input"
          />
        </div>
        <button type="submit" className="mod-btn mod-save-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default ProgramModal;
