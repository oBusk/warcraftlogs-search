import { type ComponentProps } from "react";
import type { Klass } from "^/lib/wcl/classes";
import ClassPicker from "./ClassPicker";
import SpecPicker from "./SpecPicker";

export interface ClassPickersProps extends ComponentProps<"div"> {
    classes: Klass[];
}

export default function ClassPickers({ classes, ...props }: ClassPickersProps) {
    return (
        <div {...props}>
            <ClassPicker classes={classes} />
            <SpecPicker classes={classes} />
        </div>
    );
}
