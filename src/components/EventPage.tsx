import { useState, useEffect } from "react";
import EventsTable from "./EventsTable";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";


axios.defaults.baseURL = "https://nexterday.iotkiit.in/";
// const token = import.meta.env.VITE_SOCIETY_TOKEN;
const token = sessionStorage.getItem("societyToken");

axios.defaults.headers.common = { Authorization: `Bearer ${token}` };



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

interface DeleteConfirmationProps {
  isOpen: boolean;
  eventName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation = ({ isOpen, eventName, onConfirm, onCancel }: DeleteConfirmationProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Event</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete "{eventName}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const EventPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showTable, setShowTable] = useState(false);
  // const [participantsData, setParticipantsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [deleteEventName, setDeleteEventName] = useState<string>("");

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          "https://nexterday.iotkiit.in/api/participants"
        );
        console.log(response.data.data);
        // setParticipantsData(response.data.data.data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/events?page=1&field=createdAt&direction=desc`
        );
        console.log(response.data.data.data);
        setEvents(response.data.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/events/${eventId}`);
      // Remove the event from the local state
      setEvents(events.filter(event => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setDeleteEventId(null);
      setDeleteEventName("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold m-auto">EVENTS</h1>
        {/* Search and menu icons can be added here */}
      </div>

      {loading ? (
        <p className="text-center text-lg font-medium my-5">
          Loading events...
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {events.map((event, index) => (
            <div
              key={index}
              className="relative h-[200px] md:h-[300px] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              {/* Background Image */}
              <img
                src={event.images[0]?.url}
                alt={event.name}
                className="absolute w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="text-white/80 text-sm md:text-base mb-2">
                  {event.society.name}
                </div>
                
                <h2 className="text-white text-2xl md:text-3xl font-bold">
                  {event.name.toUpperCase()}
                </h2>
                
                {/* Management Icons */}
                <div className="absolute top-4 right-4 flex gap-3">
                  <button 
                    className="p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event.id}/edit`);
                    }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteEventId(event.id);
                      setDeleteEventName(event.name);
                    }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* {selectedEvent && (
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
            onClick={() => setShowTable(true)}
            className="mt-5 mx-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            View Participants
          </button>
        </div>
      )} */}

      {loading ? (
        <p className="text-center text-lg font-medium my-5">
          Loading participants data...
        </p>
      ) : (
        showTable && <EventsTable/>
      )}

      <DeleteConfirmation
        isOpen={!!deleteEventId}
        eventName={deleteEventName}
        onConfirm={() => deleteEventId && handleDeleteEvent(deleteEventId)}
        onCancel={() => {
          setDeleteEventId(null);
          setDeleteEventName("");
        }}
      />
    </div>
  );
};

export default EventPage;
