import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import type { EventData } from "../entities/EventData";
import type { HotelProps } from "../entities/HotelProps";
import { locations } from "../hooks/locations";
import { IoClose } from "react-icons/io5";
// import "../css/upcoming.css";

interface Props {
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onSave: (value: Partial<EventData>) => void;
}

const regions: string[] = [
  "Ashanti",
  "Brong Ahafo",
  "Central",
  "Greater Accra",
  "Western",
  "Northern",
];

function EventLocation({ onBack, onSave, onNext, onClose }: Props) {
  const [area, setArea] = useState<string>("");
  const [selectedHotel, setSelectedHotel] = useState<HotelProps | null>(null);

  const handleSubmit = () => {
    if (!selectedHotel) return;

    onSave({
      location: {
        name: selectedHotel.name,
        town: selectedHotel.town,
        city: selectedHotel.city,
        region: selectedHotel.region,
      },
    });
    onNext();
  };

  const filteredLocations = area
    ? locations.filter((location) => location.region === area)
    : [];

  const headerCity = filteredLocations[0]?.city;

  return (
    <div className="title">
      <div className="title-box">
        <div className="loc-text-box">
          <h4 className="title-head">Location</h4>
          <p className="example-text">Where will this event happen at?</p>
        </div>
        <div className="select-and-list">
          <select
            className="select-location"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option value=""> Select a Region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <div className="">
            <h2 className="city-head">{headerCity}</h2>
            <>
              <ul className="location-list">
                {filteredLocations.map((location) =>
                  location.hotels.map((hotel) => (
                    <li
                      key={hotel.name}
                      // FIX: Added a space before active-list
                      className={`list-group-item ${
                        selectedHotel?.name === hotel.name ? "active-list" : ""
                      }`}
                      onClick={() =>
                        setSelectedHotel({
                          name: hotel.name,
                          town: hotel.address,
                          city: location.city,
                          region: location.region,
                        })
                      }
                    >
                      <FaLocationDot className="" />
                      <div className="hotel-address">
                        <h3 className="hotel-name">{hotel.name}</h3>
                        <p className="loc-address">{hotel.address}</p>
                      </div>
                    </li>
                  )),
                )}
              </ul>
            </>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="left-btn"
          aria-label="Close"
        >
          <FaChevronLeft size={20} className="left-btn-icon" />
        </button>
        <button
          className={`${!selectedHotel ? "title-disable" : "title-btn"}`}
          disabled={!selectedHotel}
          onClick={handleSubmit}
        >
          Next
        </button>
        <button
          type="button"
          className="title-close-btn"
          aria-label="Close"
          onClick={onClose}
        >
          <IoClose size={20} className="close-btn-icon" />
        </button>
      </div>
    </div>
  );
}

export default EventLocation;
