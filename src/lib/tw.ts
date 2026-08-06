/**
 * Tags a string as Tailwind CSS classes. Returns its argument unchanged -
 * its only purpose is the name `tw`, which ESLint's classnames-order rule
 * and editor Tailwind IntelliSense both recognize by convention, so a class
 * list assigned to a variable still gets sorted and autocompleted the same
 * as an inline `className`.
 *
 * A plain call rather than a tagged template: TypeScript can't infer a
 * literal type through a tagged template's `TemplateStringsArray` argument
 * regardless of how the callee's parameter is typed, so `` tw`h-7` `` would
 * always widen to `string`. `tw("h-7")` keeps the literal type `"h-7"`.
 */
export function tw<T extends string>(classes: T): T {
    return classes;
}
