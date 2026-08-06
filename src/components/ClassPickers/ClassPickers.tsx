import { type ComponentProps } from "react";
import { getGameData } from "^/lib/wcl/gameData";
import ClassPicker from "./ClassPicker";
import SpecPicker from "./SpecPicker";

export default async function ClassPickers(props: ComponentProps<"div">) {
    const { classes } = await getGameData();

    return (
        <div {...props}>
            <ClassPicker classes={classes} />
            <SpecPicker classes={classes} />
        </div>
    );
}
