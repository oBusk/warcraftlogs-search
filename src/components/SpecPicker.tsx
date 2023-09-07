import { getClass, getClasses } from "^/lib/classes";
import SpecPickerClient from "./SpecPicker.client";

export default async function SpecPicker() {
    const classes = await getClasses();

    return <SpecPickerClient classes={classes} />;
}
