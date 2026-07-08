import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, isBefore, parseISO } from "date-fns";

// Types
import type { EventData } from "../entities/EventData";

// Assets & Icons
import map from "../assets/map.jpg";
import { FaLocationDot } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";

// Style Assets
import "../css/navbar.css";
import "../css/event.css";

function Event() {
  const [userData, setUserData] = useState<EventData[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<EventData[]>("http://localhost:9000/events")
      .then((res) => setUserData(res.data))
      .catch((err) => console.error("An error occurred fetching events:", err));
  }, []);

  const userId = location.state?.user?.id || location.state?.userId;

  function handleDetails(eventId: EventData) {
    navigate(`/page-layout/details/${eventId.id}`, {
      state: { user: location.state?.user },
    });
  }

  // Filter out events that do not belong to the logged-in user
  const userFilteredEvents = userId
    ? userData.filter((event) => event.userId === userId)
    : [];

  // Expiration boundary check
  const isEventExpired = (date: EventData["date"]) => {
    if (!date) return false;

    let checkDate: Date;
    if (typeof date === "string") {
      checkDate = parseISO(date);
    } else if (Array.isArray(date)) {
      checkDate = new Date(date[0]);
    } else {
      return false;
    }

    return isBefore(checkDate, new Date());
  };

  // Get active, upcoming events
  const activeEvents = userFilteredEvents.filter(
    (event) => !isEventExpired(event.date),
  );

  return (
    <div className="past-event-container">
      {activeEvents.length === 0 ? (
        <p className="past-text">
          You don't have any upcoming events to your name
        </p>
      ) : (
        <div className="events-grid">
          {activeEvents.map((event: EventData) => (
            <div
              key={event.id} /* Use event.id for stable rendering tracking */
              className="cur-events-container"
              onClick={() => handleDetails(event)}
            >
              <div className="cur-events">
                <h3 className="past-head">{event.title}</h3>

                <div className="cal-icon-text">
                  <MdCalendarMonth size={20} className="event-icon" />
                  <span>
                    {typeof event.date === "string"
                      ? format(parseISO(event.date), "do MMM yyyy")
                      : Array.isArray(event.date)
                        ? format(new Date(event.date[0]), "do MMM yyyy")
                        : null}
                  </span>
                </div>

                <div className="loc-text">
                  <FaLocationDot className="event-icon" />
                  <span>
                    {event.location?.name}, {event.location?.town}
                  </span>
                </div>
              </div>
              <img
                src={map}
                className="map-image"
                alt="Event map location thumbnail"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Event;
