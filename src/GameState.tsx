import {observable, computed, action, decorate} from "mobx";

type Direction = number;
export { Direction };

export class Position {
    x: number;
    y: number;
}

export interface MoveCommand {
    tag: "move";
    location: Position;
    direction: Direction;
}

export interface SplitCommand {
    tag: "split";
    location: Position;
    direction: Direction;
}

export type Command = MoveCommand | SplitCommand;

export class Player {
    money: number = 99;
    constructor(money: number) {
        this.money = money;
    }
}

export class BoardState {
    board : number[] = [1,2,3,4,5];
    width: number;

    private getBoardIndex(p : Position) : number {
        return p.y * this.width + p.x;
    }

    executeMove(move: MoveCommand) {

    }
}

export class GameState {
    players : Player[] = [];
    commands: [Command]

    constructor() {
        this.players.push(new Player(99));
    }

    /** Adds the command to the current round */
    addCommand(command: Command) {
        this.commands.push(command);
    }

    /** Take all the commands in the queue and resolve them */
    executeRound() {
        for (let command in this.commands) {
            switch (this.commands[command].tag) {
                case "move":

                break;
            }
        }
    }
}

decorate(GameState, {
    board: observable,
    players: observable,
    executeCommand: action
})