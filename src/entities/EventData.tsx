import type { AreaData } from "./AreaData";
import type { ServiceData } from "./ServiceData";
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

export interface EventData {
  id?: number;
  userId: number;
  title: string;
  date: ValuePiece;
  location: AreaData | null;
  services: ServiceData | null;
  checklist?: ChecklistItem[];
}
