import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
type EventType = "online" | "offline";

interface VenueType {
  name: string;
  mapUrl: string;
}

interface DetailType {
  name: string;
  about: string;
  from: string;
  to: string;
  type: EventType;
  venue: VenueType;
}

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
  emails: string[];
  contactNumbers: string[];
  registrationUrl: string;
  isPaidEvent: boolean;
  price?: number; // Optional
  participantCount?: number; // Optional
  selectedFile: File | null;
  optionalImageFile: File | null;
  details: DetailType[]; // Added
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
    emails: [""],
    contactNumbers: [""],
    registrationUrl: "",
    isPaidEvent: false,
    price: 0,
    participantCount: 0,
    selectedFile: null,
    optionalImageFile: null,
    details: [
      {
        name: "",
        about: "",
        from: "",
        to: "",
        type: "online",
        venue: {
          name: "",
          mapUrl: "",
        },
      },
    ],
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

  // const handleOptionalFileChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   setFormData((prev) => ({
  //     ...prev,
  //     optionalImageFile: file,
  //   }));
  // };

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

  const handleAddEmail = () => {
    setFormData((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...formData.emails];
    updatedEmails[index] = value;
    setFormData((prev) => ({
      ...prev,
      emails: updatedEmails,
    }));
  };

  const handleRemoveEmail = (index: number) => {
    const updatedEmails = formData.emails.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      emails: updatedEmails,
    }));
  };

  const handleDetailFieldChange = (index, field, value, subField = null) => {
    setFormData((prevState) => {
      const updatedDetails = [...prevState.details];
      if (subField) {
        updatedDetails[index][field][subField] = value;
      } else {
        updatedDetails[index][field] = value;
      }
      return { ...prevState, details: updatedDetails };
    });
  };

  const addSubEvent = () => {
    setFormData((prevState) => ({
      ...prevState,
      details: [
        ...prevState.details,
        {
          name: "",
          about: "",
          from: "",
          to: "",
          type: "online",
          venue: {
            name: "",
            mapUrl: "",
          },
        },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isPaidEvent, website, price, eventName, about, registrationUrl } =
      formData;

    console.log("formData", formData);

    // Validation checks
    if (!eventName.trim()) {
      toast.error("Event name is required!");
      return;
    }

    if (!about.trim()) {
      toast.error("Event description is required!");
      return;
    }

    if (!registrationUrl.trim()) {
      toast.error("Registration URL is required!");
      return;
    }

    if (formData.details.length === 0) {
      toast.error("At least one sub-event is required!");
      return;
    }

    for (const [index, detail] of formData.details.entries()) {
      if (!detail.name.trim()) {
        toast.error(`Sub Event ${index + 1} must have a name!`);
        return;
      }
      if (!detail.about.trim()) {
        toast.error(`Sub Event ${index + 1} must have a description!`);
        return;
      }
      if (!detail.from || !detail.to) {
        toast.error(`Sub Event ${index + 1} must have valid dates!`);
        return;
      }
    }

    if (isPaidEvent) {
      if (!price || isNaN(price) || price <= 0) {
        toast.error(
          "Price is required and must be a valid positive number for paid events!"
        );
        return;
      }
      if (!website.trim()) {
        toast.error("Website URL is required for paid events!");
        return;
      }
    }

    // Convert dates to ISO format
    const fromISO = new Date(formData.fromDate).toISOString();
    const toISO = new Date(formData.toDate).toISOString();

    // Create FormData
    const formDataToSend = new FormData();
    formDataToSend.append("name", eventName);
    formDataToSend.append("about", about);
    formDataToSend.append("websiteUrl", website || "");
    formDataToSend.append("registrationUrl", registrationUrl);
    formDataToSend.append("price", isPaidEvent ? price.toString() : "0");
    formDataToSend.append("from", fromISO);
    formDataToSend.append("to", toISO);
    formDataToSend.append("paid", isPaidEvent.toString());

    formData.emails.forEach((email) => formDataToSend.append("emails", email));
    formData.guidelines.forEach((g) => formDataToSend.append("guidlines", g));
    formData.contactNumbers.forEach((n) =>
      formDataToSend.append("phoneNumbers", n)
    );

    formDataToSend.append("details", JSON.stringify(formData.details));

    if (formData.selectedFile) {
      formDataToSend.append("images", formData.selectedFile);
    }

    // Show loader toast
    const toastId = toast.loading("Submitting form...");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/events`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("societyToken")}`,
          },
        }
      );

      toast.dismiss(toastId); // Dismiss the loader
      toast.success("Form submitted successfully!");

      console.log("Response:", response.data);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error submitting form. Please try again.");
      console.error("Error:", error);
      throw error;
    }
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

          {/* Emails Section */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm font-bold">
              Emails <span className="text-red-500 ml-1">*</span>
            </label>
            {formData.emails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder={`Email ${index + 1}`}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(index)}
                    className="bg-red-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddEmail}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Add Email
            </button>
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

          {/* Details Section */}
          {formData.details.map((detail, index) => (
            <div key={index} className="flex flex-col gap-4">
              <h4 className="text-gray-700 text-sm font-bold">
                Details (Sub Event {index + 1})
              </h4>
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-bold">Name</label>
                <input
                  type="text"
                  placeholder={`Enter name for Sub Event ${index + 1}`}
                  value={detail.name}
                  onChange={(e) =>
                    handleDetailFieldChange(index, "name", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-bold">About</label>
                <textarea
                  placeholder={`Enter description for Sub Event ${index + 1}`}
                  value={detail.about}
                  onChange={(e) =>
                    handleDetailFieldChange(index, "about", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none resize-none"
                ></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-bold">From</label>
                <input
                  type="datetime-local"
                  value={detail.from}
                  onChange={(e) =>
                    handleDetailFieldChange(index, "from", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-bold">To</label>
                <input
                  type="datetime-local"
                  value={detail.to}
                  onChange={(e) =>
                    handleDetailFieldChange(index, "to", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-bold">Type</label>
                <select
                  value={detail.type}
                  onChange={(e) =>
                    handleDetailFieldChange(index, "type", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="OFFLINE">OFFLINE</option>
                </select>
              </div>
              {detail.type === "OFFLINE" && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-sm font-bold">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter venue name for Sub Event ${
                        index + 1
                      }`}
                      value={detail.venue.name}
                      onChange={(e) =>
                        handleDetailFieldChange(
                          index,
                          "venue",
                          e.target.value,
                          "name"
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-sm font-bold">
                      Venue Map URL
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter venue map URL for Sub Event ${
                        index + 1
                      }`}
                      value={detail.venue.mapUrl}
                      onChange={(e) =>
                        handleDetailFieldChange(
                          index,
                          "venue",
                          e.target.value,
                          "mapUrl"
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                  {detail.venue.mapUrl && (
                    <div className="mt-4">
                      <label className="text-gray-600 text-sm font-semibold">
                        Map Preview:
                      </label>
                      <iframe
                        src={detail.venue.mapUrl}
                        title={`Map Preview for Sub Event ${index + 1}`}
                        className="w-full h-64 border border-gray-300 rounded-lg mt-2"
                        allowFullScreen
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => addSubEvent()}
          >
            Add More Sub-Events
          </button>

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
