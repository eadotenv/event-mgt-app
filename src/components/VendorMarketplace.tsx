import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { categories, vendors } from "../data/vendors";
import type { Vendor } from "../entities/Vendor";
import type { EventData } from "../entities/EventData";
import type { User } from "../entities/User";
import { IoChevronDown, IoSearch } from "react-icons/io5";
import "../css/services.css";
import VendorDetailModal from "./VendorDetailModal";
import ContactModal from "./ContactModal";

const priceRange = [
  { label: "Prices", min: 0, max: Infinity },
  { label: "Under GHS 1,500", min: 0, max: 1500 },
  { label: "GHS 1,500 – 3,000", min: 1500, max: 3000 },
  { label: "GHS 3,000 – 5,000", min: 3000, max: 5000 },
  { label: "Above GHS 5,000", min: 5000, max: Infinity },
];

const cityCapital = [
  "Locations",
  "Accra",
  "Kumasi",
  "Takoradi",
  "Tema",
  "Cape Coast",
  "Tamale",
];

const ratings = [
  { label: "Rating", min: 0 },
  { label: "4.5 & up", min: 4.5 },
  { label: "4.0 & up", min: 4.0 },
  { label: "3.5 & up", min: 3.5 },
];

type FilterKey = "price" | "location" | "category" | "rating";

interface Props {
  user: User;
  autoBookEventId?: string;
  onVendorBooked?: () => void;
}

function VendorMarketplace({ user, autoBookEventId, onVendorBooked }: Props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [priceFilter, setPriceFilter] = useState(priceRange[0]);
  const [locationFilter, setLocationFilter] = useState(cityCapital[0]);
  const [ratingFilter, setRatingFilter] = useState(ratings[0]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [contactVendor, setContactVendor] = useState<Vendor | null>(null);
  const [userEvents, setUserEvents] = useState<EventData[]>([]);
  const [showEventSelect, setShowEventSelect] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
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

    if (locationFilter !== "Locations") {
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
    priceFilter.label !== "Prices" ||
    locationFilter !== "Locations" ||
    ratingFilter.label !== "Rating";

  const clearFilters = () => {
    setActiveCategory(null);
    setExpandedCategory(null);
    setPriceFilter(priceRange[0]);
    setLocationFilter(cityCapital[0]);
    setRatingFilter(ratings[0]);
    setSearchTerm("");
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
            owner: vendor.owner,
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

  const handleAddToEvent = async (vendor: Vendor) => {
    if (autoBookEventId) {
      await bookToEvent(autoBookEventId, vendor);
      setSelectedVendor(null);
      return;
    }

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
    setShowEventSelect(true);
  };

  const handleConfirmAddToEvent = async () => {
    if (!selectedEventId || !selectedVendor) return;
    await bookToEvent(selectedEventId, selectedVendor);
    setShowEventSelect(false);
    setSelectedVendor(null);
  };

  const handleContact = (vendor: Vendor) => {
    setContactVendor(vendor);
  };

  const renderVendorCard = (vendor: Vendor) => {
    return (
      <div className="vendor-card" key={vendor.id} onClick={() => setSelectedVendor(vendor)}>
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
        </div>
      </div>
    );
  };

  return (
    <div className="services-page">
      <div className="search-filter-row">
        <div className="filter-row">
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
                    className={
                      activeCategory === cat.key ? "active-option" : ""
                    }
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
              className={`filter-btn ${priceFilter.label !== "Prices" ? "active" : ""}`}
              onClick={() => toggleFilter("price")}
            >
              {priceFilter.label} <IoChevronDown size={14} />
            </button>
            {openFilter === "price" && (
              <div className="filter-dropdown">
                {priceRange.map((pr) => (
                  <button
                    key={pr.label}
                    className={
                      priceFilter.label === pr.label ? "active-option" : ""
                    }
                    onClick={() => {
                      setPriceFilter(pr);
                      setActiveCategory(null);
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
                {cityCapital.map((loc) => (
                  <button
                    key={loc}
                    className={locationFilter === loc ? "active-option" : ""}
                    onClick={() => {
                      setLocationFilter(loc);
                      setActiveCategory(null);
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
                {ratings.map((ro) => (
                  <button
                    key={ro.label}
                    className={
                      ratingFilter.label === ro.label ? "active-option" : ""
                    }
                    onClick={() => {
                      setRatingFilter(ro);
                      setActiveCategory(null);
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
        <div className="search-row-mobile">
          <button className="search-icon-btn" onClick={() => {}}>
            <IoSearch size={20} />
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
          const isExpanded = expandedCategory === catKey;
          const displayedVendors = isExpanded
            ? catVendors
            : catVendors.slice(0, 4);

          return (
            <div className="category-section" key={catKey}>
              <div className="category-header">
                <h2 className="category-title">{catLabel}</h2>
              </div>
              <div className="vendor-grid">
                {displayedVendors.map(renderVendorCard)}
              </div>
              <button
                className="view-more-btn"
                onClick={() => setExpandedCategory(isExpanded ? null : catKey)}
              >
                {isExpanded ? "View Less" : `View More `}
              </button>
            </div>
          );
        })
      )}

      {selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={() => {
            setSelectedVendor(null);
            setShowEventSelect(false);
          }}
          onAddToEvent={handleAddToEvent}
          onContact={handleContact}
        />
      )}

      {showEventSelect && selectedVendor && (
        <div className="book-modal-overlay" onClick={() => setShowEventSelect(false)}>
          <div className="book-modal" onClick={(e) => e.stopPropagation()}>
            <div className="book-modal-header">
              <h3>Add {selectedVendor.name} to Event</h3>
              <button className="book-modal-close" onClick={() => setShowEventSelect(false)}>
                ×
              </button>
            </div>
            <div className="book-modal-body">
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
                onClick={handleConfirmAddToEvent}
              >
                Add to Event
              </button>
              <button
                className="book-cancel-btn"
                onClick={() => setShowEventSelect(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {contactVendor && (
        <ContactModal
          vendor={contactVendor}
          onClose={() => setContactVendor(null)}
        />
      )}
    </div>
  );
}

export default VendorMarketplace;
