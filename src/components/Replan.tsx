import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { EventData } from "../entities/EventData";
import type { User } from "../entities/User";
import EventTitle from "./EventTitle";
import EventDate from "./EventDate";
import EventLocation from "./EventLocation";
import EventServices from "./EventServices";
import { IoClose } from "react-icons/io5";
import "../css/replan.css";
import "../css/upcoming.css";

function Replan() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user as User;

  const [step, setStep] = useState<number>(1);
  const [event, setEvent] = useState<EventData | null>(null);
  const [formData, setFormData] = useState<Partial<EventData>>({});

  useEffect(() => {
    if (!id) return;
    axios
      .get<EventData>(`http://localhost:9000/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("An error occurred fetching event:", err));
  }, [id]);

  const handleSaveData = (newData: Partial<EventData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const goBackToPastEvents = () =>
    navigate("/page-layout", { state: { user, active: 1 } });

  const handleSubmit = async (finalServicesData?: Partial<EventData>) => {
    const payload = { ...formData, ...finalServicesData };

    try {
      await axios.patch(`http://localhost:9000/events/${id}`, payload);
      goBackToPastEvents();
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  return (
    <div className="replan-container">
      <div className="replan-header">
        <h3 className="replan-head">
          Replanning {event?.title ? `"${event.title}"` : "event"}
        </h3>
        <button
          type="button"
          className="replan-close"
          aria-label="Close"
          onClick={goBackToPastEvents}
        >
          <IoClose size={22} />
        </button>
      </div>

      <div className="replan-body">
        {step === 1 && (
          <EventTitle
            onClose={goBackToPastEvents}
            onNext={() => setStep(2)}
            onSave={handleSaveData}
          />
        )}
        {step === 2 && (
          <EventDate
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            onClose={goBackToPastEvents}
            onSave={handleSaveData}
          />
        )}
        {step === 3 && (
          <EventLocation
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
            onClose={goBackToPastEvents}
            onSave={handleSaveData}
          />
        )}
        {step === 4 && (
          <EventServices
            onBack={() => setStep(3)}
            onClose={(finalData) => {
              if (finalData) {
                handleSaveData(finalData);
                handleSubmit(finalData);
              } else {
                goBackToPastEvents();
              }
            }}
            onSave={handleSaveData}
          />
        )}
      </div>
    </div>
  );
}

export default Replan;
