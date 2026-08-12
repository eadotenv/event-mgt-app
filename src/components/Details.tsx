import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; //useOutletContext,
import axios from "axios";
import { format } from "date-fns";
import type {
  ChecklistItem,
  EventData,
  ProgramItem,
} from "../entities/EventData";
import type { User } from "../entities/User";
import NavBar from "./NavBar";
import CheckModal from "./CheckModal";
import ProgramModal from "./ProgramModal";
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

// interface OutletContext {
//   collapsed: boolean;
//   setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
//   setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

function Details() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user as User;
  // const { collapsed, setCollapsed, setDrawerOpen } =
  // useOutletContext<OutletContext>();

  const [active, setActive] = useState<number>(0);
  const [event, setEvent] = useState<EventData | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showChecklistModal, setShowChecklistModal] = useState<boolean>(false);
  const [showProgramModal, setShowProgramModal] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openProgramId, setOpenProgramId] = useState<string | null>(null);

  const [items, setItem] = useState<ChecklistItem[]>([]);
  const [program, setProgram] = useState<ProgramItem[]>([]);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(
    null,
  );

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
        if (res.data.program) {
          setProgram(res.data.program);
        }
      })
      .catch((err) =>
        console.error("An error occurred fetching event details:", err),
      );
  }, [id]);

  // patching already existing data
  const handleSaveAllDetails = async (
    checkId: string,
    checklist: ChecklistItem[],
  ) => {
    const patchPayload = {
      checklist,
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

  const handleSaveProgram = async (
    progId: string,
    programItems: ProgramItem[],
  ) => {
    const patchPayload = {
      program: programItems,
    };

    try {
      const response = await axios.patch(
        `http://localhost:9000/events/${progId}`,
        patchPayload,
      );
      console.log("Program saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving program:", error);
    }
  };

  const handleProgramEdit = (updated: ProgramItem) => {
    const updatedProgram = program.map((p) =>
      p.itemId === updated.itemId ? { ...p, ...updated } : p,
    );
    setProgram(updatedProgram);
    if (id) handleSaveProgram(id, updatedProgram);
    setOpenProgramId(null);
  };

  const handleProgramDelete = (itemId: string) => {
    const updatedProgram = program.filter((p) => p.itemId !== itemId);
    setProgram(updatedProgram);
    if (id) handleSaveProgram(id, updatedProgram);
    setOpenProgramId(null);
  };

  const handleEditDetails = () => {
    navigate(`/page-layout/replan/${id}`, { state: { user, from: "details" } });
  };

  // const handleToggleSidebar = () => {
  //   if (window.innerWidth <= 991) {
  //     setDrawerOpen(true);
  //   } else {
  //     setCollapsed(!collapsed);
  //   }
  // };

  async function handleCancelEvent() {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:9000/events/${id}`);
      setShowCancelModal(false);
      navigate("/page-layout", { state: { user } });
    } catch (error) {
      console.error("Failed to cancel event:", error);
    }
  }

  const userInitial = user?.firstname
    ? user.firstname.charAt(0).toUpperCase()
    : "";
  const firstNameCap = capitalize(user?.firstname);
  const lastNameInitial = user?.lastname
    ? `${user.lastname.charAt(0).toUpperCase()}.`
    : "";

  async function handeDelete(delId: ChecklistItem) {
    const updatedItems = items.filter((p) => p.itemId !== delId.itemId);
    setItem(updatedItems);
    try {
      if (id) {
        await handleSaveAllDetails(id, updatedItems);
      }
      console.log("deleted");
    } catch (error) {
      console.error(error);
    }
    setOpenMenuId(null);
  }

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
        // onToggleSidebar={handleToggleSidebar}
      />

      <div
        className={
          showModal ? "details-container modal-overlay" : "details-container"
        }
      >
        {active === 0 ? (
          /* ====== details panel ====== */
          <div className="details">
            {openMenuId && (
              <div
                className="edit-backdrop"
                onClick={() => setOpenMenuId(null)}
              />
            )}
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
                    <div
                      className="edit-box"
                      onClick={handleEditDetails}
                      role="button"
                    >
                      <CiEdit size={20} />
                      <p>Edit details</p>
                    </div>
                    <div
                      className="del-box"
                      onClick={() => setShowCancelModal(true)}
                      role="button"
                    >
                      <TbCancel size={20} />
                      <p>Cancel event</p>
                    </div>
                  </div>
                </div>

                {/* details modal */}
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

            {showCancelModal && (
              <div className="checklist-modal">
                <div className="mod-form">
                  <div className="header-close-btn">
                    <h3 className="check-header">Cancel event</h3>
                    <IoClose
                      size={22}
                      onClick={() => setShowCancelModal(false)}
                    />
                  </div>
                  <p className="check-list-text">
                    Are you sure you want to cancel <b>"{event?.title}"</b>?
                    This action cannot be undone.
                  </p>
                  <button
                    type="button"
                    className="mod-btn mod-save-btn"
                    onClick={handleCancelEvent}
                  >
                    Yes, cancel event
                  </button>
                  <button
                    type="button"
                    className="mod-btn mod-del-btn"
                    onClick={() => setShowCancelModal(false)}
                  >
                    Keep event
                  </button>
                </div>
              </div>
            )}

            {/* services & checklist sections */}
            <div className="detail-service">
              <h3 className="detail-head">📅 Services</h3>
              {event?.bookedVendors && event.bookedVendors.length > 0 ? (
                <div className="booked-services-grid">
                  {event.bookedVendors.map((bv) => (
                    <div className="booked-vendor-card" key={bv.vendorId}>
                      <img
                        className="booked-vendor-img"
                        src={bv.image}
                        alt={bv.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (
                            (e.target as HTMLImageElement)
                              .nextElementSibling as HTMLElement
                          ).style.display = "flex";
                        }}
                      />
                      <div
                        className="vendor-image-placeholder booked-vendor-placeholder"
                        style={{ display: "none" }}
                      >
                        {bv.name.charAt(0)}
                      </div>
                      <div className="booked-vendor-body">
                        <p className="booked-vendor-name">{bv.name}</p>
                        <p className="booked-vendor-rate">GHS {bv.rate.toLocaleString()}</p>
                        <p className="booked-vendor-status" data-status={bv.status}>
                          {bv.status.charAt(0).toUpperCase() + bv.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="book-services">
                  <img src={note} className="note-icon" alt="Note icon" />
                  <div className="book-text">
                    <p>No services booked yet.</p>
                    <p>
                      <span
                        className="browse-services-link"
                        onClick={() =>
                          navigate("/page-layout/services", {
                            state: { user },
                          })
                        }
                      >
                        <b>Click here</b>
                      </span>{" "}
                      to browse services to book
                    </p>
                  </div>
                </div>
              )}

              <div className="line-check">
                <div className="check-list-box">
                  <h3 className="detail-head">📌 Checklist</h3>
                  <p className="check-list-text">
                    Add a list of items required or{" "}
                    <span>things to be done before the event.</span>
                  </p>

                  {items && (
                    <ul className="active-checklist">
                      {items.map((item) => (
                        <div className="checklist-div" key={item.itemId}>
                          <li
                            className={
                              item.isDone
                                ? "checklist-list is-done"
                                : "checklist-list"
                            }
                          >
                            <input
                              type="checkbox"
                              className="checklist-input"
                              checked={item.isDone}
                              onChange={(e) => {
                                const updatedItems = items.map((p) =>
                                  p.itemId === item.itemId
                                    ? { ...p, isDone: e.target.checked }
                                    : p,
                                );
                                setItem(updatedItems);
                                if (id) {
                                  handleSaveAllDetails(id, updatedItems);
                                }
                              }}
                            />
                            {capitalize(item.item)}
                          </li>
                          <button
                            className="dot-btn"
                            onClick={() => {
                              setShowChecklistModal(false);
                              setShowProgramModal(false);
                              setOpenProgramId(null);
                              setOpenMenuId(
                                openMenuId === item.itemId ? null : item.itemId,
                              );
                            }}
                          >
                            ...
                          </button>
                          {openMenuId === item.itemId && (
                            <div className="dot-del-btn">
                              <button
                                type="button"
                                className="edit-close-btn"
                                aria-label="Close"
                                onClick={() => setOpenMenuId(null)}
                              >
                                <IoClose size={16} />
                              </button>
                              <form onSubmit={(e) => e.preventDefault()}>
                                <input
                                  type="text"
                                  className="edit-saved-item"
                                  value={item.item}
                                  onChange={(e) => {
                                    const updatedItems = items.map((p) =>
                                      p.itemId === item.itemId
                                        ? { ...p, item: e.target.value }
                                        : p,
                                    );
                                    setItem(updatedItems);
                                  }}
                                />
                              </form>

                              <div className="two-btn">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (id) handleSaveAllDetails(id, items);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  Save
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    handeDelete(item);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </ul>
                  )}

                  <p
                    className="check-item"
                    onClick={() => {
                      setOpenMenuId(null);
                      setShowChecklistModal(true);
                    }}
                  >
                    Add a checklist item
                  </p>
                </div>

                {showChecklistModal && id && (
                  <CheckModal
                    items={items}
                    setItem={setItem}
                    handleSaveAllDetails={(updatedItems) =>
                      handleSaveAllDetails(id, updatedItems)
                    }
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

                  {program.length > 0 && (
                    <ul className="program-list">
                      {program.map((item) => (
                        <div key={item.itemId} className="program-item-div">
                          <li
                            className="program-item"
                            onClick={() => {
                              setShowChecklistModal(false);
                              setShowProgramModal(false);
                              if (openProgramId === item.itemId) {
                                setOpenProgramId(null);
                              } else {
                                setOpenProgramId(item.itemId);
                                setEditingProgram({ ...item });
                              }
                            }}
                          >
                            <span className="program-time">{item.time}</span>
                            <div className="program-info">
                              <h4 className="program-title">{item.title}</h4>
                              {item.name && (
                                <p className="program-name">{item.name}</p>
                              )}
                            </div>
                          </li>
                          {openProgramId === item.itemId && editingProgram && (
                            <div className="checklist-modal">
                              <form
                                className="mod-form program-edit-form"
                                onSubmit={(e) => e.preventDefault()}
                              >
                                <div className="header-close-btn">
                                  <h3 className="check-header">
                                    Edit program item
                                  </h3>
                                  <IoClose
                                    size={22}
                                    className="edit-x-btn"
                                    onClick={() => setOpenProgramId(null)}
                                  />
                                </div>
                                <div className="check-modal-form-input">
                                  <label
                                    htmlFor={`prog-title-${item.itemId}`}
                                    className="check-modal-label"
                                  >
                                    Title
                                  </label>
                                  <input
                                    id={`prog-title-${item.itemId}`}
                                    type="text"
                                    className="check-modal-input"
                                    value={editingProgram.title}
                                    onChange={(e) =>
                                      setEditingProgram({
                                        ...editingProgram,
                                        title: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="check-modal-form-input">
                                  <label
                                    htmlFor={`prog-name-${item.itemId}`}
                                    className="check-modal-label"
                                  >
                                    Who is responsible for this?
                                  </label>
                                  <input
                                    id={`prog-name-${item.itemId}`}
                                    type="text"
                                    className="check-modal-input"
                                    value={editingProgram.name}
                                    onChange={(e) =>
                                      setEditingProgram({
                                        ...editingProgram,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="check-modal-form-input">
                                  <label
                                    htmlFor={`prog-time-${item.itemId}`}
                                    className="check-modal-label"
                                  >
                                    At what time will this be done?
                                  </label>
                                  <input
                                    id={`prog-time-${item.itemId}`}
                                    type="time"
                                    className="check-modal-input"
                                    value={editingProgram.time}
                                    onChange={(e) =>
                                      setEditingProgram({
                                        ...editingProgram,
                                        time: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="mod-btn mod-save-btn"
                                  onClick={() =>
                                    handleProgramEdit(editingProgram)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="mod-btn mod-del-btn"
                                  onClick={() =>
                                    handleProgramDelete(item.itemId)
                                  }
                                >
                                  Delete
                                </button>
                              </form>
                            </div>
                          )}
                        </div>
                      ))}
                    </ul>
                  )}

                  <p
                    className="check-item"
                    onClick={() => {
                      setOpenMenuId(null);
                      setOpenProgramId(null);
                      setShowProgramModal(true);
                    }}
                  >
                    Add an item to the program lineup
                  </p>
                </div>

                {showProgramModal && id && (
                  <ProgramModal
                    program={program}
                    setProgram={setProgram}
                    handleSaveProgram={(updatedProgram) =>
                      handleSaveProgram(id, updatedProgram)
                    }
                    setShowProgramModal={setShowProgramModal}
                  />
                )}
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

{
  /*<button
                                  type="button"
                                  onClick={() => {
                                    const updatedItems = items.filter(
                                      (p) => p.itemId !== item.itemId,
                                    );
                                    setItem(updatedItems);
                                    if (id)
                                      handleSaveAllDetails(id, updatedItems);
                                  }}
                                >
                                  Delete
                                </button> */
}
