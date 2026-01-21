import { districtsArray } from "../../Windows/MapWindow/districtsArray";

export const districtsAdminArray = districtsArray.map((district) => ({
    name: district.name,
    area: district.area.map(areaItem =>({
        id: areaItem.id,
        name: areaItem.name
    }))
}))