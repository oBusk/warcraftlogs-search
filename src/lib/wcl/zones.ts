import type NameId from "../NameId";
import { getGameData } from "./gameData";

export interface Partition extends NameId {}

export interface Encounter extends NameId {}

export interface Difficulty extends NameId {}

export interface Zone extends NameId {
    partitions: Partition[];
    encounters: Encounter[];
    difficulties: Difficulty[];
}

export async function getZones() {
    return (await getGameData()).zones;
}
