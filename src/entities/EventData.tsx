import type { AreaData } from "./AreaData";
import type { ServiceData } from "./ServiceData";
import type { BookedVendor } from "./Vendor";
import type { ValuePiece } from "../components/Upcoming";

export interface ChecklistItem {
  itemId: string;
  item: string;
  isDone: boolean;
}

export interface Items {
  itemId: string;
  item: string;
  isDone: boolean;
}

export interface ProgramItem {
  itemId: string;
  time: string;
  title: string;
  name: string;
}

export interface EventData {
  id?: number;
  userId: number;
  title: string;
  date: ValuePiece;
  location: AreaData | null;
  services: ServiceData | null;
  bookedVendors?: BookedVendor[];
  checklist?: ChecklistItem[];
  program?: ProgramItem[];
}
