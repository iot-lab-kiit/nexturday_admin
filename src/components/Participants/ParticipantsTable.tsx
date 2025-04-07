import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getParticipants,
  getEventDetails,
  updatePaymentStatus,
} from "@/api/event";
import LoadingSpinner from "../Global/LoadingSpinner";
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

interface PaginationData {
  currentPage: number;
  nextPage: number | null;
  totalItems: number;
  totalPages: number;
  data: Participant[];
}

interface Event {
  id: string;
  price: number;
}

const ParticipantsTable = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [participants, setParticipants] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventDetails, setEventDetails] = useState<Event | null>(null);

  const convertToCSV = (data: Participant[]) => {
    const participantsToInclude =
      (eventDetails?.price ?? 0) > 0
        ? data.filter(
            (participant) => participant.payment_status === "VERIFIED"
          )
        : data;

    if (participantsToInclude.length === 0) {
      return "";
    }

    const headers = ["Name", "Roll No", "Year", "Registration Date"];

    const rows = participantsToInclude.map((participant) => [
      `${participant.leader.detail.firstname} ${participant.leader.detail.lastname}`,
      participant.leader.rollNo,
      participant.leader.detail.studyYear,
      new Date(participant.createdAt).toLocaleDateString("en-US"),
    ]);

    return [headers, ...rows].map((e) => e.join(",")).join("\n");
  };

  const downloadCSV = () => {
    if (!participants) return;
    const csvContent = convertToCSV(participants.data);
    if (!csvContent) {
      const message =
        (eventDetails?.price ?? 0) > 0
          ? "No verified participants to download!"
          : "No participants to download!";
      alert(message);
      return;
    }
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const filename =
      (eventDetails?.price ?? 0) > 0
        ? `verified_participants_page_${currentPage}.csv`
        : `all_participants_page_${currentPage}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePaymentStatusUpdate = async (
    teamId: string,
    currentStatus: string
  ) => {
    const newStatus =
      currentStatus === "VERIFIED" ? "UNDER_VERIFICATION" : "VERIFIED";
    try {
      await updatePaymentStatus(teamId, newStatus);
      const participantsResponse = await getParticipants(id!, currentPage);
      setParticipants(participantsResponse.data.data);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
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
        console.log(participantsResponse);
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                {(eventDetails?.price ?? 0) > 0 && (
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                )}
                {(eventDetails?.price ?? 0) > 0 && (
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    
                  </th>
                )}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                {(eventDetails?.price ?? 0) > 0 && (
                  <th className="px-6 py-3"></th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.data.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {`${participant.leader.detail.firstname} ${participant.leader.detail.lastname}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {participant.leader.rollNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {participant.leader.detail.studyYear}
                  </td>
                  {(eventDetails?.price ?? 0) > 0 && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            participant.payment_status === "VERIFIED"
                              ? "bg-green-100 text-green-800"
                              : participant.payment_status ===
                                "UNDER_VERIFICATION"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {participant.payment_status === "VERIFIED"
                            ? "Verified"
                            : participant.payment_status ===
                              "UNDER_VERIFICATION"
                            ? "Under Verification"
                            : "Unpaid"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            handlePaymentStatusUpdate(
                              participant.id,
                              participant.payment_status
                            )
                          }
                          className={`px-2 py-1 rounded-full text-sm font-medium ${
                            participant.payment_status === "VERIFIED"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          {participant.payment_status === "VERIFIED"
                            ? "Mark Under Verification"
                            : "Mark Verified"}
                        </button>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
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

export default ParticipantsTable;
