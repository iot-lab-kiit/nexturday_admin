import React, { useState } from "react";

const AddEvent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [isPaidEvent, setIsPaidEvent] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Event</h1>
        <form className="flex flex-col gap-6">
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
              {selectedFile && (
                <span className="text-gray-600 text-sm">
                  {selectedFile.name}
                </span>
              )}
            </div>
            <input
              type="file"
              id="eventImage"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Display Image Preview */}
          {selectedFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">Selected Image:</p>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(selectedFile)}
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none resize-none"
            ></textarea>
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
              onChange={(e) => setMapUrl(e.target.value)}
            />

            {mapUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">Map Preview:</p>
                <iframe
                  src={mapUrl}
                  className="w-full h-64 border rounded-lg"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-700 text-sm font-bold"
              htmlFor="details"
            >
              Details <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="details"
              rows={4}
              placeholder="Enter event details"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none resize-none"
            ></textarea>
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Guidelines */}
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-700 text-sm font-bold"
              htmlFor="guidelines"
            >
              Guidelines <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="guidelines"
              rows={3}
              placeholder="Enter event guidelines"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* Contact Numbers */}
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-700 text-sm font-bold"
              htmlFor="contactNumbers"
            >
              Contact Numbers <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="contactNumbers"
              placeholder="Enter contact numbers separated by commas"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            />
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Paid Event Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPaidEvent"
              checked={isPaidEvent}
              onChange={(e) => setIsPaidEvent(e.target.checked)}
              className="w-5 h-5 text-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
            />
            <label htmlFor="isPaidEvent" className="text-gray-700 font-bold">
              Is this a paid event?
            </label>
          </div>

          {/* Price and Participant Count */}
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            {/* Conditional Price Input */}
            {isPaidEvent && (
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
