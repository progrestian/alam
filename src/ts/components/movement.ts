import { Component } from "../types/component"
import { Position } from './position'

export class Movement extends Component {
    random: boolean = false
    target: Position | undefined = undefined

    constructor(public steps: number = 1, public cost: number = 1) {
        super()
    }

    clone(): Movement {
        const movement = new Movement(this.steps, this.cost)
        movement.target = this.target?.clone()
        return movement
    }
}
