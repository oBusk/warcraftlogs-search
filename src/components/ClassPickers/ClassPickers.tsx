import { ComponentProps } from "react";
import { getClasses } from "^/lib/wcl/classes";
import ClassPicker from "./ClassPicker";
import SpecPicker from "./SpecPicker";

export default async function ClassPickers(props: ComponentProps<"div">) {
    const classes = await getClasses();

    return (
        <div {...props}>
            <ClassPicker classes={classes} />
            <SpecPicker classes={classes} />
        </div>
    );
}
