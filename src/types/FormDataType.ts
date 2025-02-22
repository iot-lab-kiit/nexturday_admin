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
  website?: string;
  emails: string[];
  teamSize: number;
  contactNumbers: string[];
  registrationUrl?: string;
  isPaidEvent: boolean;
  isOutsideParticipantsAllowed: boolean;
  price?: number;
  deadline: string;
  eventTags: string;
  selectedFiles: File[];
  // selectedDocs: File[];
  backendImages?: BackendImage[];
  imagesKeys?: string[];
  details: DetailType[];
  transcriptUrl: string;
}