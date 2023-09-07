import { wclFetch } from "./wclFetch";

export interface Spec {
    name: string;
    id: number;
}

export interface Klass {
    name: string;
    id: number;
    specs: Spec[];
}

const ClassFields = /* GraphQL */ `
    fragment ClassFields on GameClass {
        name
        id
        specs {
            name
            id
        }
    }
`;

export async function getClasses() {
    const {
        gameData: { classes },
    } = await wclFetch<{
        gameData: {
            classes: Klass[];
        };
    }>(/* GraphQL */ `
        query getClasses {
            gameData {
                classes {
                    ...ClassFields
                }
            }
        }
        ${ClassFields}
    `);

    return classes.map(({ name, ...rest }) => ({
        ...rest,
        name: name.replace(" ", ""),
    }));
}

export async function getClass(id: number) {
    const {
        gameData: { class: klass },
    } = await wclFetch<{
        gameData: {
            class: Klass;
        };
    }>(
        /* GraphQL */ `
            query getClass($id: Int!) {
                gameData {
                    class(id: $id) {
                        ...ClassFields
                    }
                }
            }
            ${ClassFields}
        `,
        { id },
    );

    return { ...klass, name: klass.name.replace(" ", "") };
}
