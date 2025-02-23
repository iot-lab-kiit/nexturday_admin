import { getPendingEvents, approveEvent, rejectEvent } from "@/api/event";
import { updateMetadata } from "@/utils/metadata";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./Global/LoadingSpinner";

// const OpenModal = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   return <div className="bg-black opacity-30"></div>;
// };

interface EventCardProps {
  event: any;
  handleApprove: (e: React.MouseEvent<HTMLButtonElement>, eventId: string) => void;
  handleReject: (e: React.MouseEvent<HTMLButtonElement>, eventId: string) => void;
}

const EventCard = ({ event, handleApprove, handleReject }: EventCardProps) => {
  const navigate = useNavigate();

  const [isApprovedClicked, setIsApprovedClicked] = useState(false);
  const [isRejectClicked, setIsRejectClicked] = useState(false);

  return (
    <>
      {/* <div className="absolute w-screen h-full bg-black opacity-30 top-0 left-0 overflow-hidden">

      </div> */}
      {/* <div
        key={event.id}
        className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden cursor-pointer duration-300 hover:scale-[1.02] transition-transform"
        onClick={() => navigate(`${event.id}`)}
      >
        <img
          src={event.images[0]?.url}
          alt={event.name}
          className={`absolute w-full h-full object-cover ${
            currentDate > new Date(event.from).getTime() ? "grayscale" : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span
              className={` text-white text-xl px-3 py-1 rounded-full backdrop-blur-sm ${
                currentDate > new Date(event.from).getTime()
                  ? "bg-gray-500"
                  : "bg-blue-500/80"
              }`}
            >
              {event.paid ? `₹${event.price}` : "Free"}
            </span>
            <div className="flex gap-2">
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="text-white/80 text-lg">{event.society.name}</div>
              <h2 className="text-white text-3xl font-bold">
                {event.name.toUpperCase()}
              </h2>
            </div>

            <div className="">
              <div className="flex items-center gap-2 text-white/90 text-lg">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {new Date(event.from).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-white/90 text-lg">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{event.participationCount} Participants</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="bg-white p-2 rounded-xl border border-gray-400 hover:scale-[1.02] transition-all">
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
        <div className="flex flex-col gap-3">
          <h1 className="m-auto w-fit text-3xl font-bold pt-3">{event.name}</h1>
          <div className="text-center text-base leading-tight">
            {event.about}
          </div>
          <div>
            <div className="flex text-base font-semibold">
              <div className="w-1/2">
                <div>Conducted by :</div>
              </div>
              <div className="w-1/2">
                <div>{event.society.name}</div>
              </div>
            </div>
            <div className="flex text-base font-semibold">
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
            <div className="flex text-base font-semibold">
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
            {/* <div className="flex text-base font-semibold">
              <p className="w-1/2">
                <div>Price :</div>
              </p>
              <p className="w-1/2">
                <div>{event.price}</div>
              </p>
            </div> */}
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
            {/* <button onClick={} className="py-1 text-lg hover:scale-[1.01] active:scale-95 transition-all bg-blue-200 text-black rounded-lg">
              View Participants
            </button> */}
            <div className="flex gap-1 w-full">
              <button
                onClick={(e) => {
                  setIsApprovedClicked(true);
                  handleApprove(e, event.id);
                }}
                disabled={isApprovedClicked || isRejectClicked}
                className="py-1 flex justify-center items-center w-full text-lg hover:scale-[1.01] active:scale-95 transition-all bg-green-200 text-black rounded-lg"
              >
                {isApprovedClicked ? (
                  <div className="w-fit m-auto">
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
                  "Approve Event"
                )}
              </button>
              <button
                onClick={(e) => {
                  setIsRejectClicked(true);
                  handleReject(e, event.id);
                }}
                disabled={isRejectClicked || isApprovedClicked}
                className="py-1 flex justify-center items-center w-full text-lg hover:scale-[1.01] active:scale-95 transition-all bg-red-200 text-black rounded-lg"
              >
                {isRejectClicked ? (
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

const EventsPending = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    updateMetadata({
      title: "Pending Events | Super Admin",
      description: "Review and approve pending events",
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
      const res = await getPendingEvents(currentPage);
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

  const handleApprove = async (e: React.MouseEvent<HTMLButtonElement>, eventId: string) => {
    e.stopPropagation();
    try {
      await approveEvent(eventId);
      toast.success("Event approved successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("Failed to approve event");
    }
  };

  const handleReject = async (e: React.MouseEvent<HTMLButtonElement>, eventId: string) => {
    e.stopPropagation();
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
    <div className="p-10 w-full h-fit bg-[#e6f7fc] font-montserrat rounded-xl">
      <h1 className="text-4xl font-bold pb-8">Pending Events</h1>
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
              // currentDate={currentDate}
              handleApprove={handleApprove}
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

export default EventsPending;
