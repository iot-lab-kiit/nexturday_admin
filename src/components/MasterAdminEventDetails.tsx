"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingSpinner from "./Global/LoadingSpinner";
import { approveEvent, getEventDetails, rejectEvent } from "@/api/event";
import { Icon } from "@iconify/react/dist/iconify.js";
import { updateMetadata } from "@/utils/metadata";
import { toast } from "react-hot-toast";

interface Event {
  id: string;
  paid: boolean;
  name: string;
  societyId: string;
  about: string;
  websiteUrl: string;
  emails: string[];
  guidlines: string[];
  phoneNumbers: string[];
  registrationUrl: string | null;
  price: number;
  from: string;
  to: string;
  deadline: string;
  maxTeamSize: number;
  isOutsideParticipantAllowed: boolean;
  tags: string[];
  teamCount: number;
  transcript: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  society: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    websiteUrl: string;
    createdAt: string;
    updatedAt: string;
    role: string;
  };
  details: {
    id: string;
    name: string;
    from: string;
    to: string;
    type: string;
    venueId: string | null;
    eventId: string;
    about: string;
    createdAt: string;
    updatedAt: string;
    venue: {
      mapUrl: string;
      name: string;
    } | null;
  }[];
  images: {
    url: string;
    key: string;
  }[];
}

const MasterAdminEventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchEventDetails = async () => {
    try {
      const response = await getEventDetails(id!);
      setEvent(response.data.data);

      updateMetadata({
        title: response.data.data.name,
        description: response.data.data.about,
        keywords: `event, ${response.data.data.name}, ${response.data.data.society.name}, nexturday`,
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return <div className="text-center py-10">Event not found</div>;
  }

  const handleApprove = async () => {
  // e.stopPropagation();
       try {
         await rejectEvent(eventId);
         toast.success("Event rejected successfully");
        // fetchEvent();
       } catch (error) {
         console.error("Error rejecting event:", error);
         toast.error("Failed to reject event");
       }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto min-h-screen lg:my-8 bg-white lg:rounded-xl overflow-hidden relative">
        <div className="h-[300px] md:h-[400px] relative">
          <img
            src={event.images[0]?.url}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="text-white/80 text-xl mb-2">
              {event.society.name}
            </div>
            <h1 className="text-4xl font-bold">{event.name.toUpperCase()}</h1>
          </div>
        </div>

        <div className="p-6 space-y-6 text-gray-800">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {new Date(event.from).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {event.tags.map((tag, index) => (
                <div key={index} className="bg-gray-100 px-2 py-1 rounded-lg">
                  {tag.replace(/["[\]]/g, "")}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-700">{event.about}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {event.emails.join(", ")}
              </p>
              <p className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {event.phoneNumbers.join(", ")}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">Guidelines</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {event.guidlines.map((guideline, index) => (
                <li key={index}>{guideline}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">Registration Details</h2>
            <div className="space-y-2">
              <p>Entry Fee: {event.paid ? `₹${event.price}` : "Free"}</p>
              <p>Participants: {event.teamCount}</p>
              <p>
                {event.maxTeamSize == 1
                  ? "Solo event"
                  : `Team event (group of max. ${event.maxTeamSize})`}
              </p>
              <p>
                Outside Participants:{" "}
                {event.isOutsideParticipantAllowed ? "Allowed" : "Not Allowed"}
              </p>
              {event.registrationUrl && (
                <p>
                  Registration URL:{" "}
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {event.registrationUrl}
                  </a>
                </p>
              )}
            </div>
          </div>

          {event.transcript && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3">Transcript</h2>
              <div className="space-y-2">
                <p>
                  Transcript URL:{" "}
                  <a
                    href={event.transcript}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {event.transcript}
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Sub Event Details Section */}
          {event.details && event.details.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3">Sub Event Details</h2>
              {event.details.map((subEvent, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-bold">{subEvent.name}</h3>
                  <p>{subEvent.about}</p>
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(subEvent.from).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(subEvent.to).toLocaleString()}
                  </p>
                  <p>
                    <strong>Type:</strong> {subEvent.type}
                  </p>
                  <p>
                    <strong>Venue:</strong>{" "}
                    {subEvent.type === "ONLINE"
                      ? "ONLINE"
                      : subEvent.venue && (
                          <a
                            href={subEvent.venue.mapUrl}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {subEvent.venue.name}
                          </a>
                        )}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex sm:flex-row justify-evenly pt-4 pb-8 flex-col gap-4 w-fit m-auto">
            <button
              onClick={() =>
                navigate(`/master-admin/events/${event.id}/participants`)
              }
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              View Participants
            </button>
            <button
              onClick={() => handleApprove()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Icon
                icon="typcn:tick-outline"
                width="24"
                height="24"
                style={{ color: "#fff" }}
              />
              Approve Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterAdminEventDetails;
