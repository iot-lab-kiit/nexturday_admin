import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getParticipants } from "@/api/event";
import LoadingSpinner from "../Global/LoadingSpinner";
import { updateMetadata } from "@/utils/metadata";

interface ParticipantDetail {
  id: string;
  name: string;
  branch: string;
  phoneNumber: string;
  whatsappNumber: string;
  studyYear: number;
}

interface Participant {
  participantId: string;
  participant: {
    id: string;
    rollNo: string;
    email: string;
    detail: ParticipantDetail;
  };
  createdAt: string;
}

interface PaginationData {
  currentPage: number;
  nextPage: number | null;
  totalItems: number;
  totalPages: number;
  data: Participant[];
}

const ParticipantsTable = () => {
  const { id } = useParams();
  const [participants, setParticipants] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Custom function to convert data to CSV
  const convertToCSV = (data: Participant[]) => {
    const headers = [
      "Name",
      "Roll No",
      "Branch",
      "Year",
      "Contact",
      "Registration Date",
      "Registration Time",
    ];
    const rows = data.map((participant) => [
      participant.participant.detail.name,
      participant.participant.rollNo,
      participant.participant.detail.branch,
      participant.participant.detail.studyYear,
      participant.participant.detail.phoneNumber,
      new Date(participant.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    return csvContent;
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
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const response = await getParticipants(id!, currentPage);
        setParticipants(response.data.data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Participants Found</h3>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.data.map((participant) => (
                <tr
                  key={participant.participantId}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {participant.participant.detail.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.participant.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.participant.rollNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.participant.detail.branch.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.participant.detail.studyYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      Phone: {participant.participant.detail.phoneNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      WhatsApp: {participant.participant.detail.whatsappNumber}
                    </div>
                  </td>
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

export default ParticipantsTable;
