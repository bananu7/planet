import {observable, computed, action, decorate} from "mobx";
import {TerrainType, Unit, BoardTile, MoveCommand, SplitCommand, Command} from "./Model";
import {Position, Direction} from "./Position";
import * as ViewModel from "./GameViewModel";

const UNIT_SIZE_LIMIT = 99;

export class Player {
    name: string;
    colour: string;
    constructor(name: string, colour: string) {
        this.name = name;
        this.colour = colour
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

    constructor(width: number, height: number, startingUnits: [[number, number], Unit][]) {
        this.width = width;
        this.height = height;
        this.board = [];

        for (let y = 0; y < width; y++) {
            for (let x = 0; x < width; x++) {
                let tile = new BoardTile(BoardState.randomTerrain());

                for (let u of startingUnits) {
                    if (u[0][0] === x && u[0][1] === y) {
                        tile.unit = u[1];
                    }
                }

                this.board.push(tile);
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
        this.players.push(new Player("Bartek", "red"));

        let startingUnits : [[number, number], Unit][] = [
            [[1, 1], new Unit("Bartek", 10)]
        ];

        this.board = new BoardState(20, 20, startingUnits);
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
            },
            makeMove: (m: Command) => {}
        }
    }
}

decorate(GameState, {
    board: observable,
    players: observable,
    commands: observable,
    executeCommand: action
})