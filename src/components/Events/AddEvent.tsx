import React, { useState } from "react";

type EventType = "online" | "offline";

interface FormDataType {
  eventName: string;
  about: string;
  guidelines: string[];
  eventType: EventType;
  fromDate: string;
  toDate: string;
  venueName: string;
  mapUrl?: string; // Optional
  website?: string; // Optional
  email: string;
  contactNumbers: string[];
  registrationUrl: string;
  isPaidEvent: boolean;
  price?: number; // Optional
  participantCount?: number; // Optional
  selectedFile: File | null;
  optionalImageFile: File | null;
}

const AddEvent: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    eventName: "",
    about: "",
    guidelines: [""],
    eventType: "online",
    fromDate: "",
    toDate: "",
    venueName: "",
    mapUrl: "",
    website: "",
    email: "",
    contactNumbers: [""],
    registrationUrl: "",
    isPaidEvent: false,
    price: 0,
    participantCount: 0,
    selectedFile: null,
    optionalImageFile: null, // This is required for optionalImageFile to exist in formData
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;

    // Handle checkbox inputs
    const checked =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : undefined;

    // Handle file inputs
    const file =
      type === "file" && e.target instanceof HTMLInputElement
        ? e.target.files?.[0] // Get the first selected file
        : undefined;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : type === "file" ? file : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof Pick<FormDataType, "selectedFile" | "optionalImageFile">
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [key]: file,
      }));
    }
  };

  const handleOptionalFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      optionalImageFile: file,
    }));
  };

  const handleAddGuideline = () => {
    setFormData((prev) => ({
      ...prev,
      guidelines: [...prev.guidelines, ""],
    }));
  };

  const handleGuidelineChange = (index: number, value: string) => {
    const updatedGuidelines = [...formData.guidelines];
    updatedGuidelines[index] = value;
    setFormData((prev) => ({
      ...prev,
      guidelines: updatedGuidelines,
    }));
  };

  const handleRemoveGuideline = (index: number) => {
    const updatedGuidelines = formData.guidelines.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      guidelines: updatedGuidelines,
    }));
  };

  const handleAddContactNumber = () => {
    setFormData((prev) => ({
      ...prev,
      contactNumbers: [...prev.contactNumbers, ""],
    }));
  };

  const handleContactNumberChange = (index: number, value: string) => {
    const updatedContacts = [...formData.contactNumbers];
    updatedContacts[index] = value;
    setFormData((prev) => ({
      ...prev,
      contactNumbers: updatedContacts,
    }));
  };

  const handleRemoveContactNumber = (index: number) => {
    const updatedContacts = formData.contactNumbers.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      contactNumbers: updatedContacts,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: Send `formData` to the backend when ready
    console.log("Submitting form data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Event</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Event Name */}
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-700 text-sm font-bold"
              htmlFor="eventName"
            >
              Event Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="eventName"
              placeholder="Enter event name"
              value={formData.eventName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Event Image */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm font-bold">
              Event Image <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById("eventImage")?.click()}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Upload Image
              </button>
              {formData.selectedFile && (
                <span className="text-gray-600 text-sm">
                  {formData.selectedFile.name}
                </span>
              )}
            </div>
            <input
              type="file"
              id="eventImage"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "selectedFile")}
            />
          </div>

          {/* Display Image Preview */}
          {formData.selectedFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">Selected Image:</p>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(formData.selectedFile)}
                  alt="Selected Event"
                  className="w-full h-64 object-contain"
                />
              </div>
            </div>
          )}

          {/* About */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm font-bold" htmlFor="about">
              About <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="about"
              rows={4}
              placeholder="Enter event description"
              value={formData.about}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* Details Heading */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Details</h2>

          {/* Guidelines Section */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm font-bold">
              Guidelines <span className="text-red-500 ml-1">*</span>
            </label>
            {formData.guidelines.map((guideline, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={guideline}
                  onChange={(e) => handleGuidelineChange(index, e.target.value)}
                  placeholder={`Guideline ${index + 1}`}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveGuideline(index)}
                    className="bg-red-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddGuideline}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Add Guideline
            </button>
          </div>

          {/* Event Type */}
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-700 text-sm font-bold"
              htmlFor="eventType"
            >
              Event Type <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="eventType"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Event Dates */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <div className="flex flex-col gap-2 flex-grow">
              <label
                className="text-gray-700 text-sm font-bold"
                htmlFor="fromDate"
              >
                From <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                id="fromDate"
                value={formData.fromDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 flex-grow">
              <label
                className="text-gray-700 text-sm font-bold"
                htmlFor="toDate"
              >
                To <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                id="toDate"
                value={formData.toDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Venue */}
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-700 text-sm font-bold"
              htmlFor="venueName"
            >
              Venue Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="venueName"
              value={formData.venueName}
              onChange={handleInputChange}
              placeholder="Enter venue name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />

            <label className="text-gray-700 text-sm font-bold" htmlFor="mapUrl">
              Google Map Embedded Link
            </label>
            <input
              type="url"
              id="mapUrl"
              placeholder="Enter Google Maps embedded link"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              value={formData.mapUrl} // Bind the value to formData
              onChange={handleInputChange} // Use the central handler
            />

            {formData.mapUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">Map Preview:</p>
                <iframe
                  src={formData.mapUrl}
                  className="w-full h-64 border rounded-lg"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            )}
          </div>

          {/* Additional Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm font-bold">
              Optional Image
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("optionalImage")?.click()
                }
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Upload Image
              </button>
              {formData.optionalImageFile && (
                <span className="text-gray-600 text-sm">
                  {formData.optionalImageFile.name}
                </span>
              )}
            </div>
            <input
              type="file"
              id="optionalImage"
              accept="image/*"
              className="hidden"
              onChange={handleOptionalFileChange}
            />
          </div>

          {formData.optionalImageFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">Optional Image Preview:</p>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(formData.optionalImageFile)}
                  alt="Optional Event"
                  className="w-full h-64 object-contain"
                />
              </div>
            </div>
          )}

          {/* Website */}
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-700 text-sm font-bold"
              htmlFor="website"
            >
              Website
            </label>
            <input
              type="url"
              id="website"
              placeholder="Enter website URL"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm font-bold" htmlFor="email">
              Email <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Contact Numbers Section */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm font-bold">
              Contact Numbers <span className="text-red-500 ml-1">*</span>
            </label>
            {formData.contactNumbers.map((contact, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="number"
                  value={contact}
                  onChange={(e) =>
                    handleContactNumberChange(index, e.target.value)
                  }
                  placeholder={`Contact Number ${index + 1}`}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveContactNumber(index)}
                    className="bg-red-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddContactNumber}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Add Contact Number
            </button>
          </div>

          {/* Registration URL */}
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-700 text-sm font-bold"
              htmlFor="registrationUrl"
            >
              Registration URL <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="url"
              id="registrationUrl"
              value={formData.registrationUrl}
              onChange={handleInputChange}
              placeholder="Enter registration URL"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Paid Event Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPaidEvent"
              checked={formData.isPaidEvent}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
            />
            <label htmlFor="isPaidEvent" className="text-gray-700 font-bold">
              Is this a paid event?
            </label>
          </div>

          {/* Price and Participant Count */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            {/* Conditional Price Input */}
            {formData.isPaidEvent && (
              <div className="flex flex-col gap-2 flex-grow">
                <label
                  className="text-gray-700 text-sm font-bold"
                  htmlFor="price"
                >
                  Price <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
            )}

            <div className="flex flex-col gap-2 flex-grow">
              <label
                className="text-gray-700 text-sm font-bold"
                htmlFor="participantCount"
              >
                Participant Count <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                id="participantCount"
                value={formData.participantCount}
                onChange={handleInputChange}
                placeholder="Enter expected participant count"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
