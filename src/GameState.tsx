import {observable, computed, action, decorate} from "mobx";
import {TerrainType, Unit, BoardTile} from "./Model";
import {Position, Direction} from "./Position";
import * as ViewModel from "./GameViewModel";

const UNIT_SIZE_LIMIT = 99;

export interface MoveCommand {
    tag: "move";
    position: Position;
    direction: Direction;
}

export interface SplitCommand {
    tag: "split";
    position: Position;
    direction: Direction;
    amount: number;
}

export type Command = MoveCommand | SplitCommand;

export class Player {
    name: string;
    constructor( name: string) {
        this.name = name;
    }
}

export class BoardState {
    board : BoardTile[];
    width: number;
    height: number;

    private getBoardIndex(p: Position) : number {
        return p.y * this.width + p.x;
    }

    private static randomTerrain() : TerrainType {
        return Math.random() > 0.3 ? TerrainType.Grass : TerrainType.Water;
    }

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.board = [];

        for (let y = 0; y < width; y++) {
            for (let x = 0; x < width; x++) {
                this.board.push(new BoardTile(BoardState.randomTerrain()));
            }
        }
    }

    getTileAt(p: Position) : BoardTile {
        return this.board[this.getBoardIndex(p)];
    }

    getWidth() : number { return this.width; }
    getHeight() : number { return this.height; }

    executeMove(move: MoveCommand) {
        let tileA = this.getTileAt(move.position);
        let tileB = this.getTileAt(move.position.modified(move.direction));

        
        if (tileB.unit) {
            if (tileB.unit.player != tileA.unit.player) { // fight

            } else { // merge
                if (tileA.unit.count + tileB.unit.count <= UNIT_SIZE_LIMIT) {
                    tileB.unit.count += tileA.unit.count;
                    tileA.unit = null;
                } else {
                    tileA.unit.count = UNIT_SIZE_LIMIT - (tileA.unit.count + tileB.unit.count);
                    tileB.unit.count = UNIT_SIZE_LIMIT;
                    
                }
            }
        } else {
            tileB.unit = tileA.unit;
            tileA.unit = null;
        }
    }

    executeSplit(move: SplitCommand) {

    }
}

export class GameState {
    players : Player[] = [];
    commands: [Command];
    board: BoardState;

    constructor() {
        this.players.push(new Player("Bartek"));
        this.board = new BoardState(20, 20);
    }

    /** Adds the command to the current round */
    addCommand(command: Command) {
        this.commands.push(command);
    }

    /** Take all the commands in the queue and resolve them */
    executeRound() {
        for (let command of this.commands) {
            switch (command.tag) {
                case "move":
                    this.board.executeMove(command);
                break;
                case "split":
                    this.board.executeSplit(command);
                break;
            }
        }
    }

    createViewModel() : ViewModel.GameState {
        return {
            players: this.players.map(x => x),
            board: {
                width: this.board.getWidth(),
                height: this.board.getWidth(),
                getTileAt: (p: Position) => this.board.getTileAt(p)
            }
        }
    }
}

decorate(GameState, {
    board: observable,
    players: observable,
    commands: observable,
    executeCommand: action
})