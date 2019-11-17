import {Position, Direction} from "./Position";

/* Board and game */

export enum TerrainType {
    Grass,
    Water
}

export class Unit {
    player: string;
    count: number;

    constructor(player: string, count: number) {
    	this.player = player;
    	this.count = count;
    }
}

export class City {
	owner?: string;
}

export class BoardTile {
    terrain: TerrainType;
    unit?: Unit;
    city?: City;

    constructor(terrain: TerrainType) {
    	this.terrain = terrain;
    }
}

/* User input */

export interface Command {
    position: Position;
    destination: Position;
}