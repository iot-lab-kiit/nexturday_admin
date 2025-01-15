import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { getEvents, deleteEvent } from '../api/eventsApi';

interface Event {
  id: string;
  about: string;
  createdAt: string;
  emails: string[];
  guidlines: string[];
  images: { url: string }[];
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
  const [loading, setLoading] = useState(true);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [deleteEventName, setDeleteEventName] = useState<string>("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
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
      </div>

      {loading ? (
        <p className="text-center text-lg font-medium my-5">
          Loading events...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="relative h-[300px] sm:h-[350px] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <img
                src={event.images[0]?.url}
                alt={event.name}
                className="absolute w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {event.paid ? `₹${event.price}` : 'Free'}
                  </span>
                  
                  <div className="flex gap-2">
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

                <div className="space-y-4">
                  <div>
                    <div className="text-white/80 text-sm">
                      {event.society.name}
                    </div>
                    <h2 className="text-white text-xl font-bold">
                      {event.name.toUpperCase()}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {new Date(event.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>KiiT University</span>
                    </div>

                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{event.participationCount} Participants</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
