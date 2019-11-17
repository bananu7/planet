export enum TerrainType {
    Grass,
    Water
}

export class Unit {
    player: string;
    count: number;
}

export class BoardTile {
    terrain: TerrainType;
    unit?: Unit;

    constructor(terrain: TerrainType) {
    	this.terrain = terrain;
    }
}