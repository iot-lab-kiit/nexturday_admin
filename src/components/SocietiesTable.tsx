import societies from "../data/societies.json";
import events from "../data/events.json";

function SocietiesTable() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Societies</h1>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Contact</th>
            <th className="border border-gray-300 p-2">Website</th>
            <th className="border border-gray-300 p-2">Events</th>
          </tr>
        </thead>
        <tbody>
          {societies.map((society) => (
            <tr key={society.id}>
              <td className="border border-gray-300 p-2">{society.name}</td>
              <td className="border border-gray-300 p-2">{society.email}</td>
              <td className="border border-gray-300 p-2">{society.contact}</td>
              <td className="border border-gray-300 p-2">
                <a
                  href={society.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {society.website}
                </a>
              </td>
              <td className="border border-gray-300 p-2">
                {society.events
                  ? society.events
                      .map((eventId) =>
                        events.find((event) => event.id === eventId)?.name
                      )
                      .join(", ")
                  : "No Events"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SocietiesTable;
