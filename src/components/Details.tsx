import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import type { EventData } from "../entities/EventData";
import type { User } from "../entities/User";
import NavBar from "./NavBar";
import CheckModal from "./CheckModal";
import "../css/details.css";
import note from "../assets/note.png";
import { FaLocationDot } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";
import { TbCancel } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import { BsBoxArrowUp } from "react-icons/bs";
import { RiArrowDownSLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import capitalize from "../hooks/capitalize";

function Details() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const user = location.state?.user as User;

  const [active, setActive] = useState<number>(0);
  const [event, setEvent] = useState<EventData | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showChecklistModal, setShowChecklistModal] = useState<boolean>(false);

  const [items, setItem] = useState([{ itemId: "", item: "", isDone: false }]);

  const detailTabs = [{ name: "Details" }, { name: "Services" }];

  useEffect(() => {
    if (!id) return;
    axios
      .get<EventData>(`http://localhost:9000/events/${id}`)
      .then((res) => {
        setEvent(res.data);
        // checking if data already exist and load them
        if (res.data.checklist) {
          setItem(res.data.checklist);
        }
      })
      .catch((err) =>
        console.error("An error occurred fetching event details:", err),
      );
  }, [id]);

  // patching already existing data
  const handleSaveAllDetails = async (checkId: string) => {
    const patchPayload = {
      checklist: items,
    };

    try {
      const response = await axios.patch(
        `http://localhost:9000/events/${checkId}`,
        patchPayload,
      );
      console.log("Saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const userInitial = user?.firstname
    ? user.firstname.charAt(0).toUpperCase()
    : "";
  const firstNameCap = capitalize(user?.firstname);
  const lastNameInitial = user?.lastname
    ? `${user.lastname.charAt(0).toUpperCase()}.`
    : "";

  // if (loading) {
  //   return <p className="loading-state">Loading event details...</p>;
  // }

  return (
    <div className="full-detail">
      <NavBar
        active={active}
        setActive={setActive}
        header={event && active === 0 ? event.title : "Services Panel"}
        tabs={detailTabs}
      />

      <div
        className={
          showModal ? "details-container modal-overlay" : "details-container"
        }
      >
        {active === 0 ? (
          /* ====== details panel ====== */
          <div className="details">
            {event && (
              <div className="detail-box">
                <div className="header-arrow">
                  <h3 className="detail-head">{event.title}</h3>
                  <RiArrowDownSLine
                    className="arrow-down"
                    onClick={() => setShowModal(!showModal)}
                  />
                </div>

                <div className="detail-events">
                  <div className="details-name-div">
                    <h2 className="details-name-icon">{userInitial}</h2>
                    <span className="detail-fullname">
                      Planned by {firstNameCap} {lastNameInitial}
                    </span>
                  </div>

                  <div className="cal-icon-text">
                    <MdCalendarMonth className="detail-cal-icon" size={20} />
                    {typeof event.date === "string"
                      ? format(new Date(event.date), "do MMM yyyy")
                      : Array.isArray(event.date)
                        ? `${format(new Date(event.date[0]), "do MMM yyyy")}`
                        : null}
                  </div>

                  <div className="loc-text">
                    <FaLocationDot className="detail-location-icon" />
                    {event.location?.name}, {event.location?.town}
                  </div>

                  <div className="map-link">
                    <a href="#" className="view-map">
                      View on Google Maps
                    </a>
                    <GoArrowUpRight />
                  </div>

                  <div className="upgrade-box">
                    <p className="upgrade-text">
                      Upgrade to a pro account to be able to print and share the
                      program lineup, create, customize, and share invitation
                      cards.
                    </p>
                    <button className="upgrade-btn">Upgrade now</button>
                  </div>

                  <div className="edit-del-box">
                    <div className="edit-box">
                      <CiEdit size={20} />
                      <p>Edit details</p>
                    </div>
                    <div className="del-box">
                      <TbCancel size={20} />
                      <p>Cancel event</p>
                    </div>
                  </div>
                </div>

                {/* Details Backdrop Modal */}
                {showModal && (
                  <div className="detail-modal">
                    <div className="detail-box">
                      <div className="header-arrow">
                        <h3 className="detail-head">{event.title}</h3>
                        <IoClose
                          size={20}
                          onClick={() => setShowModal(false)}
                        />
                      </div>

                      <div className="detail-events">
                        <div className="details-name-div">
                          <h2 className="details-name-icon">{userInitial}</h2>
                          <span className="detail-fullname">
                            Planned by {firstNameCap} {lastNameInitial}
                          </span>
                        </div>

                        <div className="cal-icon-text">
                          <MdCalendarMonth
                            className="detail-cal-icon"
                            size={20}
                          />
                          {typeof event.date === "string"
                            ? format(new Date(event.date), "do MMM yyyy")
                            : Array.isArray(event.date)
                              ? `${format(new Date(event.date[0]), "do MMM yyyy")}`
                              : null}
                        </div>

                        <div className="loc-text">
                          <FaLocationDot className="detail-location-icon" />
                          {event.location?.name}, {event.location?.town}
                        </div>

                        <div className="map-link">
                          <a href="#" className="view-map">
                            View on Google Maps
                          </a>
                          <GoArrowUpRight />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Services & Checklist Side Sections */}
            <div className="detail-service">
              <h3 className="detail-head">📅 Services</h3>
              <div className="book-services">
                <img src={note} className="note-icon" alt="Note icon" />
                <div className="book-text">
                  <p>No services booked yet.</p>
                  <p>
                    <a href="#">
                      <b>Click here</b>
                    </a>{" "}
                    to browse services to book
                  </p>
                </div>
              </div>

              <div className="line-check">
                <div className="check-list-box">
                  <h3 className="detail-head">📌 Checklist</h3>
                  <p className="check-list-text">
                    Add a list of items required or{" "}
                    <span>things to be done before the event.</span>
                  </p>

                  {/* Dynamic checklist items iteration placeholder */}
                  <ul className="active-checklist">
                    {items.map((item) => (
                      <>
                        <li key={item.itemId}>
                          <input type="checkbox" />
                          {item.item}
                        </li>
                        <button>...</button>
                      </>
                    ))}
                  </ul>

                  <p
                    className="check-item"
                    onClick={() => setShowChecklistModal(true)}
                  >
                    Add a checklist item
                  </p>
                </div>

                {showChecklistModal && id && (
                  <CheckModal
                    items={items}
                    setItem={setItem}
                    handleSaveAllDetails={() => handleSaveAllDetails(id)}
                    setShowChecklistModal={setShowChecklistModal}
                  />
                )}

                <div className="program-box">
                  <div className="program-icon">
                    <h3 className="detail-head">📝 Program Line up</h3>
                    <BsBoxArrowUp />
                  </div>
                  <p className="check-list-text">
                    Add items to the schedule of the event
                  </p>
                  <p className="check-item">
                    Add an item to the program lineup
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ====== service panel ======*/
          <div className="services-tab-panel">
            <h3 className="detail-head">Booked Vendor Services</h3>
            <p>Your active service vendor pipeline metrics will render here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;
