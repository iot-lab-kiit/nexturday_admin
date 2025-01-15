import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchParticipants } from '../api/participantsApi';


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

  useEffect(() => {
    const loadParticipants = async () => {
      setLoading(true);
      try {
        const data = await fetchParticipants(id!, currentPage);
        setParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, [id, currentPage]);

  if (loading) {
    return <div className="text-center py-10">Loading participants...</div>;
  }

  if (!participants || participants.data.length === 0) {
    return <div className="text-center py-10">No participants found</div>;
  }

  // Custom function to convert data to CSV
  const convertToCSV = (data: Participant[]) => {
    const headers = ['Name', 'Roll No', 'Branch', 'Year', 'Contact', 'Registration Date'];
    const rows = data.map(participant => [
      participant.participant.detail.name,
      participant.participant.rollNo,
      participant.participant.detail.branch,
      participant.participant.detail.studyYear,
      participant.participant.detail.phoneNumber,
      new Date(participant.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    return csvContent;
  };

  const downloadCSV = () => {
    if (!participants) return;
    const csvContent = convertToCSV(participants.data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `participants_page_${currentPage}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                <tr key={participant.participantId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {participant.participant.detail.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.participant.rollNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.participant.detail.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.participant.detail.studyYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.participant.detail.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(participant.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <button onClick={downloadCSV} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsTable; 