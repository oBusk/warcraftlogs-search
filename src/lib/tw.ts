/**
 * Tags a string literal as Tailwind CSS classes. Returns the string
 * unchanged - its only purpose is the name `tw`, which ESLint's
 * classnames-order rule and editor Tailwind IntelliSense both recognize by
 * convention, so a class list assigned to a variable still gets sorted and
 * autocompleted the same as an inline `className`.
 *
 * No interpolation: this is for static class lists only. Compose classes
 * dynamically with `clsx`/`twMerge` instead.
 */
export function tw(strings: TemplateStringsArray): string {
    return strings[0];
}
