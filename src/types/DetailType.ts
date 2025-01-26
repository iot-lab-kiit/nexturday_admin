import { VenueType, EventType } from "./VenueType";

export interface DetailType {
  name: string;
  about: string;
  from: string;
  to: string;
  type: EventType;
  venue: VenueType;
}
