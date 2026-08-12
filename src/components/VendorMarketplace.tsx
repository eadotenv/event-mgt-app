import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { categories, vendors } from "../data/vendors";
import type { Vendor } from "../entities/Vendor";
import type { EventData } from "../entities/EventData";
import type { User } from "../entities/User";
import { IoClose, IoChevronDown } from "react-icons/io5";
import "../css/services.css";

const PRICE_RANGES = [
  { label: "Prices", min: 0, max: Infinity },
  { label: "Under GHS 1,500", min: 0, max: 1500 },
  { label: "GHS 1,500 – 3,000", min: 1500, max: 3000 },
  { label: "GHS 3,000 – 5,000", min: 3000, max: 5000 },
  { label: "Above GHS 5,000", min: 5000, max: Infinity },
];

const LOCATIONS = [
  "Locations",
  "Accra",
  "Kumasi",
  "Takoradi",
  "Tema",
  "Cape Coast",
  "Tamale",
];

const RATING_OPTIONS = [
  { label: "Rating", min: 0 },
  { label: "4.5 & up", min: 4.5 },
  { label: "4.0 & up", min: 4.0 },
  { label: "3.5 & up", min: 3.5 },
];

type FilterKey = "price" | "location" | "rating";

interface Props {
  user: User;
  autoBookEventId?: string;
  onVendorBooked?: () => void;
}

function VendorMarketplace({ user, autoBookEventId, onVendorBooked }: Props) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [priceFilter, setPriceFilter] = useState(PRICE_RANGES[0]);
  const [locationFilter, setLocationFilter] = useState(LOCATIONS[0]);
  const [ratingFilter, setRatingFilter] = useState(RATING_OPTIONS[0]);
  const [bookModal, setBookModal] = useState<{ vendor: Vendor } | null>(null);
  const [userEvents, setUserEvents] = useState<EventData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [eventsLoading, setEventsLoading] = useState(false);

  const toggleFilter = (key: FilterKey) => {
    setOpenFilter(openFilter === key ? null : key);
  };

  const filteredVendors = useMemo(() => {
    let result = [...vendors];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(term) ||
          v.description.toLowerCase().includes(term) ||
          v.category.toLowerCase().includes(term),
      );
    }

    if (priceFilter.min > 0 || priceFilter.max < Infinity) {
      result = result.filter(
        (v) => v.rate >= priceFilter.min && v.rate <= priceFilter.max,
      );
    }

    if (locationFilter !== "Locations") {
      result = result.filter((v) => v.location === locationFilter);
    }

    if (ratingFilter.min > 0) {
      result = result.filter((v) => v.rating >= ratingFilter.min);
    }

    return result;
  }, [searchTerm, priceFilter, locationFilter, ratingFilter]);

  const hasActiveFilters =
    priceFilter.label !== "Prices" ||
    locationFilter !== "Locations" ||
    ratingFilter.label !== "Rating";

  const clearFilters = () => {
    setPriceFilter(PRICE_RANGES[0]);
    setLocationFilter(LOCATIONS[0]);
    setRatingFilter(RATING_OPTIONS[0]);
    setSearchTerm("");
  };

  const handleBookClick = async (vendor: Vendor) => {
    if (autoBookEventId) {
      await bookToEvent(autoBookEventId, vendor);
      return;
    }

    setBookModal({ vendor });
    setSelectedEventId("");
    if (userEvents.length === 0) {
      setEventsLoading(true);
      try {
        const res = await axios.get<EventData[]>(
          `http://localhost:9000/events?userId=${user?.id}`,
        );
        setUserEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
      setEventsLoading(false);
    }
  };

  const bookToEvent = async (eventId: string, vendor: Vendor) => {
    try {
      const eventRes = await axios.get<EventData>(
        `http://localhost:9000/events/${eventId}`,
      );
      const event = eventRes.data;
      const existingBooked = event.bookedVendors || [];

      const alreadyBooked = existingBooked.some(
        (bv) => bv.vendorId === vendor.id,
      );
      if (alreadyBooked) return;

      await axios.patch(`http://localhost:9000/events/${eventId}`, {
        bookedVendors: [
          ...existingBooked,
          {
            vendorId: vendor.id,
            name: vendor.name,
            category: vendor.category,
            rate: vendor.rate,
            location: vendor.location,
            rating: vendor.rating,
            image: vendor.image,
          },
        ],
      });
      onVendorBooked?.();
    } catch (err) {
      console.error("Failed to book vendor", err);
    }
  };

  const handleConfirmBook = async () => {
    if (!selectedEventId || !bookModal) return;
    await bookToEvent(selectedEventId, bookModal.vendor);
    setBookModal(null);
  };

  const renderVendorCard = (vendor: Vendor) => {
    const categoryLabel =
      categories.find((c) => c.key === vendor.category)?.label ||
      vendor.category;

    return (
      <div className="vendor-card" key={vendor.id}>
        <img
          className="vendor-image"
          src={vendor.image}
          alt={vendor.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (
              (e.target as HTMLImageElement).nextElementSibling as HTMLElement
            ).style.display = "flex";
          }}
        />
        <div className="vendor-image-placeholder" style={{ display: "none" }}>
          {vendor.name.charAt(0)}
        </div>
        <div className="vendor-body">
          <p className="vendor-name">{vendor.name}</p>
          <p className="vendor-rate">GHS {vendor.rate.toLocaleString()}</p>
          <p className="vendor-location">
            {vendor.location} &middot; {categoryLabel}
          </p>
          <p className="vendor-rating">
            {"⭐".repeat(Math.floor(vendor.rating))} {vendor.rating}
          </p>
          <p className="vendor-desc">{vendor.description}</p>
          <button className="book-btn" onClick={() => handleBookClick(vendor)}>
            Book Service
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="services-page">
      <h1 className="services-head">Find Vendor Services</h1>

      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search vendors by name, description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" onClick={() => {}}>
          Search
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <button
            className={`filter-btn ${priceFilter.label !== "Prices" ? "active" : ""}`}
            onClick={() => toggleFilter("price")}
          >
            {priceFilter.label} <IoChevronDown size={14} />
          </button>
          {openFilter === "price" && (
            <div className="filter-dropdown">
              {PRICE_RANGES.map((pr) => (
                <button
                  key={pr.label}
                  className={
                    priceFilter.label === pr.label ? "active-option" : ""
                  }
                  onClick={() => {
                    setPriceFilter(pr);
                    setOpenFilter(null);
                  }}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="filter-group">
          <button
            className={`filter-btn ${locationFilter !== "Locations" ? "active" : ""}`}
            onClick={() => toggleFilter("location")}
          >
            {locationFilter} <IoChevronDown size={14} />
          </button>
          {openFilter === "location" && (
            <div className="filter-dropdown">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  className={locationFilter === loc ? "active-option" : ""}
                  onClick={() => {
                    setLocationFilter(loc);
                    setOpenFilter(null);
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="filter-group">
          <button
            className={`filter-btn ${ratingFilter.label !== "Rating" ? "active" : ""}`}
            onClick={() => toggleFilter("rating")}
          >
            {ratingFilter.label} <IoChevronDown size={14} />
          </button>
          {openFilter === "rating" && (
            <div className="filter-dropdown">
              {RATING_OPTIONS.map((ro) => (
                <button
                  key={ro.label}
                  className={
                    ratingFilter.label === ro.label ? "active-option" : ""
                  }
                  onClick={() => {
                    setRatingFilter(ro);
                    setOpenFilter(null);
                  }}
                >
                  {ro.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {filteredVendors.length === 0 ? (
        <div className="no-results">
          <h3>No vendors found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="vendor-grid">
          {filteredVendors.map(renderVendorCard)}
        </div>
      )}

      {bookModal && (
        <div
          className="book-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBookModal(null);
          }}
        >
          <div className="book-modal">
            <div className="book-modal-header">
              <h3>Book {bookModal.vendor.name}</h3>
              <button
                className="book-modal-close"
                onClick={() => setBookModal(null)}
              >
                <IoClose size={22} />
              </button>
            </div>
            <div className="book-modal-body">
              <p>Select an event to add this service to:</p>
              {eventsLoading ? (
                <p>Loading events...</p>
              ) : userEvents.length === 0 ? (
                <p>
                  No events found.{" "}
                  <button
                    type="button"
                    className="clear-filters-btn"
                    style={{ padding: 0 }}
                    onClick={() =>
                      navigate("/page-layout/event", {
                        state: { user },
                      })
                    }
                  >
                    Create one
                  </button>
                </p>
              ) : (
                <select
                  className="event-select"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  <option value="">-- Select event --</option>
                  {userEvents.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="book-modal-actions">
              <button
                className="book-confirm-btn"
                disabled={!selectedEventId}
                onClick={handleConfirmBook}
              >
                Confirm Booking
              </button>
              <button
                className="book-cancel-btn"
                onClick={() => setBookModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorMarketplace;
