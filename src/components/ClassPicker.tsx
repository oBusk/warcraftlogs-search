import { getClasses } from "^/lib/classes";
import ClassPickerClient from "./ClassPicker.client";

export interface ClassPickerProps {
    currentClass?: string;
}

export default async function ClassPicker({ currentClass }: ClassPickerProps) {
    const classes = await getClasses();

    return <ClassPickerClient classes={classes} currentClass={currentClass} />;
}
