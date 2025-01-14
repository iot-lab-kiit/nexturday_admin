import { FileDown } from "lucide-react";
import { Participant, columns } from "../table/columns";
import { DataTable } from "../table/data-table";
import participantsData from "../../data/iot-participants.json";
import DownloadCSV from "../Global/DownloadCSV";
import { Button } from "@/components/ui/button";

export default function EventsTable() {
  const data = participantsData as Participant[];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
      <Button>
      <FileDown />
        <DownloadCSV data={data} fileName="participants" />
      </Button>
    </div>
  );
}