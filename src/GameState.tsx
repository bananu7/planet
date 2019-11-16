import {observable, computed, action, decorate} from "mobx";

const UNIT_SIZE_LIMIT = 99;

enum Direction {
    Up,
    Down,
    Left,
    Right
}

export class Position {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    translated(x: number, y: number) : Position {
        return new Position(this.x + x, this.y + y);
    }

    modified(d: Direction) : Position {
        switch (d) {
            case Direction.Up:
                return this.translated(0, -1);
            case Direction.Down:
                return this.translated(0, 1);
            case Direction.Left:
                return this.translated(0, -1);
            case Direction.Right:
                return this.translated(0, 1);
        }
    }
}

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
    money: number = 99;
    constructor(money: number) {
        this.money = money;
    }
}

enum TerrainType {
    Grass,
    Water
}

class Unit {
    player: string;
    count: number;
}

class BoardTile {
    terrain: TerrainType;
    unit?: Unit;
}

export class BoardState {
    board : BoardTile[];
    width: number;

    private getBoardIndex(p: Position) : number {
        return p.y * this.width + p.x;
    }

    private getBoardTile(p: Position) : BoardTile {
        return this.board[this.getBoardIndex(p)];
    }


    executeMove(move: MoveCommand) {
        let tileA = this.getBoardTile(move.position);
        let tileB = this.getBoardTile(move.position.modified(move.direction));

        
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
        this.players.push(new Player(99));
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
}

decorate(GameState, {
    board: observable,
    players: observable,
    commands: observable,
    executeCommand: action
})