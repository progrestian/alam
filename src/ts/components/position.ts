import { Component } from "../types/component"

export class Position extends Component {
    default = true

    constructor(public x: number = 0, public y: number = 0, public index: number = 0) {
        super()
    }

    clone(): Position {
        return new Position(this.x, this.y, this.index)
    }

    equal(compared: Position): boolean {
        return this.x === compared.x && this.y === compared.y && this.index === compared.index
    }
}
