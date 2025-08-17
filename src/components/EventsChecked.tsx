import { getApprovedEvents, rejectEvent } from "@/api/event";
import { updateMetadata } from "@/utils/metadata";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./Global/LoadingSpinner";

const EventCard = ({
  event,
  handleReject,
}: {
  event: any;
  handleReject: (
    e: React.MouseEvent<HTMLButtonElement>,
    eventId: string
  ) => void;
}) => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div className="bg-white p-2 rounded-xl border border-gray-400 hover:scale-[1.02] transition-all">
        <div className="rounded-lg relative">
          <div className="rounded-lg relative flex justify-center">
            <img
              src={event.images[0]?.url}
              className="rounded-lg w-full aspect-video object-cover relative z-20"
            />
            <div className="bg-blue-500 w-fit px-5 py-1 rounded-md text-white absolute top-2 left-2 z-30">
              {event.price == 0 ? "Free" : `₹${event.price}`}
            </div>
            <div className="bg-gray-400 w-full aspect-video absolute top-0 left-0 rounded-lg z-10"></div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="m-auto w-fit text-3xl font-bold pt-3 line-clamp-1">{event.name}</h1>
          <div className="text-justify line-clamp-5 text-base leading-tight">
            {event.about}
          </div>
          <div>
            <div className="flex text-base text-gray-800 font-semibold">
              <div className="w-1/2">
                <div>Conducted by :</div>
              </div>
              <div className="w-1/2">
                <div>{event.society.name}</div>
              </div>
            </div>
            <div className="flex text-base text-gray-800 font-semibold">
              <div className="w-1/2">
                <div>Starts from :</div>
              </div>
              <div className="w-1/2">
                <div>
                  {new Date(event.from).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="flex text-base text-gray-800 font-semibold">
              <div className="w-1/2">
                <div>Ends on :</div>
              </div>
              <div className="w-1/2">
                <div>
                  {new Date(event.to).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="flex text-base text-gray-800 font-semibold">
              <div className="w-1/2">
                <div>Registrations :</div>
              </div>
              <div className="w-1/2">
                <div>{event.teamCount}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 pt-2">
            <button
              onClick={() => {
                navigate(`/master-admin/events/${event.id}`);
              }}
              className="py-1 text-lg hover:scale-[1.01] active:scale-95 transition-all bg-blue-200 text-black rounded-lg"
            >
              View Details
            </button>
            <div className="flex gap-1 w-full">
              <div
                className={`py-1 w-full text-lg text-center text-black rounded-lg ${
                  event.isApproved === true ? "bg-green-200" : "bg-red-200"
                }`}
              >
                Status : {event.isApproved == true ? "Approved" : "Denied"}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setClicked(true);
                  handleReject(e, event.id);
                }}
                disabled={clicked}
                className="py-1 w-full flex justify-center items-center text-lg hover:scale-[1.01] active:scale-95 transition-all bg-red-200 text-black rounded-lg"
              >
                {clicked ? (
                  <div>
                    <svg
                      className="animate-spin h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                ) : (
                  "Reject Event"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const EventsChecked = () => {
  const [events, setEvents] = useState([]);
  // const [currentDate, setCurrentDate] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    updateMetadata({
      title: "Checked Events | Super Admin",
      description: "View approved and denied events",
      keywords: "events, admin, approval",
    });

    // const interval = setInterval(() => {
    //   setCurrentDate(Date.now());
    // }, 60000);
    // return () => clearInterval(interval);
  }, []);
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getApprovedEvents(currentPage);
      setEvents(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
      toast.success("Events fetched successfully");
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error fetching events");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleReject = async (e: { preventDefault: () => void; }, eventId: string) => {
    e.preventDefault();
    try {
      await rejectEvent(eventId);
      toast.success("Event rejected successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast.error("Failed to reject event");
    }
  };

  return (
    <div className="p-10 h-fit bg-[#e6f7fc] font-montserrat rounded-xl">
      <h1 className="text-4xl font-bold pb-8">Checked Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {loading ? (
          <div className="text-center text-lg font-medium my-5">
            <LoadingSpinner />
          </div>
        ) : events && events.length > 0 ? (
          events.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              handleReject={handleReject}
            />
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No events found</p>
          </div>
        )}
      </div>
      {events && events.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages} ({totalItems} events)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsChecked;
