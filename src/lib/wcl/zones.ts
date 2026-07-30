import type NameId from "../NameId";

export interface Partition extends NameId {}

export interface Encounter extends NameId {}

export interface Difficulty extends NameId {}

export interface Zone extends NameId {
    partitions: Partition[];
    encounters: Encounter[];
    difficulties: Difficulty[];
}
