import { useState } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
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
  const [notes, setNotes] = useState("");

  const images = vendor.images && vendor.images.length > 0 ? vendor.images : [vendor.image];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
              <textarea
                className="vendor-modal-notes-textarea"
                placeholder="Add your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorDetailModal;
