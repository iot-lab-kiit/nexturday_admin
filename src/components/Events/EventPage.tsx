"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../Global/LoadingSpinner";
import { getEvents, getParticipants } from "@/api/event";
import EventsTable from "./EventsTable";
import toast from "react-hot-toast";


// axios.defaults.baseURL = "https://nexterday.iotkiit.in/";
// const token = sessionStorage.getItem("societyToken");
// axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

interface Event {
  id: string;
  about: string;
  createdAt: string;
  emails: string[];
  guidlines: string[];
  images: { url: string }[]; // Adjust this based on the actual image object structure
  name: string;
  paid: boolean;
  participationCount: number;
  phoneNumbers: string[];
  price: number;
  registrationUrl: string;
  society: {
    name: string;
  };
}

const EventPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  // const [participantsData, setParticipantsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        if (!selectedEvent) return;
        setLoading(true);
        const res = await getParticipants(selectedEvent?.id);
        console.log(res);
        toast.success("Participants fetched successfully");
        // setParticipantsData(res);
      } catch (error) {
        console.error("Error fetching participants:", error);
        toast.error("Error fetching participants");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [selectedEvent]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await getEvents();
        console.log(res);
        toast.success("Events fetched successfully");
        setEvents(res);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Error fetching events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  console.log(selectedEvent?.id);

  return (
    <div className="z-10">
      <div>
        <div className="text-2xl font-bold text-center my-5">My Events</div>

        {loading ? (
          <p className="text-center text-lg font-medium my-5">
            <LoadingSpinner />
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* //show all the events with image and about */}
            {events.map((event, index) => (
              <div
                key={index}
                className="border rounded-md p-4 cursor-pointer hover:shadow-lg"
                onClick={() => setSelectedEvent(event)}
              >
                <img
                  src={event.images[0].url}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <div className="p-2">
                  <h2 className="text-lg font-semibold">{event.name}</h2>
                  <p className="text-sm">{event.about}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      

      {selectedEvent && (
        <div className="mt-10 p-5 border rounded-md bg-gray-100">
          <h2 className="text-2xl font-bold">{selectedEvent.name}</h2>
          <p className="mt-2 text-lg">{selectedEvent?.about}</p>
          <p className="mt-1">Organizer: {selectedEvent.society.name}</p>
          <p className="mt-1">
            Phone: {selectedEvent.phoneNumbers?.join(", ")}
          </p>
          <p className="mt-1">Email: {selectedEvent.emails?.join(", ")}</p>
          {selectedEvent.paid ? (
            <p className="mt-1">Entry Fees: {selectedEvent.price}</p>
          ) : (
            <p className="mt-1">Entry Fees: Free</p>
          )}
          <p className="mt-1">
            Date:{" "}
            {new Date(selectedEvent.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-1">
            Registration URL:{" "}
            <a
              href={selectedEvent.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {selectedEvent.registrationUrl}
            </a>
          </p>

          <div className="mt-2">
            <h3 className="text-lg font-semibold">Guidelines:</h3>
            <ul className="list-decimal pl-5">
              {selectedEvent.guidlines?.map(
                (guideline: string, index: number) => (
                  <li key={index} className="mt-1">
                    {guideline}
                  </li>
                )
              )}
            </ul>
          </div>
          <button
            onClick={() => getParticipants(selectedEvent.id)}
            className="mt-5 mx-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            View Participants
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-lg font-medium my-5">
          Loading participants data...
        </p>
      ) : (
        showTable && <EventsTable />
      )}
    </div>
  );
};

export default EventPage;
