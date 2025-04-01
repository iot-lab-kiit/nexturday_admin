import { EventType } from './VenueType';
import { DetailType } from './DetailType';
import { BackendImage } from './BackendImage';

export interface FormDataType {
  eventName: string;
  about: string;
  guidelines: string[];
  eventType: EventType;
  fromDate: string;
  toDate: string;
  websiteUrl?: string;
  emails: string[];
  teamSize: number;
  contactNumbers: string[];
  registrationUrl?: string;
  isPaidEvent: boolean;
  isOutsideParticipantAllowed: boolean;
  price?: number;
  paymentQrUrl?: string;
  deadline: string;
  tags: string[];
  selectedFiles: File[];
  // selectedDocs: File[];
  backendImages?: BackendImage[];
  imagesKeys?: string[];
  details: DetailType[];
  transcript: string;
}