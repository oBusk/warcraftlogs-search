import { gql } from "graphql-request";
import { getClient } from "./client";

export interface Spec {
    name: string;
    id: number;
}

export interface Klass {
    name: string;
    id: number;
    specs: Spec[];
}

const ClassFields = gql`
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
    const client = await getClient();

    const {
        gameData: { classes },
    } = await client.request<{
        gameData: {
            classes: Klass[];
        };
    }>(gql`
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
    const client = await getClient();

    const {
        gameData: { class: klass },
    } = await client.request<{
        gameData: {
            class: Klass;
        };
    }>(
        gql`
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
