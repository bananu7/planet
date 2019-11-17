import {observable, computed, action, decorate} from "mobx";
import {TerrainType, Unit, BoardTile, Command} from "./Model";
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

    spawnUnitsFor(playerName: string) {
        for (let y = 0; y < this.width; y++) {
            for (let x = 0; x < this.width; x++) {
                let tile = this.getTileAt(new Position(x,y));

                if (!tile.city) continue;
                if (tile.city.owner !== playerName) continue;

                if (!tile.unit)
                    tile.unit = new Unit(playerName, 10);
                else
                    tile.unit.count += 10;

                if (tile.unit.count > UNIT_SIZE_LIMIT)
                    tile.unit.count = UNIT_SIZE_LIMIT;
            }
        }
    }

    executeCommand(move: Command) {
        let tileA = this.getTileAt(move.position);
        let tileB = this.getTileAt(move.destination);

        if (tileA.unit && tileB.unit) {
            if (tileB.unit.player != tileA.unit.player) { // fight

            } else { // merge
                if (tileA.unit.count + tileB.unit.count <= UNIT_SIZE_LIMIT) {
                    tileB.unit.count += tileA.unit.count;
                    tileA.unit = undefined;
                } else {
                    tileA.unit.count = UNIT_SIZE_LIMIT - (tileA.unit.count + tileB.unit.count);
                    tileB.unit.count = UNIT_SIZE_LIMIT;
                    
                }
            }
        } else {
            tileB.unit = tileA.unit;
            tileA.unit = undefined;
        }
    }
}

export class GameState {
    private players : Player[] = [];
    private board: BoardState;

    constructor() {
        this.players.push(new Player("Bartek", "red"));

        let startingUnits : [[number, number], Unit][] = [
            [[1, 1], new Unit("Bartek", 10)]
        ];

        this.board = new BoardState(15, 15, startingUnits);
    }

    executeCommand(command: Command) {
        this.board.executeCommand(command);
    }

    private advanceToNextPlayer() {        
        // TODO make sure this.players is never empty
        this.players.push(this.players.shift()!);
    }

    get currentPlayer() : Player {
        return this.players[0];
    }

    endRound() {
        this.board.spawnUnitsFor(this.currentPlayer.name);
        this.advanceToNextPlayer();
    }

    get viewModel() : ViewModel.GameState {
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
