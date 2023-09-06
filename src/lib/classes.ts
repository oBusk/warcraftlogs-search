import { gql } from "graphql-request";
import { getClient } from "./client";

export async function getClasses() {
    const client = await getClient();

    const {
        gameData: { classes },
    } = await client.request<{
        gameData: {
            classes: {
                name: string;
            }[];
        };
    }>(gql`
        query getClasses {
            gameData {
                classes {
                    name
                }
            }
        }
    `);

    return classes
        .map(({ name }) => name)
        .map((name) => name.replace(/ /g, ""));
}
