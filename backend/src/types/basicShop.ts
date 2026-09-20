import type { HistoryDestination } from "../../../shared/types/history.js";
import type { Equipment } from "../classes/Equipment.js";

export type  BasicShop = {
    id:number;
    destination:HistoryDestination;
    basicEquipmentId:number[];
    
}
