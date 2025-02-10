import { updateMetadata } from "@/utils/metadata";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// const OpenModal = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   return <div className="bg-black opacity-30"></div>;
// };

const EventCard = ({ event, currentDate }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
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
      <div
        onClick={() => {
          navigate(`/master-admin/events/${event.id}`);
        }}
        className="bg-white p-2 rounded-xl border border-gray-400 hover:scale-[1.02] transition-all"
      >
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
          <h1 className="m-auto w-fit text-3xl font-bold pt-3">{event.name}</h1>
          <div className="text-center text-base leading-tight">
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
            {/* <div className="flex text-base text-gray-800 font-semibold">
              <p className="w-1/2">
                <div>Price :</div>
              </p>
              <p className="w-1/2">
                <div>{event.price}</div>
              </p>
            </div> */}
            <div className="flex text-base text-gray-800 font-semibold">
              <div className="w-1/2">
                <div>Registrations :</div>
              </div>
              <div className="w-1/2">
                <div>{event.participationCount}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 pt-2">
            <button className="py-1 text-lg hover:scale-[1.01] active:scale-95 transition-all bg-blue-200 text-black rounded-lg">
              View Details
            </button>
            {/* <button className="py-1 text-lg hover:scale-[1.01] active:scale-95 transition-all bg-blue-200 text-black rounded-lg">
              View Participants
            </button> */}
            <div className="flex gap-1 w-full">
              <div
                className={`py-1 w-full text-lg text-center text-black rounded-lg ${
                  event.status === "approved" ? "bg-green-200" : "bg-red-200"
                }`}
              >
                Status : {event.status === "approved" ? "Approved" : "Denied"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const EventsChecked = () => {
  // const navigate=useNavigate();
  const response = {
    success: true,
    message: "events fetched successfully",
    data: {
      currentPage: 1,
      nextPage: null,
      totalItems: 6,
      totalPages: 1,
      data: [
        {
          id: "22d1b3fa-036e-4117-ac0e-2a5968310256",
          paid: false,
          name: "Event name",
          societyId: "8eada7d0-7157-4231-8a31-569e80ddf439",
          about:
            "A conference bringing together tech enthusiasts to discuss the latest trends in technology.",
          websiteUrl: "https://www.techconference2024.com",
          emails: [
            "contact@techconference2024.com",
            "info@techconference2024.com",
          ],
          guidlines: ["Please arrive on time.", "Bring your ID card."],
          phoneNumbers: ["+1234567890", "+0987654321"],
          registrationUrl: "https://www.techconference2024.com/register",
          price: 0,
          from: "2024-05-15T09:00:00.000Z",
          to: "2024-05-15T18:00:00.000Z",
          participationCount: 1,
          createdAt: "2025-01-12T18:28:52.854Z",
          updatedAt: "2025-01-12T20:40:58.502Z",
          society: {
            name: "society name",
          },
          images: [
            {
              key: "435d48b8427aa84305dacb3fb930f9af3b0d43f02306c1bb9050f2a7f37748f0",
              url: "https://nexturday.s3.amazonaws.com/435d48b8427aa84305dacb3fb930f9af3b0d43f02306c1bb9050f2a7f37748f0",
            },
          ],
          status: "approved",
        },
        {
          id: "c5133d34-3188-44ab-ba35-07d2815ef02e",
          paid: false,
          name: "test",
          societyId: "8eada7d0-7157-4231-8a31-569e80ddf439",
          about:
            "A conference bringing together tech enthusiasts to discuss the latest trends in technology.",
          websiteUrl: "https://www.techconference2024.com",
          emails: [
            "contact@techconference2024.com",
            "info@techconference2024.com",
          ],
          guidlines: ["Please arrive on time.", "Bring your ID card."],
          phoneNumbers: ["+1234567890", "+0987654321"],
          registrationUrl: "https://www.techconference2024.com/register",
          price: 50,
          from: "2024-05-15T09:00:00.000Z",
          to: "2024-05-15T18:00:00.000Z",
          participationCount: 0,
          createdAt: "2025-01-12T18:23:01.926Z",
          updatedAt: "2025-01-12T20:40:22.559Z",
          society: {
            name: "test",
          },
          images: [
            {
              key: "7c363f46bf214911cfee1110ee28a0c7ee6ca21403d73937d8eeded8e5ac6831",
              url: "https://nexturday.s3.amazonaws.com/7c363f46bf214911cfee1110ee28a0c7ee6ca21403d73937d8eeded8e5ac6831",
            },
          ],
        },
        {
          id: "3ebc5236-8f43-422e-81bf-472d47440857",
          paid: false,
          name: "test",
          societyId: "8eada7d0-7157-4231-8a31-569e80ddf439",
          about:
            "A conference bringing together tech enthusiasts to discuss the latest trends in technology.",
          websiteUrl: "https://www.techconference2024.com",
          emails: [
            "contact@techconference2024.com",
            "info@techconference2024.com",
          ],
          guidlines: ["Please arrive on time.", "Bring your ID card."],
          phoneNumbers: ["+1234567890", "+0987654321"],
          registrationUrl: "https://www.techconference2024.com/register",
          price: 50,
          from: "2024-05-15T09:00:00.000Z",
          to: "2024-05-15T18:00:00.000Z",
          participationCount: 0,
          createdAt: "2025-01-12T18:21:09.822Z",
          updatedAt: "2025-01-12T20:39:50.664Z",
          society: {
            name: "test",
          },
          images: [
            {
              key: "a2e164e68d54ad5c62ede2b3f18a22b344ec5f0ad3027014037e4d1aaa932361",
              url: "https://nexturday.s3.amazonaws.com/a2e164e68d54ad5c62ede2b3f18a22b344ec5f0ad3027014037e4d1aaa932361",
            },
          ],
        },
        {
          id: "bd1fe58d-9f7b-4b78-90e6-20608dda6e1f",
          paid: false,
          name: "test",
          societyId: "8eada7d0-7157-4231-8a31-569e80ddf439",
          about:
            "A conference bringing together tech enthusiasts to discuss the latest trends in technology.",
          websiteUrl: "https://www.techconference2024.com",
          emails: [
            "contact@techconference2024.com",
            "info@techconference2024.com",
          ],
          guidlines: ["Please arrive on time.", "Bring your ID card."],
          phoneNumbers: ["+1234567890", "+0987654321"],
          registrationUrl: "https://www.techconference2024.com/register",
          price: 50,
          from: "2024-05-15T09:00:00.000Z",
          to: "2024-05-15T18:00:00.000Z",
          participationCount: 0,
          createdAt: "2025-01-12T18:18:09.458Z",
          updatedAt: "2025-01-12T20:39:10.254Z",
          society: {
            name: "test",
          },
          images: [
            {
              key: "248975797542a8ede6261d37adf449480bdea2a4ea02b674448256cf93a09c9d",
              url: "https://nexturday.s3.amazonaws.com/248975797542a8ede6261d37adf449480bdea2a4ea02b674448256cf93a09c9d",
            },
          ],
        },
        {
          id: "65853ff2-a988-4558-aea4-fc2d160c58f1",
          paid: false,
          name: "test",
          societyId: "8eada7d0-7157-4231-8a31-569e80ddf439",
          about:
            "A conference bringing together tech enthusiasts to discuss the latest trends in technology.",
          websiteUrl: "https://www.techconference2024.com",
          emails: [
            "contact@techconference2024.com",
            "info@techconference2024.com",
          ],
          guidlines: ["Please arrive on time.", "Bring your ID card."],
          phoneNumbers: ["+1234567890", "+0987654321"],
          registrationUrl: "https://www.techconference2024.com/register",
          price: 50,
          from: "2024-05-15T09:00:00.000Z",
          to: "2024-05-15T18:00:00.000Z",
          participationCount: 0,
          createdAt: "2025-01-12T18:15:42.535Z",
          updatedAt: "2025-01-12T20:38:34.833Z",
          society: {
            name: "test",
          },
          images: [
            {
              key: "de43ce1a4a40c7f118fddd16e6e8ee86d464a0ffab9460310de4c33afb2f7734",
              url: "https://nexturday.s3.amazonaws.com/de43ce1a4a40c7f118fddd16e6e8ee86d464a0ffab9460310de4c33afb2f7734",
            },
          ],
        },
        {
          id: "c28f0b6a-42fa-4416-9348-3a641c7ead14",
          paid: false,
          name: "test",
          societyId: "8eada7d0-7157-4231-8a31-569e80ddf439",
          about:
            "A conference bringing together tech enthusiasts to discuss the latest trends in technology.",
          websiteUrl: "https://www.techconference2024.com",
          emails: [
            "contact@techconference2024.com",
            "info@techconference2024.com",
          ],
          guidlines: ["Please arrive on time.", "Bring your ID card."],
          phoneNumbers: ["+1234567890", "+0987654321"],
          registrationUrl: "https://www.techconference2024.com/register",
          price: 50,
          from: "2024-05-15T09:00:00.000Z",
          to: "2024-05-15T18:00:00.000Z",
          participationCount: 0,
          createdAt: "2025-01-12T18:06:09.929Z",
          updatedAt: "2025-01-12T20:37:24.080Z",
          society: {
            name: "test",
          },
          images: [
            {
              key: "74bcc133a1583c2470e5c3aa8c3c9bfe0aede7a933c1abdfac8a1a9a67c6c100",
              url: "https://nexturday.s3.amazonaws.com/74bcc133a1583c2470e5c3aa8c3c9bfe0aede7a933c1abdfac8a1a9a67c6c100",
            },
          ],
        },
        {
          id: "c28f0b6a-42fa-4416-9348-3a641c7ead14",
          paid: false,
          name: "test",
          societyId: "8eada7d0-7157-4231-8a31-569e80ddf439",
          about:
            "A conference bringing together tech enthusiasts to discuss the latest trends in technology.",
          websiteUrl: "https://www.techconference2024.com",
          emails: [
            "contact@techconference2024.com",
            "info@techconference2024.com",
          ],
          guidlines: ["Please arrive on time.", "Bring your ID card."],
          phoneNumbers: ["+1234567890", "+0987654321"],
          registrationUrl: "https://www.techconference2024.com/register",
          price: 50,
          from: "2025-05-15T09:00:00.000Z",
          to: "2025-05-15T18:00:00.000Z",
          participationCount: 0,
          createdAt: "2025-01-12T18:06:09.929Z",
          updatedAt: "2025-01-12T20:37:24.080Z",
          society: {
            name: "test",
          },
          images: [
            {
              key: "74bcc133a1583c2470e5c3aa8c3c9bfe0aede7a933c1abdfac8a1a9a67c6c100",
              url: "https://nexturday.s3.amazonaws.com/74bcc133a1583c2470e5c3aa8c3c9bfe0aede7a933c1abdfac8a1a9a67c6c100",
            },
          ],
        },
      ],
    },
  };
  const [events, setEvents] = useState(response.data.data);
  const [currentDate, setCurrentDate] = useState(Date.now());
  useEffect(() => {
    updateMetadata({
      title: "Pending Events | Super Admin",
      description: "Review and approve pending events",
      keywords: "events, admin, approval",
    });

    const interval = setInterval(() => {
      setCurrentDate(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 h-fit bg-[#e6f7fc] font-montserrat rounded-xl">
      <h1 className="text-4xl font-bold pb-8">Checked Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {events &&
          events.map((event, index) => (
            <EventCard key={index} event={event} currentDate={currentDate} />
          ))}
      </div>
    </div>
  );
};

export default EventsChecked;
