import axios from "axios";
import { parseISO, isBefore, format } from "date-fns";
import { useState, useEffect } from "react";
import type { EventData } from "../entities/EventData";
import { useLocation } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import "../css/event.css";

function PastEvents() {
  const [userData, setUserData] = useState<EventData[]>([]);

  useEffect(() => {
    axios
      .get<EventData[]>("http://localhost:9000/events")
      .then((res) => setUserData(res.data))
      .catch((err) => console.log("An error occured", err));
  }, []);

  const location = useLocation();
  const userId = location.state?.user.id;
  console.log(userId);

  const filteredEvent = userId
    ? userData.filter((event) => event.userId === userId)
    : [];
  console.log(filteredEvent);

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
            // </div>
            filteredEvent
              .filter((user) => isEventExpired(user.date))
              .map((user: EventData, index) => (
                <div key={index} className="old-events-container">
                  <div className="old-events">
                    <h3 className="past-head">{user.title}</h3>

                    <div className="cal-icon-text">
                      <MdCalendarMonth className="calendar-icon" size={20} />

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
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}

export default PastEvents;
