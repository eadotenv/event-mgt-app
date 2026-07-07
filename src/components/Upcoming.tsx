import { useEffect, useState } from "react";
import schedule from "../assets/schedule.png";
import calendar from "../assets/calendar.png";
import EventTitle from "./EventTitle";
import EventDate from "./EventDate";
import EventLocation from "./EventLocation";
import EventServices from "./EventServices";
import axios from "axios";
import { useLocation } from "react-router-dom";
import type { EventData } from "../entities/EventData";
import "../css/home-content.css";
import "../css/upcoming.css";

export type ValuePiece = Date | [Date, Date] | null;

interface Props {
  showModal: boolean;
  step: number;
  onOpen: () => void;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
}

function Upcoming({ showModal, step, onOpen, onClose, onNext, onBack }: Props) {
  const location = useLocation();
  const userId = location.state?.user.id;
  const [formData, setFormData] = useState<EventData>({
    userId: userId,
    title: "",
    date: null,
    location: null,
    services: null,
  });

  const [savedEvent, setSavedEvent] = useState<EventData[]>([]);

  // Merging data from each modal
  const handleSaveData = (newData: Partial<EventData>) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  async function handleData(finalServicesData?: Partial<EventData>) {
    const finalPayload = {
      ...formData,
      ...finalServicesData,
    };

    try {
      const res = await axios.post<EventData>(
        "http://localhost:9000/events/",
        finalPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Event created:", res.data);

      setSavedEvent((prev) => [...prev, res.data]);

      setFormData({
        userId: userId,
        title: "",
        date: null,
        location: null,
        services: null,
      });

      onClose();
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  }

  useEffect(() => {
    axios
      .get<EventData[]>("http://localhost:9000/events")
      .then((res) => setSavedEvent(res.data))
      .catch((err) => console.log("An error occurred", err));
  }, []);

  const filteredEvent = userId
    ? savedEvent.filter((event) => event.userId === userId)
    : [];

  return (
    <>
      <div className="plan-event-container">
        {filteredEvent.length === 0 ? (
          <div className="plan-container">
            <div className="plan-event">
              <img
                src={schedule}
                className="event-image"
                alt="Schedule illustration"
              />
              <h3 className="plan-head">Uh... oh</h3>
              <p className="plan-text">You don't have any upcoming event yet</p>

              <button className="event-btn" onClick={onOpen}>
                Start planning
              </button>

              {showModal && step === 1 && (
                <EventTitle
                  onClose={onClose}
                  onNext={onNext}
                  onSave={handleSaveData}
                />
              )}
              {showModal && step === 2 && (
                <EventDate
                  onNext={onNext}
                  onBack={onBack}
                  onClose={onClose}
                  onSave={handleSaveData}
                />
              )}
              {showModal && step === 3 && (
                <EventLocation
                  onBack={onBack}
                  onClose={onClose}
                  onNext={onNext}
                  onSave={handleSaveData}
                />
              )}
              {showModal && step === 4 && (
                <EventServices
                  onBack={onBack}
                  onClose={(finalData) => {
                    if (finalData) {
                      handleSaveData(finalData);
                    }
                    handleData(finalData);
                  }}
                  onSave={handleSaveData}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="event-container">
            <div className="upcoming-event">
              <img
                src={calendar}
                alt="Calendar illustration"
                className="event-image"
              />
              <p className="event-text">
                Got other events to plan?
                <br />
                Get started now
              </p>

              <button className="event-btn" onClick={onOpen}>
                Plan a new event
              </button>

              {showModal && step === 1 && (
                <EventTitle
                  onClose={onClose}
                  onNext={onNext}
                  onSave={handleSaveData}
                />
              )}
              {showModal && step === 2 && (
                <EventDate
                  onClose={onClose}
                  onNext={onNext}
                  onBack={onBack}
                  onSave={handleSaveData}
                />
              )}
              {showModal && step === 3 && (
                <EventLocation
                  onBack={onBack}
                  onClose={onClose}
                  onNext={onNext}
                  onSave={handleSaveData}
                />
              )}
              {showModal && step === 4 && (
                <EventServices
                  onBack={onBack}
                  onClose={(finalData) => {
                    if (finalData) {
                      handleSaveData(finalData);
                    }
                    handleData(finalData);
                  }}
                  onSave={handleSaveData}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Upcoming;
