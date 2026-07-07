import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

import NavBar from "./NavBar";
import { useEffect, useState } from "react";
import "../css/home-content.css";
import Upcoming from "./Upcoming";
import PastEvents from "./PastEvents";
import type { EventData } from "../entities/EventData";
import { isBefore, parseISO, closestTo, isSameDay, format } from "date-fns";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import map from "../assets/map.jpg";
import type { User } from "../entities/User";

interface OutletContext {
  step: number;
  showModal: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function HomeContent() {
  const [active, setActive] = useState<number>(0);
  const tabs = [{ name: "Upcoming events" }, { name: "Past events" }];
  const [userData, setUserData] = useState<EventData[]>([]);
  const { step, showModal, setStep, setShowModal } =
    useOutletContext<OutletContext>();

  useEffect(() => {
    axios
      .get<EventData[]>("http://localhost:9000/events")
      .then((res) => setUserData(res.data))
      .catch((err) => console.log("An error occured", err));
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user as User;
  const userId = user?.id;

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

  function getClosestUpcomingEvent() {
    const futureEvents = filteredEvent.filter(
      (event) => !isEventExpired(event.date),
    );

    if (futureEvents.length === 0) return null;

    const validDatesArray = futureEvents
      .map((event) => {
        if (typeof event.date === "string") {
          return parseISO(event.date);
        } else if (Array.isArray(event.date) && event.date[0]) {
          return event.date[0] instanceof Date
            ? event.date[0]
            : new Date(event.date[0]);
        }
        return null;
      })
      .filter((date): date is Date => date !== null);

    const closestDate = closestTo(new Date(), validDatesArray);

    if (!closestDate) return null;

    return futureEvents.find((event) => {
      if (typeof event.date === "string") {
        return isSameDay(parseISO(event.date), closestDate);
      } else if (Array.isArray(event.date) && event.date[0]) {
        const targetDate =
          event.date[0] instanceof Date
            ? event.date[0]
            : new Date(event.date[0]);
        return isSameDay(targetDate, closestDate);
      }
      return false;
    });
  }

  function handleDetails(eventId: EventData) {
    navigate(`/page-layout/details/${eventId.id}`, {
      state: { user: location.state?.user },
    });
  }

  const closestEvent = getClosestUpcomingEvent();

  return (
    // <div>
    <div className="home-container">
      {/* MAIN CONTENT */}
      <div className="home-content">
        <NavBar
          active={active}
          setActive={setActive}
          header="Event"
          tabs={tabs}
        />
      </div>
      <div className="outlet-div">
        {active === 0 ? (
          <>
            {closestEvent && (
              <div
                className="closest-event-hero"
                onClick={() => handleDetails(closestEvent)}
              >
                <div className="event-header">
                  <h2 className="past-head">{closestEvent.title}</h2>
                </div>
                <div className="hero-details">
                  <div className="cal-icon-text">
                    <MdCalendarMonth size={22} className="calendar-icon" />
                    <span>
                      {typeof closestEvent.date === "string"
                        ? format(parseISO(closestEvent.date), "do MMM yyyy")
                        : Array.isArray(closestEvent.date)
                          ? format(
                              new Date(closestEvent.date[0]),
                              "do MMM yyyy",
                            )
                          : null}
                    </span>
                  </div>
                  <div className="loc-text">
                    <FaLocationDot size={18} />
                    <span>
                      {closestEvent.location?.name},{" "}
                      {closestEvent.location?.town}
                    </span>
                  </div>
                </div>
                <img src={map} className="map-image" />
              </div>
            )}

            {/* Always render Upcoming when active === 0 */}
            <Upcoming
              showModal={showModal}
              step={step}
              onOpen={() => {
                setShowModal(true);
                setStep(1);
              }}
              onClose={() => {
                setShowModal(false);
                setStep(1);
              }}
              onNext={() => setStep((s) => s + 1)}
              onBack={() => setStep((s) => s - 1)}
            />
          </>
        ) : (
          <PastEvents />
        )}
      </div>
    </div>
  );
}

export default HomeContent;
