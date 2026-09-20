import type { EquipmentView } from "./equipmentView"
import type {HistoryDestination} from "./history" 

export type ShopView = {
    id:number,
    equipments:EquipmentView[],
    destination:HistoryDestination;
}