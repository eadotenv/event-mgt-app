import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { categories, vendors } from "../data/vendors";
import type { Vendor } from "../entities/Vendor";
import type { EventData } from "../entities/EventData";
import type { User } from "../entities/User";
import { IoClose, IoChevronDown } from "react-icons/io5";
import "../css/services.css";

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under GHS 1,500", min: 0, max: 1500 },
  { label: "GHS 1,500 – 3,000", min: 1500, max: 3000 },
  { label: "GHS 3,000 – 5,000", min: 3000, max: 5000 },
  { label: "Above GHS 5,000", min: 5000, max: Infinity },
];

const LOCATIONS = ["All Locations", "Accra", "Kumasi", "Takoradi", "Tema", "Cape Coast", "Tamale"];

const RATING_OPTIONS = [
  { label: "Any Rating", min: 0 },
  { label: "4.5 & up", min: 4.5 },
  { label: "4.0 & up", min: 4.0 },
  { label: "3.5 & up", min: 3.5 },
];

type FilterKey = "price" | "location" | "category" | "rating";

function Services() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user as User;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
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

  const handleCategoryClick = (key: string) => {
    setActiveCategory(activeCategory === key ? null : key);
    setOpenFilter(null);
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

    if (activeCategory) {
      result = result.filter((v) => v.category === activeCategory);
    }

    if (priceFilter.min > 0 || priceFilter.max < Infinity) {
      result = result.filter(
        (v) => v.rate >= priceFilter.min && v.rate <= priceFilter.max,
      );
    }

    if (locationFilter !== "All Locations") {
      result = result.filter((v) => v.location === locationFilter);
    }

    if (ratingFilter.min > 0) {
      result = result.filter((v) => v.rating >= ratingFilter.min);
    }

    return result;
  }, [searchTerm, activeCategory, priceFilter, locationFilter, ratingFilter]);

  const groupedVendors = useMemo(() => {
    const groups: Record<string, Vendor[]> = {};
    for (const v of filteredVendors) {
      if (!groups[v.category]) groups[v.category] = [];
      groups[v.category].push(v);
    }
    return groups;
  }, [filteredVendors]);

  const hasActiveFilters =
    activeCategory !== null ||
    priceFilter.label !== "All Prices" ||
    locationFilter !== "All Locations" ||
    ratingFilter.label !== "Any Rating";

  const clearFilters = () => {
    setActiveCategory(null);
    setPriceFilter(PRICE_RANGES[0]);
    setLocationFilter(LOCATIONS[0]);
    setRatingFilter(RATING_OPTIONS[0]);
    setSearchTerm("");
  };

  const handleBookClick = async (vendor: Vendor) => {
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

  const handleConfirmBook = async () => {
    if (!selectedEventId || !bookModal) return;

    try {
      const eventRes = await axios.get<EventData>(
        `http://localhost:9000/events/${selectedEventId}`,
      );
      const event = eventRes.data;
      const existingBooked = event.bookedVendors || [];

      const alreadyBooked = existingBooked.some(
        (bv) => bv.vendorId === bookModal.vendor.id,
      );
      if (alreadyBooked) {
        setBookModal(null);
        return;
      }

      await axios.patch(
        `http://localhost:9000/events/${selectedEventId}`,
        {
          bookedVendors: [
            ...existingBooked,
            {
              vendorId: bookModal.vendor.id,
              name: bookModal.vendor.name,
              category: bookModal.vendor.category,
              rate: bookModal.vendor.rate,
              location: bookModal.vendor.location,
              rating: bookModal.vendor.rating,
              image: bookModal.vendor.image,
              status: "pending" as const,
            },
          ],
        },
      );
      setBookModal(null);
    } catch (err) {
      console.error("Failed to book vendor", err);
    }
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
              (e.target as HTMLImageElement)
                .nextElementSibling as HTMLElement
            ).style.display = "flex";
          }}
        />
        <div
          className="vendor-image-placeholder"
          style={{ display: "none" }}
        >
          {vendor.name.charAt(0)}
        </div>
        <div className="vendor-body">
          <p className="vendor-name">{vendor.name}</p>
          <p className="vendor-rate">GHS {vendor.rate.toLocaleString()}</p>
          <p className="vendor-location">
            {vendor.location} &middot; {categoryLabel}
          </p>
          <p className="vendor-rating">{"⭐".repeat(Math.floor(vendor.rating))} {vendor.rating}</p>
          <p className="vendor-desc">{vendor.description}</p>
          <button
            className="book-btn"
            onClick={() => handleBookClick(vendor)}
          >
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
            className={`filter-btn ${priceFilter.label !== "All Prices" ? "active" : ""}`}
            onClick={() => toggleFilter("price")}
          >
            {priceFilter.label} <IoChevronDown size={14} />
          </button>
          {openFilter === "price" && (
            <div className="filter-dropdown">
              {PRICE_RANGES.map((pr) => (
                <button
                  key={pr.label}
                  className={priceFilter.label === pr.label ? "active-option" : ""}
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
            className={`filter-btn ${locationFilter !== "All Locations" ? "active" : ""}`}
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
            className={`filter-btn ${activeCategory ? "active" : ""}`}
            onClick={() => toggleFilter("category")}
          >
            {activeCategory
              ? categories.find((c) => c.key === activeCategory)?.label
              : "Categories"}{" "}
            <IoChevronDown size={14} />
          </button>
          {openFilter === "category" && (
            <div className="filter-dropdown">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={activeCategory === cat.key ? "active-option" : ""}
                  onClick={() => handleCategoryClick(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="filter-group">
          <button
            className={`filter-btn ${ratingFilter.label !== "Any Rating" ? "active" : ""}`}
            onClick={() => toggleFilter("rating")}
          >
            {ratingFilter.label} <IoChevronDown size={14} />
          </button>
          {openFilter === "rating" && (
            <div className="filter-dropdown">
              {RATING_OPTIONS.map((ro) => (
                <button
                  key={ro.label}
                  className={ratingFilter.label === ro.label ? "active-option" : ""}
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
        Object.keys(groupedVendors).map((catKey) => {
          const catVendors = groupedVendors[catKey];
          const catLabel =
            categories.find((c) => c.key === catKey)?.label || catKey;
          const displayedVendors = activeCategory
            ? catVendors
            : catVendors.slice(0, 4);

          return (
            <div className="category-section" key={catKey}>
              <div className="category-header">
                <h2 className="category-title">{catLabel}</h2>
                {!activeCategory && catVendors.length > 4 && (
                  <button
                    className="view-more-btn"
                    onClick={() => setActiveCategory(catKey)}
                  >
                    View More ({catVendors.length})
                  </button>
                )}
              </div>
              <div className="vendor-grid">
                {displayedVendors.map(renderVendorCard)}
              </div>
            </div>
          );
        })
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

export default Services;
