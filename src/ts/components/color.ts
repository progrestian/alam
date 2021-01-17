import { Component } from "../types/component"

export class Color extends Component {
    private static colors: string[] = []

    private index: number

    constructor(input: number | string = '#00000000') {
        super()

        if (typeof input === "number") {
            this.index = input
        } else {
            if (input[0] !== '#' || ![4, 5, 7, 9].includes(input.length)) throw new Error()

            let chars = input.split('')
            chars.shift()

            if (chars.length === 3 || chars.length === 4) {
                for (let i = 0; i < chars.length; i += 2) {
                    chars.splice(i, 0, chars[i])
                }
            }

            if (chars.length === 6) {
                chars.concat(['F', 'F'])
            }

            let red = parseInt(chars[0] + chars[1], 16)
            let green = parseInt(chars[2] + chars[3], 16)
            let blue = parseInt(chars[4] + chars[5], 16)
            let alpha = parseInt(chars[6] + chars[7], 16)

            for (let color of [red, green, blue, alpha]) {
                if (color < 0 || 255 < color) {
                    throw new Error()
                }
            }

            Color.colors.push(`rgba(${red}, ${green}, ${blue}, ${alpha / 255})`)
            this.index = Color.colors.length - 1
        }
    }

    clone(): Color {
        return new Color(this.index)
    }

    get rgba(): string {
        return Color.colors[this.index]
    }
}
