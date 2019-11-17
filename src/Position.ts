export enum Direction {
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
