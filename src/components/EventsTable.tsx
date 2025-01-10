import { Participant, columns } from "../components/table/columns";
import { DataTable } from "../components/table/data-table";
import participantsData from "../data/iot-participants.json";
import DownloadCSV from './DownloadCSV';
// import { EventsCard } from "./EventsCard";
 
export default function EventsTable() {
  const data = participantsData as Participant[]; 
 
  return (
    <div className="container mx-auto py-10">
      {/* <EventsCard/> */}
      <DataTable columns={columns} data={data} />
      <button className="border border-rounded rounded-3xl bg-blue-500 text-white p-2 m-2 hover:bg-blue-700 ">
      <DownloadCSV data={data} fileName="participants" />
      </button>
    </div>
  );
}
