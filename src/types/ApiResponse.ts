import { EventType } from "./VenueType";
import { BackendImage } from "./BackendImage";
import { DetailType } from "./DetailType";

export type ApiResponse = {
  name?: string;
  about?: string;
  guidlines?: string[];
  type?: EventType;
  from?: string;
  to?: string;
  websiteUrl?: string;
  teamSize?: number;
  isOutsideParticipantAllowed?: boolean;
  tags: string[];
  emails?: string[];
  phoneNumbers?: string[];
  registrationUrl?: string;
  paid?: boolean;
  price?: number;
  paymentQrUrl?: string;
  deadline?: string;
  transcript?: string;
  images?: BackendImage[];
  details?: DetailType[];
};