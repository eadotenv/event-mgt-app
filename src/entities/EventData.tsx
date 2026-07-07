import type { AreaData } from "./AreaData";
import type { ServiceData } from "./ServiceData";
import type { ValuePiece } from "../components/Upcoming";

export interface EventData {
  id?: number;
  userId: number;
  title: string;
  date: ValuePiece;
  location: AreaData | null;
  services: ServiceData | null;
}
