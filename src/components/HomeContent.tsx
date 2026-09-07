import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

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
  const location = useLocation();
  const [active, setActive] = useState<number>(location.state?.active ?? 0);
  const [userData, setUserData] = useState<EventData[]>([]);
  const { step, showModal, setStep, setShowModal } =
    useOutletContext<OutletContext>();

  useEffect(() => {
    axios
      .get<EventData[]>("http://localhost:9000/events")
      .then((res) => setUserData(res.data))
      .catch((err) => console.log("An error occured", err));
  }, []);

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
    <div className="home-page">
      <div className="home-header-row">
        <h1 className="home-page-title">Events</h1>
        <div className="home-tabs">
          <button
            className={`home-tab ${active === 0 ? "home-tab-active" : ""}`}
            onClick={() => setActive(0)}
          >
            Upcoming events
          </button>
          <button
            className={`home-tab ${active === 1 ? "home-tab-active" : ""}`}
            onClick={() => setActive(1)}
          >
            Past events
          </button>
        </div>
      </div>

      {active === 0 ? (
        <div className="home-cards-row">
          {closestEvent && (
            <div
              className="home-event-card"
              onClick={() => handleDetails(closestEvent)}
            >
              <h2 className="home-event-title">{closestEvent.title}</h2>
              <div className="home-event-detail">
                <MdCalendarMonth size={20} className="home-detail-icon" />
                <span>
                  {typeof closestEvent.date === "string"
                    ? format(parseISO(closestEvent.date), "do MMMM, yyyy")
                    : Array.isArray(closestEvent.date)
                      ? format(
                          new Date(closestEvent.date[0]),
                          "do MMMM, yyyy",
                        )
                      : null}
                </span>
              </div>
              <div className="home-event-detail">
                <FaLocationDot size={18} className="home-detail-icon" />
                <span>
                  {closestEvent.location?.name},{" "}
                  {closestEvent.location?.town}
                </span>
              </div>
              <img src={map} className="home-event-map" alt="Event location" />
            </div>
          )}

          <div className="home-plan-card">
            <div className="home-plan-emoji"></div>
            <p className="home-plan-text">
              Got other events to plan?
              <br />
              Get started now
            </p>
            <button
              className="home-plan-btn"
              onClick={() => {
                setShowModal(true);
                setStep(1);
              }}
            >
              Plan a new event
            </button>
          </div>
        </div>
      ) : (
        <div className="home-past-wrapper">
          <PastEvents />
        </div>
      )}

      {showModal && (
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
      )}
    </div>
  );
}

export default HomeContent;
