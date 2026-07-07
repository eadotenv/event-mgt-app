import { useEffect, useState } from "react";
import type { EventData } from "../entities/EventData";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import map from "../assets/map.jpg";
import { FaLocationDot } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import { format, isBefore, parseISO } from "date-fns";
import "../css/navbar.css";
import "../css/event.css";

function Event() {
  const [userData, setUserData] = useState<EventData[]>([]);

  useEffect(() => {
    axios
      .get<EventData[]>("http://localhost:9000/events")
      .then((res) => setUserData(res.data))
      .catch((err) => console.log("An error occured", err));
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.user?.id || location.state?.userId;

  function handleDetails(eventId: EventData) {
    navigate(`/page-layout/details/${eventId.id}`, {
      state: { user: location.state?.user },
    });
  }

  const filteredEvent = userId
    ? userData.filter((event) => event.userId === userId)
    : [];

  const isEventExpired = (date: EventData["date"]) => {
    if (!date) return false;

    let checkDate: Date;

    if (typeof date === "string") {
      checkDate = parseISO(date);
    } else if (Array.isArray(date)) {
      checkDate = date[0];
    } else {
      return false;
    }

    return isBefore(checkDate, new Date());
  };

  return (
    <>
      <div className="past-event-container">
        <div className="events-grid">
          {filteredEvent.length === 0 ? (
            // <div>
            <p className="past-text">You don't have any event to your name</p>
          ) : (
            filteredEvent
              .filter((user) => !isEventExpired(user.date))
              .map((user: EventData, index) => (
                <div
                  key={index}
                  className="cur-events-container"
                  onClick={() => handleDetails(user)}
                >
                  <div className="cur-events">
                    <h3 className="past-head">{user.title}</h3>

                    <div className="cal-icon-text">
                      <MdCalendarMonth className="" size={20} />

                      {typeof user.date === "string"
                        ? format(new Date(user.date), "do MMM yyyy")
                        : Array.isArray(user.date)
                          ? `${format(user.date[0], "do MMM yyyy")}`
                          : null}
                    </div>

                    <div className="loc-text">
                      <FaLocationDot className="" />
                      {user.location?.name}, {user.location?.town}
                    </div>
                  </div>
                  <img src={map} className="map-image" />
                </div>
                // </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}

export default Event;
