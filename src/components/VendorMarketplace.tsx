import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { categories, vendors } from "../data/vendors";
import type { Vendor, BookedVendor } from "../entities/Vendor";
import type { EventData } from "../entities/EventData";
import type { User } from "../entities/User";
import { IoSearch } from "react-icons/io5";
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

interface Props {
  user: User;
  autoBookEventId?: string;
  onVendorBooked?: () => void;
}

function VendorMarketplace({ user, autoBookEventId, onVendorBooked }: Props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState(priceRange[0]);
  const [locationFilter, setLocationFilter] = useState(cityCapital[0]);
  const [ratingFilter, setRatingFilter] = useState(ratings[0]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [contactVendor, setContactVendor] = useState<Vendor | null>(null);
  const [userEvents, setUserEvents] = useState<EventData[]>([]);
  const [showEventSelect, setShowEventSelect] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [eventsLoading, setEventsLoading] = useState(false);
  const [bookedVendors, setBookedVendors] = useState<BookedVendor[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPositions, setDropdownPositions] = useState<Record<string, number>>({});
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const filterRowRef = useRef<HTMLDivElement>(null);

  const getDropdownPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const dropdownWidth = 160;
      const screenWidth = window.innerWidth;
      const padding = 16;
      
      let left = rect.left;
      
      // Prevent dropdown from going off the right edge
      if (left + dropdownWidth > screenWidth - padding) {
        left = screenWidth - dropdownWidth - padding;
      }
      
      // Prevent dropdown from going off the left edge
      if (left < padding) {
        left = padding;
      }
      
      return { left, top: rect.bottom };
    }
    return { left: 16, top: 0 };
  };

  const handleDropdownOpen = (name: string, ref: React.RefObject<HTMLDivElement | null>) => {
    const pos = getDropdownPos(ref);
    setDropdownPositions((prev) => ({ ...prev, [name + "_left"]: pos.left, [name + "_top"]: pos.top }));
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    if (autoBookEventId) {
      axios
        .get<EventData>(`http://localhost:9000/events/${autoBookEventId}`)
        .then((res) => setBookedVendors(res.data.bookedVendors || []))
        .catch((err) => console.error("Failed to fetch booked vendors", err));
    }
  }, [autoBookEventId]);

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

  const doSearch = () => {
    setSearchTerm(searchInput);
  };

  const clearFilters = () => {
    setActiveCategory(null);
    setExpandedCategory(null);
    setPriceFilter(priceRange[0]);
    setLocationFilter(cityCapital[0]);
    setRatingFilter(ratings[0]);
    setSearchTerm("");
    setSearchInput("");
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
      setBookedVendors([
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
      ]);
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

  const handleRemoveFromEvent = async (vendor: Vendor) => {
    if (!autoBookEventId) return;
    try {
      const eventRes = await axios.get<EventData>(
        `http://localhost:9000/events/${autoBookEventId}`,
      );
      const event = eventRes.data;
      const existingBooked = event.bookedVendors || [];
      const updatedBooked = existingBooked.filter(
        (bv) => bv.vendorId !== vendor.id,
      );

      await axios.patch(`http://localhost:9000/events/${autoBookEventId}`, {
        bookedVendors: updatedBooked,
      });
      setBookedVendors(updatedBooked);
      onVendorBooked?.();
      setSelectedVendor(null);
    } catch (err) {
      console.error("Failed to remove vendor", err);
    }
  };

  const handleContact = async (vendor: Vendor) => {
    setContactVendor(vendor);
    if (autoBookEventId) {
      try {
        const eventRes = await axios.get<EventData>(
          `http://localhost:9000/events/${autoBookEventId}`,
        );
        const event = eventRes.data;
        const existingBooked = event.bookedVendors || [];
        const existingIndex = existingBooked.findIndex(
          (bv) => bv.vendorId === vendor.id,
        );

        if (existingIndex >= 0) {
          if (!existingBooked[existingIndex].contacted) {
            const updatedBooked = [...existingBooked];
            updatedBooked[existingIndex] = {
              ...updatedBooked[existingIndex],
              contacted: true,
            };
            await axios.patch(
              `http://localhost:9000/events/${autoBookEventId}`,
              {
                bookedVendors: updatedBooked,
              },
            );
            setBookedVendors(updatedBooked);
            onVendorBooked?.();
          }
        } else {
          const newBookedVendor = {
            vendorId: vendor.id,
            name: vendor.name,
            owner: vendor.owner,
            category: vendor.category,
            rate: vendor.rate,
            location: vendor.location,
            rating: vendor.rating,
            image: vendor.image,
            contacted: true,
          };
          await axios.patch(`http://localhost:9000/events/${autoBookEventId}`, {
            bookedVendors: [...existingBooked, newBookedVendor],
          });
          setBookedVendors([...existingBooked, newBookedVendor]);
          onVendorBooked?.();
        }
      } catch (err) {
        console.error("Failed to mark vendor as contacted", err);
      }
    }
  };

  const renderVendorCard = (vendor: Vendor) => {
    const booked = bookedVendors.find((bv) => bv.vendorId === vendor.id);
    return (
      <div
        className="vendor-card"
        key={vendor.id}
        onClick={() => setSelectedVendor(vendor)}
      >
        <div className="vendor-card-img-wrapper">
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
          {booked && (
            <span
              className={`vendor-status-tag ${booked.contacted ? "vendor-status-contacted" : "vendor-status-booked"}`}
            >
              {booked.contacted ? "Contacted" : "Booked"}
            </span>
          )}
        </div>
        <div className="vendor-body">
          <p className="vendor-name">{vendor.name}</p>
          <p className="vendor-rate">
            GHS {vendor.rate.toLocaleString()} / day
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="services-page">
      <div className="search-filter-row">
        <div className="filter-row" ref={filterRowRef}>
          <div className="filter-row-scroll">
            <div className="filter-dropdown-wrapper" id="filter-category" ref={categoryRef}>
              <button
                className={`filter-btn ${activeCategory ? "active" : ""}`}
                onClick={() => handleDropdownOpen("category", categoryRef)}
              >
                {activeCategory
                  ? categories.find((c) => c.key === activeCategory)?.label
                  : "Categories"}
              </button>
            </div>

            <div className="filter-dropdown-wrapper" id="filter-location" ref={locationRef}>
              <button
                className={`filter-btn ${locationFilter !== "Locations" ? "active" : ""}`}
                onClick={() => handleDropdownOpen("location", locationRef)}
              >
                {locationFilter}
              </button>
            </div>

            <div className="filter-dropdown-wrapper" id="filter-price" ref={priceRef}>
              <button
                className={`filter-btn ${priceFilter.label !== "Prices" ? "active" : ""}`}
                onClick={() => handleDropdownOpen("price", priceRef)}
              >
                {priceFilter.label}
              </button>
            </div>

            <div className="filter-dropdown-wrapper" id="filter-rating" ref={ratingRef}>
              <button
                className={`filter-btn ${ratingFilter.label !== "Rating" ? "active" : ""}`}
                onClick={() => handleDropdownOpen("rating", ratingRef)}
              >
                {ratingFilter.label}
              </button>
            </div>

            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>

          {openDropdown === "category" && (
            <div className="filter-dropdown filter-dropdown--fixed" style={{ left: dropdownPositions.category_left || 0, top: dropdownPositions.category_top || 0 }}>
              <button
                className="filter-dropdown-item"
                onClick={() => {
                  setActiveCategory(null);
                  setOpenDropdown(null);
                }}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className="filter-dropdown-item"
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setOpenDropdown(null);
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
          {openDropdown === "location" && (
            <div className="filter-dropdown filter-dropdown--fixed" style={{ left: dropdownPositions.location_left || 0, top: dropdownPositions.location_top || 0 }}>
              {cityCapital.map((city) => (
                <button
                  key={city}
                  className="filter-dropdown-item"
                  onClick={() => {
                    setLocationFilter(city);
                    setOpenDropdown(null);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
          {openDropdown === "price" && (
            <div className="filter-dropdown filter-dropdown--fixed" style={{ left: dropdownPositions.price_left || 0, top: dropdownPositions.price_top || 0 }}>
              {priceRange.map((price) => (
                <button
                  key={price.label}
                  className="filter-dropdown-item"
                  onClick={() => {
                    setPriceFilter(price);
                    setOpenDropdown(null);
                  }}
                >
                  {price.label}
                </button>
              ))}
            </div>
          )}
          {openDropdown === "rating" && (
            <div className="filter-dropdown filter-dropdown--fixed" style={{ left: dropdownPositions.rating_left || 0, top: dropdownPositions.rating_top || 0 }}>
              {ratings.map((rating) => (
                <button
                  key={rating.label}
                  className="filter-dropdown-item"
                  onClick={() => {
                    setRatingFilter(rating);
                    setOpenDropdown(null);
                  }}
                >
                  {rating.label}
                </button>
              ))}
            </div>
          )}

          <div className="search-bar-desktop">
            <button
              className="search-bar-icon-btn"
              onClick={doSearch}
              type="button"
            >
              <IoSearch size={18} className="search-bar-icon" />
            </button>
            <input
              type="text"
              className="search-bar-input"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (!e.target.value.trim()) setSearchTerm("");
              }}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
            />
          </div>
        </div>
        <div className="search-row-mobile">
          <button className="search-icon-btn" onClick={doSearch} type="button">
            <IoSearch size={20} />
          </button>
          <input
            ref={mobileSearchRef}
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (!e.target.value.trim()) setSearchTerm("");
            }}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
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
          isBooked={bookedVendors.some(
            (bv) => bv.vendorId === selectedVendor.id,
          )}
          onClose={() => {
            setSelectedVendor(null);
            setShowEventSelect(false);
          }}
          onAddToEvent={handleAddToEvent}
          onRemoveFromEvent={handleRemoveFromEvent}
          onContact={handleContact}
        />
      )}

      {showEventSelect && selectedVendor && (
        <div
          className="book-modal-overlay"
          onClick={() => setShowEventSelect(false)}
        >
          <div className="book-modal" onClick={(e) => e.stopPropagation()}>
            <div className="book-modal-header">
              <h3>Add {selectedVendor.name} to Event</h3>
              <button
                className="book-modal-close"
                onClick={() => setShowEventSelect(false)}
              >
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
