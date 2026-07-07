import { FaChevronLeft } from "react-icons/fa";
import type { EventData } from "../entities/EventData";
import { useState } from "react";
import type { ServiceData } from "../entities/ServiceData";
import { IoClose } from "react-icons/io5";

interface Props {
  onBack: () => void;
  onClose: (value?: Partial<EventData>) => void;
  onSave: (value: Partial<EventData>) => void;
}

function EventServices({ onBack, onClose, onSave }: Props) {
  const [services, setServices] = useState<ServiceData>({
    photo: false,
    entertainment: false,
    design: false,
    hiring: false,
    transport: false,
    event: false,
    foodServices: false,
    beautician: false,
  });

  const handleSubmit = () => {
    if (!services) return;

    const finalPayload = {
      services: { ...services },
    };

    onSave(finalPayload);
    onClose(finalPayload);
  };

  return (
    <div className="title">
      <div className="title-box">
        <div className="">
          <h4 className="title-head">What services do you need?</h4>
          <p className="example-text">Select as many as possible</p>
        </div>
        <form className="service-form">
          <div className="servixes service-photo">
            <input
              type="checkbox"
              className="check-input"
              id="photo"
              checked={services.photo}
              onChange={(e) =>
                setServices({ ...services, photo: e.target.checked })
              }
            />
            <label htmlFor="photo">Photography/videography</label>
          </div>
          <div className="servixes service-enter">
            <input
              type="checkbox"
              className="check-input"
              id="enter"
              checked={services.entertainment}
              onChange={(e) =>
                setServices({ ...services, entertainment: e.target.checked })
              }
            />
            <label htmlFor="enter">
              Entertainment(MC/DJ/Band/performer/etc)
            </label>
          </div>
          <div className="servixes service-design">
            <input
              type="checkbox"
              className="check-input"
              id="design"
              checked={services.design}
              onChange={(e) =>
                setServices({ ...services, design: e.target.checked })
              }
            />
            <label htmlFor="design">Decoration/Design</label>{" "}
          </div>
          <div className="servixes service-hiring">
            <input
              type="checkbox"
              className="check-input"
              id="hiring"
              checked={services.hiring}
              onChange={(e) =>
                setServices({ ...services, hiring: e.target.checked })
              }
            />
            <label htmlFor="hiring">Hiring Service</label>{" "}
          </div>
          <div className="servixes service-transport">
            <input
              type="checkbox"
              className="check-input"
              id="transport"
              checked={services.transport}
              onChange={(e) =>
                setServices({ ...services, transport: e.target.checked })
              }
            />
            <label htmlFor="transport">Transportation</label>
          </div>
          <div className="servixes service-event">
            <input
              type="checkbox"
              className="check-input"
              id="event"
              checked={services.event}
              onChange={(e) =>
                setServices({ ...services, event: e.target.checked })
              }
            />
            <label htmlFor="event">Event organiser/planner</label>
          </div>
          <div className="servixes service-food">
            <input
              type="checkbox"
              id="food"
              className="check-input"
              checked={services.foodServices}
              onChange={(e) =>
                setServices({ ...services, foodServices: e.target.checked })
              }
            />
            <label htmlFor="food">Catering/drinks</label>
          </div>
          <div className="servixes service-beauty">
            <input
              type="checkbox"
              className="check-input"
              id="beauty"
              checked={services.beautician}
              onChange={(e) =>
                setServices({ ...services, beautician: e.target.checked })
              }
            />
            <label htmlFor="beauty" className="">
              Beauty and grooming
            </label>
          </div>
        </form>

        <button className="title-btn" onClick={handleSubmit}>
          Submit
        </button>

        <button
          type="button"
          onClick={onBack}
          className="left-btn"
          aria-label="Back"
        >
          <FaChevronLeft size={24} className="left-btn-icon" />
        </button>

        <button
          type="button"
          className="title-close-btn"
          aria-label="Close"
          onClick={() => onClose()}
        >
          <IoClose size={20} className="close-btn-icon" />
        </button>
      </div>
    </div>
  );
}

export default EventServices;
