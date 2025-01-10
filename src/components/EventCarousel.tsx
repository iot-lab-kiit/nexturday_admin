import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import {data} from "./EventsData";
import EventsTable from "./EventsTable";


export function EventCarousel() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full">
      <h2 className="max-w-7xl pl-4 mx-auto text-3xl font-bold text-neutral-800 dark:text-neutral-200 ">
        Upcoming Events
      </h2>
      <Carousel items={cards} />
      <EventsTable/>
      <div>
    </div>
    </div>
  );
}


