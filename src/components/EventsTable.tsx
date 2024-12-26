import { Participant, columns } from "../components/table/columns";
import { DataTable } from "../components/table/data-table"; // Import the JSON data
import participantsData from "../data/participants.json"; // Import the JSON data

export default function EventsTable() {
  const data = participantsData as Participant[]; // Cast the JSON data to the Payment type

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
