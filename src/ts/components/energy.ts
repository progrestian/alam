import { Component } from "../types/component"

export class Energy extends Component {
    private static gain: number = 4

    static getGain(): number {
        return Energy.gain
    }

    constructor(public reserve: number = Energy.gain, public decay: number = 1, public table: Map<string, number> = new Map()) {
        super()
    }

    clone(): Energy {
        return new Energy(this.reserve, this.decay)
    }
}
