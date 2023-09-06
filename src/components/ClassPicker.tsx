import { getClasses } from "^/lib/classes";
import ClassPickerClient from "./ClassPicker.client";

export interface ClassPickerProps {
    klass?: number;
}

export default async function ClassPicker({ klass }: ClassPickerProps) {
    const classes = await getClasses();

    return <ClassPickerClient classes={classes} klass={klass} />;
}
