import { useState } from "react";
import { IoClose, IoChevronBack, IoChevronForward, IoBookOutline, IoPencil, IoTrash } from "react-icons/io5";
import type { Vendor } from "../entities/Vendor";
import "../css/vendor-detail-modal.css";

interface Props {
  vendor: Vendor;
  onClose: () => void;
  onAddToEvent: (vendor: Vendor) => void;
  onContact: (vendor: Vendor) => void;
}

function VendorDetailModal({ vendor, onClose, onAddToEvent, onContact }: Props) {
  const [activeTab, setActiveTab] = useState<"details" | "notes">("details");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editInput, setEditInput] = useState("");

  const images = vendor.images && vendor.images.length > 0 ? vendor.images : [vendor.image];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddNote = () => {
    if (noteInput.trim()) {
      setNotes([...notes, noteInput.trim()]);
      setNoteInput("");
    }
  };

  const handleEditNote = (index: number) => {
    setEditingIndex(index);
    setEditInput(notes[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editInput.trim()) {
      const updatedNotes = [...notes];
      updatedNotes[editingIndex] = editInput.trim();
      setNotes(updatedNotes);
      setEditingIndex(null);
      setEditInput("");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditInput("");
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div className="vendor-modal-overlay" onClick={onClose}>
      <div className="vendor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="vendor-modal-header">
          <div className="vendor-modal-tabs">
            <button
              className={`vendor-modal-tab ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`vendor-modal-tab ${activeTab === "notes" ? "active" : ""}`}
              onClick={() => setActiveTab("notes")}
            >
              Notes
            </button>
          </div>
          <button className="vendor-modal-close" onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        {activeTab === "details" ? (
          <div className="vendor-modal-content">
            <div className="vendor-modal-image-section">
              <img
                src={images[currentImageIndex]}
                alt={vendor.name}
                className="vendor-modal-image"
              />
              {images.length > 1 && (
                <>
                  <button className="vendor-modal-nav vendor-modal-nav-prev" onClick={handlePrevImage}>
                    <IoChevronBack size={24} />
                  </button>
                  <button className="vendor-modal-nav vendor-modal-nav-next" onClick={handleNextImage}>
                    <IoChevronForward size={24} />
                  </button>
                  <div className="vendor-modal-image-counter">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            <div className="vendor-modal-details">
              <h2 className="vendor-modal-title">{vendor.name}</h2>
              <p className="vendor-modal-rate">GHS {vendor.rate.toLocaleString()}</p>
              <p className="vendor-modal-owner">by {vendor.owner}</p>
              <p className="vendor-modal-location">{vendor.location}</p>
              <p className="vendor-modal-description">{vendor.description}</p>
            </div>

            <div className="vendor-modal-actions">
              <button className="vendor-modal-btn vendor-modal-btn-primary" onClick={() => onAddToEvent(vendor)}>
                Add to Event
              </button>
              <button className="vendor-modal-btn vendor-modal-btn-secondary" onClick={() => onContact(vendor)}>
                Contact
              </button>
            </div>
          </div>
        ) : (
          <div className="vendor-modal-content">
            <div className="vendor-modal-notes-section">
              <label className="vendor-modal-notes-label">Note</label>
              <textarea
                className="vendor-modal-notes-textarea"
                placeholder="type notes here"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
              />
              <button
                className="vendor-modal-notes-add-btn"
                disabled={!noteInput.trim()}
                onClick={handleAddNote}
              >
                Add
              </button>

              {notes.length === 0 ? (
                <div className="vendor-modal-notes-empty">
                  <IoBookOutline size={48} className="vendor-modal-notes-empty-icon" />
                  <h3 className="vendor-modal-notes-empty-title">No notes found for this service</h3>
                  <p className="vendor-modal-notes-empty-text">
                    You can add notes of how things, to remember about this service.
                  </p>
                </div>
              ) : (
                <ul className="vendor-modal-notes-list">
                  {notes.map((note, index) => (
                    <li key={index} className="vendor-modal-notes-item">
                      {editingIndex === index ? (
                        <div className="vendor-modal-note-edit">
                          <textarea
                            className="vendor-modal-note-edit-textarea"
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            autoFocus
                          />
                          <div className="vendor-modal-note-edit-actions">
                            <button
                              className="vendor-modal-note-edit-save"
                              onClick={handleSaveEdit}
                              disabled={!editInput.trim()}
                            >
                              Save
                            </button>
                            <button
                              className="vendor-modal-note-edit-cancel"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="vendor-modal-note-text">{note}</span>
                          <div className="vendor-modal-note-actions">
                            <button
                              className="vendor-modal-note-action-btn"
                              onClick={() => handleEditNote(index)}
                              title="Edit note"
                            >
                              <IoPencil size={14} />
                            </button>
                            <button
                              className="vendor-modal-note-action-btn vendor-modal-note-action-delete"
                              onClick={() => handleDeleteNote(index)}
                              title="Delete note"
                            >
                              <IoTrash size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorDetailModal;
