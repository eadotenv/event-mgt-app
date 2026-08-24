import { IoClose, IoCall, IoMail, IoLogoWhatsapp } from "react-icons/io5";
import type { Vendor } from "../entities/Vendor";
import "../css/contact-modal.css";

interface Props {
  vendor: Vendor;
  onClose: () => void;
}

function ContactModal({ vendor, onClose }: Props) {
  const phone = "+233 20 123 4567";
  const email = `${vendor.name.toLowerCase().replace(/\s+/g, ".")}@example.com`;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <h3>Contact {vendor.name}</h3>
          <button className="contact-modal-close" onClick={onClose}>
            <IoClose size={22} />
          </button>
        </div>
        <div className="contact-modal-body">
          <div className="contact-option">
            <div className="contact-icon contact-icon-call">
              <IoCall size={20} />
            </div>
            <div className="contact-info">
              <p className="contact-label">Call</p>
              <p className="contact-value">{phone}</p>
            </div>
          </div>
          <div className="contact-option">
            <div className="contact-icon contact-icon-email">
              <IoMail size={20} />
            </div>
            <div className="contact-info">
              <p className="contact-label">Email</p>
              <p className="contact-value">{email}</p>
            </div>
          </div>
          <div className="contact-option">
            <div className="contact-icon contact-icon-whatsapp">
              <IoLogoWhatsapp size={20} />
            </div>
            <div className="contact-info">
              <p className="contact-label">WhatsApp</p>
              <p className="contact-value">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
