import { IoClose } from "react-icons/io5";

interface Props {
  item: string;
  setItem: React.Dispatch<React.SetStateAction<string>>;
  setShowChecklistModal: (val: boolean) => void;
}

function CheckModal({ item, setItem, setShowChecklistModal }: Props) {
  return (
    <div className="checklist-modal">
      <form className="mod-form">
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
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="check-modal-input"
            placeholder="enter an item"
          />
        </div>
        <button type="submit" className="mod-btn mod-save-btn">
          Save
        </button>
        <button className="mod-btn mod-del-btn">Delete</button>
      </form>
    </div>
  );
}

export default CheckModal;
