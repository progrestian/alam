import { Color } from "../components/color"
import { Energy } from "../components/energy"
import { Movement } from "../components/movement"
import { Position } from "../components/position"
import { Sense } from "../components/sense"

export class Depot {
    color: Color
    energy: Energy
    movement: Movement
    position: Position
    sense: Sense

    constructor(params?: {
        color?: Color,
        energy?: Energy,
        movement?: Movement
        position?: Position
        sense?: Sense
    }) {
        this.color = params?.color ?? new Color()
        this.energy = params?.energy ?? new Energy()
        this.movement = params?.movement ?? new Movement()
        this.position = params?.position ?? new Position()
        this.sense = params?.sense ?? new Sense()
    }

    clone(): Depot {
        return new Depot({
            color: this.color?.clone(),
            energy: this.energy?.clone(),
            movement: this.movement?.clone(),
            position: this.position?.clone(),
            sense: this.sense?.clone()
        })
    }
}
