import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getParticipants, getEventDetails } from "@/api/event";
import LoadingSpinner from "./Global/LoadingSpinner";
import { updateMetadata } from "@/utils/metadata";

interface ParticipantDetail {
  id: string;
  firstname: string;
  lastname: string;
  branch: string;
  phoneNumber: string;
  whatsappNumber: string;
  studyYear: number;
  personalEmail: string;
  participantId: string;
  createdAt: string;
  updatedAt: string;
}

interface Leader {
  id: string;
  uid: string;
  rollNo: string;
  universityEmail: string;
  isKiitStudent: boolean;
  imageUrl: string;
  fcmToken: string | null;
  detail: ParticipantDetail;
}

interface Participant {
  id: string;
  name: string;
  leaderId: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  payment_status: string;
  paymentId: string | null;
  leader: Leader;
  members: ParticipantDetail[];
}

interface Event {
  id: string;
  price: number;
}

interface PaginationData {
  currentPage: number;
  nextPage: number | null;
  totalItems: number;
  totalPages: number;
  data: Participant[];
}

const MasterAdminParticipantsTable = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [participants, setParticipants] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventDetails, setEventDetails] = useState<Event | null>(null);

  const convertToCSV = (data: Participant[]) => {
    const baseHeaders = [
      "Name",
      "Roll No",
      "Branch",
      "Year",
      "Contact",
      "Email",
      "Registration Date",
    ];

    const headers = eventDetails?.price
      ? [...baseHeaders, "Payment Status"]
      : baseHeaders;

    const rows = data.map((participant) => {
      const baseRow = [
        `${participant.leader.detail.firstname} ${participant.leader.detail.lastname}`,
        participant.leader.rollNo,
        participant.leader.detail.branch,
        participant.leader.detail.studyYear,
        participant.leader.detail.phoneNumber,
        participant.leader.universityEmail,
        new Date(participant.createdAt).toLocaleDateString("en-US"),
      ];

      return eventDetails?.price
        ? [...baseRow, participant.payment_status]
        : baseRow;
    });

    return [headers, ...rows].map((e) => e.join(",")).join("\n");
  };

  const downloadCSV = () => {
    if (!participants) return;
    const csvContent = convertToCSV(participants.data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `participants_page_${currentPage}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [participantsResponse, eventResponse] = await Promise.all([
          getParticipants(id!, currentPage),
          getEventDetails(id!),
        ]);
        setParticipants(participantsResponse.data.data);
        setEventDetails(eventResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage]);

  useEffect(() => {
    updateMetadata({
      title: "Event Participants",
      description: "View and manage event participants",
      keywords: "participants, events, management, nexturday",
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (!participants || participants.data.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Participants Found
          </h3>
          <p className="text-gray-600 mb-4">
            It seems there are no participants registered for this event yet.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => {
            navigate(`/events/${id}`);
          }}
          className="z-10 flex items-center gap-2 hover:text-white pb-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-2xl font-bold mb-6">Participants List</h1>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>*/}
                {eventDetails && eventDetails.price > 0 && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.data.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {`${participant.leader.detail.firstname} ${participant.leader.detail.lastname}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.leader.universityEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.leader.rollNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.leader.detail.branch.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.leader.detail.studyYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      Phone: {participant.leader.detail.phoneNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      WhatsApp: {participant.leader.detail.whatsappNumber}
                    </div>
                  </td>
                  {(eventDetails?.price ?? 0) > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          participant.payment_status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {participant.payment_status}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(participant.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {participants.currentPage} of {participants.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!participants.nextPage}
              className={`px-4 py-2 text-sm rounded-md ${
                !participants.nextPage
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border`}
            >
              Next
            </button>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterAdminParticipantsTable;
