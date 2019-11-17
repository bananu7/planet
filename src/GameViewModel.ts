import {TerrainType, Unit, BoardTile, Command} from "./Model";
import {Position} from "./Position";

export interface Board {
    width: number;
    height: number;
    getTileAt(p: Position): BoardTile;
}

export interface Player {
    name: string;
    colour: string;
}

export interface GameState {
    players: Player[];
    board: Board;

    makeMove(command: Command) : void;
}
