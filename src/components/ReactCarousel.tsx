import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import EventsTable from "./EventsTable";
import axios from "axios";


axios.defaults.baseURL = "https://nexterday.iotkiit.in/";
const token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwZDg4ZGQ1NWQxYjAwZDg0ZWU4MWQwYjk2M2RlNGNkOGM0ZmFjM2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbmV4dGVyZGF5ZXZlbnRzLTJkOTllIiwiYXVkIjoibmV4dGVyZGF5ZXZlbnRzLTJkOTllIiwiYXV0aF90aW1lIjoxNzM2NzY2ODM1LCJ1c2VyX2lkIjoiY1hXdmtqQXpoZVI3MDJsbzI5UW1sczc5QW90MiIsInN1YiI6ImNYV3ZrakF6aGVSNzAybG8yOVFtbHM3OUFvdDIiLCJpYXQiOjE3MzY3NjY4MzUsImV4cCI6MTczNjc3MDQzNSwiZW1haWwiOiIyMzA1NDU4QGtpaXQuYWMuaW4iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiMjMwNTQ1OEBraWl0LmFjLmluIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.kMC8VYTooUyFoyDNm17Vxo79yOroJ7L2rEgj32jtRdhtG0t5llQl_tqhMJL39G9T-t10bffcoCaNkNnlTcqEQJDNl4g2-a5Zrs4x8ky7GSa0vIuR59WxHcnTRZp4Wqv_rE2vU4MvXypJ8ok0FTaCgeYSHXBeWNDPE6LIiSzdVKe2RVH-GEaqtAzpHgU8yYwUCZZ2UKqcSghGP_Xepcngnk9V8cnbffEELNmRyMjbwLW4na1cpYFZay-wHWCptjYqitTsqiz3Sk2HlDvR17tEIRF46gcD60y-WXGLiJYQagjsVSVzlR2JEjDuD1ZlGnpOmuuX6WYKBuglYLlCRQ4kVA";
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3,
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1,
  },
};

interface Event {
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

const ReactCarousel = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showTable, setShowTable] = useState(false);
  // const [participantsData, setParticipantsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          "https://nexterday.iotkiit.in/api/events?page=1&field=createdAt&direction=desc"
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

  return (
    <div className="z-10">
      <div>
        <div className="text-2xl font-bold text-center my-5">
          Upcoming Events
        </div>

        {loading ? (
          <p className="text-center text-lg font-medium my-5">
            Loading events...
          </p>
        ) : (
          <Carousel
            responsive={responsive}
            autoPlay={true}
            swipeable={true}
            draggable={true}
            showDots={true}
            infinite={true}
            partialVisible={false}
            keyBoardControl={true}
            containerClass="z-10"
          >
            {events.map((event: Event, index: number) => (
              <div className="cursor-pointer mx-2 my-5 px-8" key={index}>
                <img
                  src={event.images?.[0]?.url || ""}
                  alt={event.name || "event"}
                  className="w-full border rounded-md"
                  onClick={() => setSelectedEvent(event)}
                />
              </div>
            ))}
          </Carousel>
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
            onClick={() => setShowTable(true)}
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
        showTable && <EventsTable/>
      )}
    </div>
  );
};

export default ReactCarousel;
