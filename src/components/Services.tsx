import NavBar from "./NavBar";
import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { MdLocationOn, MdCloudUpload, MdArrowBack } from "react-icons/md";
import type { User } from "../entities/User";
import "../css/past-event.css";
import "../css/Services.css";

function Services() {
  const location = useLocation();
  const user: User = location.state?.user;
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [businessOverview, setBusinessOverview] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [travelRadius, setTravelRadius] = useState("");
  const [ninNumber, setNinNumber] = useState("");
  const [passportImage, setPassportImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstName = user?.firstname
    ? user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1)
    : "there";

  const isStep1Valid =
    businessName && businessOverview && businessLocation && travelRadius;
  const isStep2Valid = ninNumber && passportImage;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setImageError("Only PNG and JPEG files are accepted");
        setPassportImage(null);
        return;
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setImageError("File size must not exceed 10MB");
        setPassportImage(null);
        return;
      }
      setImageError("");
      setPassportImage(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStep(1);
    setBusinessName("");
    setBusinessOverview("");
    setBusinessLocation("");
    setTravelRadius("");
    setNinNumber("");
    setPassportImage(null);
    setImageError("");
  };

  return (
    <div className="page-bg">
      <NavBar header="Services" />
      <div className="services-content">
        <div className="services-provider-card">
          <img
            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=300&fit=crop"
            alt="Phone"
            className="services-provider-image"
          />
          <div className="services-provider-text">
            <h3 className="services-provider-head">Become a</h3>
            <h3 className="services-provider-head">service provider</h3>
            <p className="services-provider-desc">
              Hi {firstName} tap the button to activate
            </p>
            <p className="services-provider-desc">
              your service provider profile to start
            </p>
            <p className="services-provider-desc">
              offering your own services and products
            </p>
            <p className="services-provider-desc">customers</p>
            <button
              className="services-provider-btn"
              onClick={() => setShowModal(true)}
            >
              Get started
            </button>
            <a href="#" className="services-provider-link">
              Learn more
            </a>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="services-modal-overlay" onClick={handleCloseModal}>
          <div className="services-modal" onClick={(e) => e.stopPropagation()}>
            <div className="services-modal-header">
              {currentStep === 2 && (
                <button className="services-modal-back" onClick={handleBack}>
                  <MdArrowBack size={24} />
                </button>
              )}
              <h2 className="services-modal-title">Service provider form</h2>
            </div>
            {currentStep === 1 && (
              <>
                <div className="services-form-group">
                  <label className="services-label">Business name</label>
                  <input
                    type="text"
                    className="services-input"
                    placeholder="E.g James photography"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="services-form-group">
                  <label className="services-label">
                    Business Overview (about)
                  </label>
                  <textarea
                    className="services-textarea"
                    rows={4}
                    placeholder="write a description of what your business does"
                    value={businessOverview}
                    onChange={(e) => setBusinessOverview(e.target.value)}
                  ></textarea>
                </div>
                <div className="services-form-group">
                  <label className="services-label">Business location</label>
                  <div className="services-input-wrapper">
                    <MdLocationOn className="services-input-icon" />
                    <input
                      type="text"
                      className="services-input services-input-with-icon"
                      placeholder="Enter location"
                      value={businessLocation}
                      onChange={(e) => setBusinessLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div className="services-form-group">
                  <label className="services-label">Travel radius</label>
                  <select
                    className="services-select"
                    value={travelRadius}
                    onChange={(e) => setTravelRadius(e.target.value)}
                  >
                    <option value="">Select radius</option>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="25">25 km</option>
                    <option value="50">50 km</option>
                    <option value="100">100 km</option>
                  </select>
                </div>
                <div className="services-modal-buttons">
                  <button
                    className="services-modal-btn services-modal-btn-cancel"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="services-modal-btn services-modal-btn-continue"
                    disabled={!isStep1Valid}
                    onClick={handleContinue}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="services-form-group">
                  <label className="services-label">
                    National Insurance Number/TIN
                  </label>
                  <input
                    type="text"
                    className="services-input"
                    placeholder="Enter your NIN or TIN"
                    value={ninNumber}
                    onChange={(e) => setNinNumber(e.target.value)}
                  />
                </div>
                <div className="services-form-group">
                  <label className="services-label">
                    Upload a passport picture
                  </label>
                  <div
                    className="services-upload-box"
                    onClick={handleUploadClick}
                  >
                    <MdCloudUpload className="services-upload-icon" />
                    <p className="services-upload-text">
                      {passportImage
                        ? passportImage.name
                        : "tap here to attach a file (png,jpg, jpeg files not more than 10MB)"}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {imageError && (
                    <p className="services-upload-error">{imageError}</p>
                  )}
                </div>
                <div className="services-modal-buttons">
                  <button
                    className="services-modal-btn services-modal-btn-cancel"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="services-modal-btn services-modal-btn-continue"
                    disabled={!isStep2Valid}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
