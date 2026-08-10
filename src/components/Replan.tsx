import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import { format } from "date-fns";
import type { EventData } from "../entities/EventData";
import type { ServiceData } from "../entities/ServiceData";
import type { AreaData } from "../entities/AreaData";
import type { User } from "../entities/User";
import type { ValuePiece } from "./Upcoming";
import { locations } from "../hooks/locations";
import { FaLocationDot } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import "../css/replan.css";
import "../css/upcoming.css";

const regions: string[] = [
  "Ashanti",
  "Brong Ahafo",
  "Central",
  "Greater Accra",
  "Western",
  "Northern",
];

const emptyServices: ServiceData = {
  photo: false,
  entertainment: false,
  design: false,
  hiring: false,
  transport: false,
  event: false,
  foodServices: false,
  beautician: false,
};

const serviceOptions: { key: keyof ServiceData; label: string }[] = [
  { key: "photo", label: "Photography/videography" },
  { key: "entertainment", label: "Entertainment(MC/DJ/Band/performer/etc)" },
  { key: "design", label: "Decoration/Design" },
  { key: "hiring", label: "Hiring Service" },
  { key: "transport", label: "Transportation" },
  { key: "event", label: "Event organiser/planner" },
  { key: "foodServices", label: "Catering/drinks" },
  { key: "beautician", label: "Beauty and grooming" },
];

const stepLabels = ["Title", "Date", "Location", "Services"];

function toDateValue(value: EventData["date"]): ValuePiece {
  if (!value) return null;
  if (typeof value === "string") return new Date(value);
  if (Array.isArray(value) && value[0]) {
    const start = new Date(value[0]);
    return value[1] ? [start, new Date(value[1])] : start;
  }
  return null;
}

function Replan() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user as User;
  const from = location.state?.from;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<ValuePiece>(null);
  const [eventLocation, setEventLocation] = useState<AreaData | null>(null);
  const [services, setServices] = useState<ServiceData>(emptyServices);
  const [area, setArea] = useState("");
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const lastStep = stepLabels.length - 1;

  useEffect(() => {
    if (!id) return;
    axios
      .get<EventData>(`http://localhost:9000/events/${id}`)
      .then((res) => {
        setTitle(res.data.title ?? "");
        setDate(toDateValue(res.data.date));
        setEventLocation(res.data.location);
        setArea(res.data.location?.region ?? "");
        setServices({ ...emptyServices, ...(res.data.services ?? {}) });
      })
      .catch((err) => console.error("An error occurred fetching event:", err));
  }, [id]);

  const goBack = () => {
    if (from === "details" && id) {
      navigate(`/page-layout/details/${id}`, { state: { user } });
    } else {
      navigate("/page-layout", { state: { user, active: 1 } });
    }
  };

  const handleNext = () => {
    if (step === 0 && !title.trim()) return;
    setStep((s) => Math.min(s + 1, lastStep));
  };

  const handleSubmit = async () => {
    if (!id) return;
    setSaving(true);
    const payload = {
      title,
      date,
      location: eventLocation,
      services,
    };
    try {
      await axios.patch(`http://localhost:9000/events/${id}`, payload);
      goBack();
    } catch (err) {
      console.error("Failed to update event:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredLocations = area
    ? locations.filter((loc) => loc.region === area)
    : [];
  const headerCity = filteredLocations[0]?.city;

  return (
    <div className="replan-container">
      <div className="replan-header">
        <h3 className="replan-head">
          {from === "details"
            ? `Edit "${title || "event"}"`
            : `Replanning ${title ? `"${title}"` : "event"}`}
        </h3>
        <button
          type="button"
          className="replan-close"
          aria-label="Close"
          onClick={goBack}
        >
          <IoClose size={22} />
        </button>
      </div>

      <div className="replan-body">
        <div className="replan-form">
          <p className="replan-step-counter">
            Step {step + 1} of {stepLabels.length}: {stepLabels[step]}
          </p>

          {step === 0 && (
            <section className="replan-section">
              <label htmlFor="edit-title" className="replan-label">
                Event title
              </label>
              <input
                id="edit-title"
                type="text"
                className="replan-input"
                placeholder="Start typing..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </section>
          )}

          {step === 1 && (
            <section className="replan-section">
              <label className="replan-label">When will this event happen?</label>
              <p className="replan-hint">
                If the event takes place over multiple days, tap multiple days.
              </p>
              <Calendar
                selectRange
                showNeighboringMonth={false}
                prev2Label={null}
                next2Label={null}
                value={date}
                onChange={(value) => setDate(value as ValuePiece)}
                className="cal"
              />
              <p className="replan-hint">
                {date ? (
                  date instanceof Date ? (
                    format(date, "do MMM yyyy")
                  ) : (
                    `${format(date[0], "do MMM yyyy")} – ${format(
                      date[1],
                      "do MMM yyyy",
                    )}`
                  )
                ) : (
                  "No date selected"
                )}
              </p>
            </section>
          )}

          {step === 2 && (
            <section className="replan-section">
              <label htmlFor="edit-region" className="replan-label">
                Location
              </label>
              <select
                id="edit-region"
                className="replan-input"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                <option value="">Select a Region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {headerCity && <h2 className="city-head">{headerCity}</h2>}
              <ul className="location-list">
                {filteredLocations.map((loc) =>
                  loc.hotels.map((hotel) => {
                    const isActive = eventLocation?.name === hotel.name;
                    return (
                      <li
                        key={hotel.name}
                        className={`list-group-item ${
                          isActive ? "active-list" : ""
                        }`}
                        onClick={() =>
                          setEventLocation({
                            name: hotel.name,
                            town: hotel.address,
                            city: loc.city,
                            region: loc.region,
                          })
                        }
                      >
                        <FaLocationDot />
                        <div className="hotel-address">
                          <h3 className="hotel-name">{hotel.name}</h3>
                          <p className="loc-address">{hotel.address}</p>
                        </div>
                      </li>
                    );
                  }),
                )}
              </ul>
            </section>
          )}

          {step === 3 && (
            <section className="replan-section">
              <label className="replan-label">What services do you need?</label>
              <p className="replan-hint">Select as many as you like</p>
              <div className="service-form">
                {serviceOptions.map((opt) => (
                  <div className="servixes" key={opt.key}>
                    <input
                      type="checkbox"
                      className="check-input"
                      id={`svc-${opt.key}`}
                      checked={services[opt.key]}
                      onChange={(e) =>
                        setServices({ ...services, [opt.key]: e.target.checked })
                      }
                    />
                    <label htmlFor={`svc-${opt.key}`}>{opt.label}</label>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="replan-actions">
            {step > 0 && (
              <button
                type="button"
                className="replan-btn replan-btn-secondary"
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
              >
                Back
              </button>
            )}
            {step < lastStep ? (
              <button
                type="button"
                className="replan-btn"
                onClick={handleNext}
                disabled={step === 0 && !title.trim()}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className="replan-btn"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Replan;
