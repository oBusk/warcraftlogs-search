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
    const allClasses = await getClasses();

    const klass = allClasses.find((klass) => klass.id === id);

    if (!klass) {
        throw new Error(`Class with id ${id} not found`);
    }

    return klass;
}
