import { Component } from "../types/component"

export class Sense extends Component {
    constructor(public vision: number = 0, public preys: string[] = []) {
        super()
    }

    clone(): Sense {
        return new Sense(this.vision, this.preys)
    }
}
