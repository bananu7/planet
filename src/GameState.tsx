import {observable, computed, action, decorate} from "mobx";

type Direction = number;
export { Direction };

export type UnitId = number;

export interface MoveCommand {
    tag: "move";
    unit: UnitId;
    direction: Direction;
}

export interface AttackCommand {
    tag: "attack";
    unit: UnitId;
    direction: Direction;
}

export type Command = MoveCommand | AttackCommand;

export class Player {
    money: number = 99;
    constructor(money: number) {
        this.money = money;
    }
}

export class GameState {
    board = [1,2,3,4,5];

    players : Player[] = [];

    constructor() {
        this.players.push(new Player(99));
    }

    executeCommand(command: Command) {
        // todo
    }
}

decorate(GameState, {
    board: observable,
    players: observable,
    executeCommand: action
})