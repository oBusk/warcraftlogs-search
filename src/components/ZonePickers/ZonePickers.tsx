import { type ComponentProps } from "react";
import { getGameData } from "^/lib/wcl/gameData";
import DifficultyPicker from "./DifficultyPicker";
import EncounterPicker from "./EncounterPicker";
import MetricPicker from "./MetricPicker";
import PartitionPicker from "./PartitionPicker";
import RegionPicker from "./RegionPicker";
import ZonePicker from "./ZonePicker";

export default async function ZonePickers(props: ComponentProps<"div">) {
    const { regions, zones } = await getGameData();

    return (
        <div {...props}>
            <RegionPicker regions={regions} />
            <ZonePicker zones={zones} />
            <EncounterPicker zones={zones} />
            <DifficultyPicker zones={zones} />
            <PartitionPicker zones={zones} />
            <MetricPicker />
        </div>
    );
}
